<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FalseSale;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;

class FalsesaleController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required',
                'product_id' => 'required',
                'quantity' => 'required',
                'sell_price' => 'required'
            ]);

            $product = Product::where('name',(trim($request['product_id'])))->first();

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            $falsesale = FalseSale::create([
                'order_id' =>trim($request['order_id']),
                'product_id' =>trim($product->id),
                'quantity' => intval(trim($request['quantity'])),
                'sell_price' => intval(trim($request['sell_price'])),
            ]);

            return response()->json(['message' => 'Sale created successfully', 'id' => $falsesale->id]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function destroy($id)
    {
        try
        {
            $falsesale = FalseSale::find($id);

            if (!$falsesale) {
                return response()->json(['error' => 'falsesale not found'], 404);
            }

            $falsesale->delete();

            return response()->json(['message' => 'sale deleted successfully'], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
