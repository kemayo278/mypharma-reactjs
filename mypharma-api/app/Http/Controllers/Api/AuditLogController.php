<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index()
    {
        return AuditLogResource::collection(AuditLog::with('user')->orderBy('created_at', 'desc')->get());
    }

    public function show($id)
    {
        $auditLog = AuditLog::find($id);

        if (!$auditLog) {
            return response(['error' => 'auditLog not found'],404);
        }

        $auditLog->load('user');

        return new AuditLogResource($auditLog);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'action' => 'required|string|max:255',
                'previous_state' => 'nullable|array',
                'new_state' => 'nullable|array',
                'metadata' => 'nullable|array',
                'changes' => 'nullable|array',
                'ip_address' => 'nullable|string|max:45',
                'status' => 'nullable|string|max:255',
                'message' => 'nullable|string',
            ]);

            $log = AuditLog::create(array_filter($validated, fn ($value) => !is_null($value) && $value !== ''));

            return response()->json(['message' => 'AuditLog added successfully', 'log' => $log]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getAuditLogsByUserId($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response(['error' => 'user not found'],404);
        }

        return AuditLogResource::collection(AuditLog::with('user')->where('user_id', $userId)->orderBy('created_at', 'desc')->get());
    }
}
