<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Config;
use App\Models\Role;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::with('role')->orderBy('id','desc')->get());
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response(['error' => 'user not found'],404);
        }

        $user->load('role');

        $config = Config::first();

        $dateEnd = $config->end;

        $currentDate = new DateTime();

        $endDate = new DateTime($dateEnd);

        $interval = $currentDate->diff($endDate);

        $currentDateFormatted = $currentDate->format('Y-m-d');

        $endDateFormatted = $endDate->format('Y-m-d');

        $interval = $currentDate->diff($endDate);

        if ($currentDateFormatted > $endDateFormatted) {
            // $daysDifference = $interval->days ;
            $message = "La date de fin est passée depuis " . $interval->days . " jour(s)";
            $nbDelay = -1;
        } else {
            $message = "Il reste " . $interval->days . " jour(s) jusqu'à la date de fin";
            $nbDelay = $interval->days;
            // return $nbDelay;
        }

        return response()->json([
            'data' => new UserResource($user),
            'dateEnd' => $dateEnd,
            'message' => $message,
            'nbDelay' => $nbDelay,
        ]);

        return new UserResource($user);
    }

    public function update(Request $request, $id)
    {
        try{

            $user = User::find($id);

            if (!$user) {
                return response(['error' => 'user not found'],404);
            }

            $request->validate([
                'first_name' => 'required|string',
                'second_name' => 'required|string',
                'email' => 'required|string|email',
                'cni_number' => 'required|string',
                'pseudo' => 'required|string',
            ]);

            $user->update([
                'first_name' => ucwords(strtolower(trim($request['first_name']))),
                'second_name' => ucwords(strtolower(trim($request['second_name']))),
                'email' => trim($request['email']),
                'pseudo' => trim($request['pseudo']),
                'cni_number' => $request['cni_number'],
            ]);

            if ($request->filled('phone')) {
                $user->update([
                    'phone' => trim($request['phone']),
                ]);
            }

            if ($request->hasFile('img')) {
                $file = $request->file('img');
                $currentDateTime = now()->format('Y-m-d_H-i-s');
                $milliseconds = round(microtime(true) * 1000);
                $filename = "IMG-{$currentDateTime}-{$milliseconds}.{$file->getClientOriginalExtension()}";
                $file->storeAs('avatars', $filename, 'public');
                $user->update([
                    'img' => $filename,
                ]);
            } else {
                $filename = null;
            }

            $user = new UserResource($user);

            return response()->json(['message' => 'user updated successfully', 'user' => $user], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function setRoleAndDegree(Request $request, $id)
    {
        try{
            $user = User::find($id);

            if (!$user) {
                return response(['error' => 'user not found'],404);
            }

            $request->validate([
                'role_id' => 'required',
                'degree' => 'required',
            ]);

            $user->update([
                'degree' => trim($request['degree']),
                'role_id' => trim($request['role_id'])
            ]);

            return response()->json(['message' => 'User role and degree updated successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }


    public function setrole(Request $request, $id)
    {
        try{
            $user = User::find($id);

            if (!$user) {
                return response(['error' => 'user not found'],404);
            }

            $request->validate([
                'role_id' => 'required',
            ]);

            $role = Role::where('name',(trim($request['role_id'])))->first();

            $user->update([
                'role_id' => trim($role->id),
            ]);

            return response()->json(['message' => 'User updated successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function changeDegree(Request $request , $id)
    {
        try {
            $user = User::find($id);

            if(!$user){
                return response()->json(['errornotfound' => 'User not found'], 422);
            }

            $request->validate([
                'degree' => 'required',
            ]);

            $user->update([
                'degree' => trim($request['degree']),
            ]);

            return response()->json(['message' => 'user degree updated success']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
