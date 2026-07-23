<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function index()
    {
        return  InstitutionResource::collection(Institution::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'matriculation' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'pj' => 'nullable|string|max:255',
                'number_register' => 'required|string|max:255',
                'pj_register' => 'nullable|string|max:255',
                'num_declaration' => 'required|string|max:255',
                'cycle' => 'nullable|string|max:255',
                'telephone' => 'nullable|string|max:255',
                'couverture' =>'nullable|string|max:255',
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


            $institution = Institution::create([
                'name' => trim($request['name']),
                'state' => trim($request['state']),
                'matriculation' => trim($request['matriculation']),
                'phone' =>  trim($request['phone']),
                'pj' =>  trim($request['pj']),
                'number_register' => trim($request['number_register']),
                'pj_register' => trim($request['pj_register']),
                'num_declaration' => trim($request['num_declaration']),
                'img' => $filename,
                'cycle' => trim($request['cycle']),
                'telephone' => trim($request['telephone']),
                'couverture' => trim($request['couverture']),
            ]);


            return response()->json(['message' => 'institution created successfully', 'institution' => $institution], 200);

         } catch (\Illuminate\Validation\ValidationException $e) {
             return response()->json(['errors' => $e->errors()], 422);
          } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $institution = Institution::find($id);

        if (!$institution) {
            return response(['error' => 'institution not found'],404);
        }
        return new InstitutionResource($institution);
    }

    public function update(Request $request, $id)
    {
        try {
            $institution = Institution::find($id);

            if (!$institution) {
                return response(['error' => 'institution not found'],404);
            }

            $request->validate([
                'name' => 'required|string|max:255',
                'state' => 'required|string|max:255',
                'matriculation' => 'nullable|string|max:255',
                'phone' => 'required|string|max:255',
                'pj' => 'nullable|string|max:255',
                'number_register' => 'nullable|string|max:255',
                'pj_register' => 'nullable|string|max:255',
                'num_declaration' => 'nullable|string|max:255',
                'cycle' => 'nullable|string|max:255',
                'telephone' => 'nullable|string|max:255',
                'couverture' =>'nullable|string|max:255',
            ]);


            $institution->update([
                'name' => trim($request['name']),
                'state' => trim($request['state']),
                'matriculation' => trim($request['matriculation']),
                'phone' =>  trim($request['phone']),
                'pj' =>  trim($request['pj']),
                'number_register' => trim($request['number_register']),
                'pj_register' => trim($request['pj_register']),
                'num_declaration' => trim($request['num_declaration']),
                'cycle' => trim($request['cycle']),
                'telephone' => trim($request['telephone']),
                'couverture' => trim($request['couverture']),
            ]);

            if ($request->hasFile('img')) {
                $file = $request->file('img');
                $currentDateTime = now()->format('Y-m-d_H-i-s');
                $milliseconds = round(microtime(true) * 1000);
                $filename = "IMG-{$currentDateTime}-{$milliseconds}.{$file->getClientOriginalExtension()}";
                $file->storeAs('avatars', $filename, 'public');
                $institution->update([
                    'img' => $filename,
                ]);
            } else {
                $filename = null;
            }

            return response()->json(['message' => 'institution updated successfully', 'institution' => $institution], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
