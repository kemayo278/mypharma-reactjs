<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use Database\Seeders\ProviderSeeder;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index()
    {
        return ProviderResource::collection(Provider::orderBy('created_at', 'asc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:providers,name',
            ]);

            $provider = Provider::create([
                'name' => trim($request['name']),
                'email' => trim($request['email']),
                'phone' => trim($request['phone']),
                'location' => trim($request['location']),
            ]);

            return response()->json(['message' => 'provider created successfully', 'provider' => $provider], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $provider = Provider::find($id);

        if (!$provider) {
            return response(['error' => 'provider not found'],404);
        }

        return new ProviderResource($provider);
    }

    public function update(Request $request, $id)
    {
        try {
            $provider = Provider::find($id);

            if (!$provider) {
                return response(['error' => 'provider not found'],404);
            }

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'phone'=>'required|string|max:255',
                'location'=>'required|string|max:255',
            ]);

            $provider->update([
                'name' => trim($request['name']),
                'email' => trim($request['email']),
                'phone' => trim($request['phone']),
                'location' => trim($request['location']),
            ]);

            return response()->json(['message' => 'Provider updated successfully', 'provider' => $provider]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $provider = Provider::find($id);

            if (!$provider) {
                return response(['error' => 'provider not found'],404);
            }

            if ($provider->entries()->exists()) {
                return response()->json(['message' => 'Impossible de supprimer cet entrée.'], 500);
            }

            $provider->delete();

            return response()->json(['message' => 'provider deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
