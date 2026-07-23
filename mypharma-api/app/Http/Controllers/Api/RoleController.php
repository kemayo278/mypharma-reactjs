<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return RoleResource::collection(Role::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
            ]);

            $role = Role::create([
                'name' =>trim($request['name']),
            ]);

            return response()->json(['message' => 'Post created successfully', 'role' => $role], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response(['error' => 'role not found'],404);
        }

        return new RoleResource($role);
    }

    public function update(Request $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response(['error' => 'role not found'],404);
            }

            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $role->update([
                'name' => trim($request['name']),
            ]);

            return response()->json(['message' => 'Post updated successfully', 'role' => $role]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response(['error' => 'role not found'],404);
            }

            if ($role->users()->exists()) {
                return response()->json(['message' => 'Impossible de supprimer cette categorie.'], 500);
            }

            $role->delete();
            return response()->json(['message' => 'role deleted successfully'], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
