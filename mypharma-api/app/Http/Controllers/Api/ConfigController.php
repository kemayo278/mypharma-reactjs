<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConfigResource;
use App\Models\Config;
use Illuminate\Http\Request;

class ConfigController extends Controller
{

    public function show($id)
    {
        $config = Config::findOrFail($id);

        if (!$config) {
            return response(['error' => 'config not found'],404);
        }

        return new ConfigResource($config);
    }

    public function update(Request $request, $id)
    {
        try {

            $config = Config::find($id);

            if (!$config) {
                return response(['error' => 'config not found'],404);
            }

            $request->validate([
                'begin' => 'required|date',
                'end' => 'required|date|after:begin'
            ]);

            $config->update([
                'begin' => trim($request['begin']),
                'end' => trim($request['end']),
            ]);

            return response()->json(['message' => 'configuration updated successfully', 'configuration' => $config]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
