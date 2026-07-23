<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'picture' => 'required|file',
                'type' => 'required',
            ]);

            if (!$request->hasFile('picture')) {
                return response()->json(['error' => 'File is required'],422);
            }

            $file = $request->file('picture');

            $type = trim($request->get('type'));

            $currentDateTime = now()->format('Y-m-d_H-i-s');
            $milliseconds = round(microtime(true) * 1000);
            $strType = strtoupper($type);
            $filename = "{$strType}-{$currentDateTime}-{$milliseconds}." . $file->getClientOriginalExtension();

            $file->storeAs('avatars', $filename, 'public');

            $fileModel = File::create([
                'id' => Str::uuid()->toString(),
                'name' => $filename,
                'path' => $filename,
                'type' => $type,
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension(),
                'description' => $request->get('description')
            ]);

            return response()->json(['message' => 'File created successfully', 'file' => $fileModel]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return $e;
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
