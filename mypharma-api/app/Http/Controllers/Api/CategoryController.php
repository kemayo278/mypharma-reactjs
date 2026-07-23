<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(Category::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:categories,name',
                'description' => 'required',
            ]);

            $category = Category::create([
                'name' => trim($request['name']),
                'description' => trim($request['description']),
            ]);

            return response()->json(['message' => 'Category created successfully', 'category' => $category]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response(['error' => 'category not found'],404);
        }

        return new CategoryResource($category);
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required',
            ]);

            $category = Category::find($id);

            if (!$category) {
                return response(['error' => 'category not found'],404);
            }

            $category->update([
                'name' => trim($request['name']),
                'description' => trim($request['description']),
            ]);

            return response()->json(['message' => 'Category updated successfully', 'category' => $category]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response(['error' => 'category not found'],404);
            }

            if ($category->products()->exists()) {
                return response()->json(['message' => 'Impossible de supprimer cette categorie.'], 500);
            }

            $category->delete();

            return response()->json(['message' => 'category delete successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
