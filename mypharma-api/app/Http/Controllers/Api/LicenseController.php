<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LicenceResource;
use App\Models\License;
use App\Models\Config;
use Illuminate\Http\Request;

class LicenseController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'config_id' => 'nullable|exists:configs,id',
                'duration_days' => 'required|integer|min:1',
                'amount' => 'required|numeric|min:0',
                'payment_method' => 'required|string|max:255',
                'phone_number' => 'required|string|max:30',
                'begin_date' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);

            $configId = 1;

            $license = License::where('config_id', $configId)->latest()->first();

            $beginDate = date('Y-m-d');

            if($license && $license->end_date && $license->end_date > $beginDate) {
                $beginDate = $license->end_date;
            }

            $endDate = date('Y-m-d', strtotime($beginDate . ' + ' . $request->duration_days . ' days'));

            $license = License::create([
                'activation_key' => License::generateActivationKey(),
                'user_id' => $request->user_id,
                'config_id' => $configId,
                'duration_days' => $request->duration_days,
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'phone_number' => $request->phone_number,
                'begin_date' => $beginDate,
                'end_date' => $endDate,
                'is_active' => true,
                'notes' => $request->notes,
            ]);

            $license->load(['config', 'user']);

            return response()->json([
                'message' => 'License created successfully',
                'license' => new LicenceResource($license)
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the license'], 500);
        }
    }

    public function reactivate(Request $request)
    {
        try {
            $request->validate([
                'activation_key' => 'required|string|exists:licenses,activation_key',
                // 'duration_days'  => 'required|integer|min:1'
            ]);

            $license = License::where('activation_key', $request->activation_key)->first();


            $config = Config::find($license->config_id);

            if (!$config) {
                return response()->json(['error' => 'Config not found for the license'], 404);
            }

            $config->update([
                'end' => $license->end_date
            ]);

            $license->update([
                'is_active' => false,
            ]);

            $dateEnd = $license->end_date;

            $daysDifference = (strtotime($dateEnd) - strtotime(date('Y-m-d'))) / (60 * 60 * 24);

            $message = "Il reste $daysDifference jours avant la date de fin.";

            $nbDelay = intval($daysDifference);

            return response()->json([
                'license' => new LicenceResource($license),
                'dateEnd' => $dateEnd,
                'message' => $message,
                'nbDelay' => $nbDelay
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while reactivating the license'], 500);
        }
    }


    public function show($id)
    {
        $license = License::with(['config', 'user'])->find($id);

        if (!$license) {
            return response()->json(['error' => 'License not found'], 404);
        }
        
        return new LicenceResource($license);
    }


    public function showByKey($activationKey)
    {
        $license = License::with(['config', 'user'])->where('activation_key', $activationKey)->first();

        if (!$license) {
            return response()->json(['error' => 'License not found'], 404);
        }

        return new LicenceResource($license);
    }


    public function update(Request $request, $id)
    {
        try {
            $license = License::findOrFail($id);

            $request->validate([
                'user_id' => 'nullable|exists:users,id',
                'config_id' => 'nullable|exists:configs,id',
                'duration_days' => 'nullable|integer|min:1',
                'amount' => 'nullable|numeric|min:0',
                'payment_method' => 'nullable|string|max:255',
                'phone_number' => 'nullable|string|max:30',
                'is_active' => 'nullable|boolean',
                'notes' => 'nullable|string',
            ]);

            $updateData = $request->only([
                'user_id',
                'config_id',
                'duration_days',
                'amount',
                'payment_method',
                'phone_number',
                'is_active',
                'notes'
            ]);
            $license->update(array_filter($updateData, fn($value) => $value !== null));

            $license->load(['config', 'user']);

            return response()->json([
                'message' => 'License updated successfully',
                'license' => $license
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the license'], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $license = License::findOrFail($id);
            $license->delete();

            return response()->json(['message' => 'License deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the license'], 500);
        }
    }


    public function index()
    {
        $licenses = License::with(['config', 'user'])->latest()->get();

        return LicenceResource::collection($licenses);
    }
}
