<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use App\Models\Config;
use DateTime;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email_or_pseudo' => 'required|string',
                'password' => 'required|string',
            ]);

            $emailOrPseudo = $request->input('email_or_pseudo');

            $password = $request->input('password');

            $user = User::where('email', $emailOrPseudo)->orWhere('pseudo', $emailOrPseudo)->first();

            if (!$user) {
                return response([
                    'message' => "Ces informations d'identification ne correspondent pas !"
                ], 422);
            }

            if (!Auth::attempt(['email' => $user->email, 'password' => $password])) {
                return response([
                    'message' => 'Votre mot de passe est incorrect',
                    'debug' => 'Auth attempt failed'
                ], 500);
            }

            if ($user->state == 'waiting_for') {
                return response([
                    'message' => 'Votre compte est en attente de validation',
                    'state' => $user->state
                ], 500);
            }

            if ($user->state == 'idle') {
                return response([
                    'message' => 'Votre compte a été désactivé',
                    'state' => $user->state
                ], 500);
            }

            $config = Config::first();

            $dateEnd = $config->end;

            if ($config->end < date('Y-m-d') ) {
                return response([
                    'message' => 'Votre forfait est expiré, Veillez Contacter l\'Administrateur',
                    'config' => $config->end
                ], 500);
            }

            $currentDate = new DateTime();

            $endDate = new DateTime($dateEnd);

            $interval = $currentDate->diff($endDate);

            $daysDifference = $interval->days;

            $message = "Il reste $daysDifference jours avant la date de fin.";

            $nbDelay = intval($daysDifference);

            $token = $user->createToken('main')->plainTextToken;

            $resourceuser = new UserResource($user);

            return response(compact('user', 'token','resourceuser','dateEnd','message','nbDelay'));

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function forgetPassword($email = null)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response([
                'errormessage' => 'user not found'
            ],422);
        }

        $fiveDigitCode = $this->generateFiveDigitCode();

        $data = ['name' => 'MY LOUNGE', 'title' => 'Votre code de renitialisation de mot de passe a été envoyé avec succès' , 'data' => 'le code est : '.$fiveDigitCode];

        $user['to'] = $user->email;

        try {
            Mail::send('mail', $data, function ($message) use ($user) {
                $message->from('work@kokitechgroup.com', 'SERVICE INFOS MY LOUNGE');
                $message->to($user['to']);
                $message->subject('OTP VERIFICATION');
            });
        } catch (\Throwable $th) {
            return response([
                'errormessage' => 'Une erreur s\'est produite lors de l\'envoi du code de renitialisation'
            ],422);
        }


        return response()->json(['message' => 'email authenficated successfully', 'id' => $user->id, 'code' => $fiveDigitCode]);
    }

    public function generateFiveDigitCode()
    {
        $code = random_int(10000, 99999);
        return $code;
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('',204);
    }

    public function signup(Request $request)
    {
       try {
            $request->validate([
                'first_name' => 'required|string',
                'second_name' => 'required|string',
                'email' => 'required|string|email|unique:users,email',
                'pseudo' => 'required|string|unique:users,pseudo',
                'state' =>'required|string',
                'cni_number' => 'required|string|unique:users,cni_number',
                'role_id' => 'required',
                'password' => 'required',
            ]);

            if ($request->hasFile('img')) {
                $file = $request->file('img');
                $currentDateTime = now()->format('Y-m-d_H-i-s');
                $milliseconds = round(microtime(true) * 1000);
                $filename = "IMG-{$currentDateTime}-{$milliseconds}.{$file->getClientOriginalExtension()}";
                $file->storeAs('avatars', $filename, 'public');
            }else {
                $filename = null;
            }

            $role = Role::where('name',(trim($request['role_id'])))->first();

            $config = Config::first();

            $dateEnd = $config->end;

            if ($config->end <= date('Y-m-d') ) {
                return response([
                    'message' => 'Votre forfait est expiré, Veillez Contacter l\'Administrateur',
                    'config' => $config->end
                ], 500);
            }

            $user = User::create([
                'first_name' => ucwords(strtolower(trim($request['first_name']))),
                'second_name' => ucwords(strtolower(trim($request['second_name']))),
                'email' => trim($request['email']),
                'password' => bcrypt(trim($request['password'])),
                'state' => trim($request['state']),
                'phone' => trim($request['phone']),
                'img' => $filename,
                'cni_number' => trim($request['cni_number']),
                'role_id' => $role->id,
                'degree' => 4,
                'pseudo' => trim($request['pseudo'])
            ]);

            $token = $user->createToken('main')->plainTextToken;

            $message = "user created successfully";

            $resourceuser = new UserResource($user);

            return response(compact('user','token','message','resourceuser','dateEnd'));

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function resetPassword(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'user not found'], 404);
        }

        $user->update([
            'password' => bcrypt(trim($request['password']))
        ]);

        return response()->json(['message' => 'password reset success']);
    }

    public function setstate($id,$newState)
    {
        try {
            $user = User::find($id);

            $user->update([
                'state' => $newState
            ]);

            return response()->json(['message' => 'user state updated success']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
