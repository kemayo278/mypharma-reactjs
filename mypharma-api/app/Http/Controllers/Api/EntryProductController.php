<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EntryProductResource;
use App\Models\EntryProduct;
use App\Models\Product;
use App\Models\ProductLot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EntryProductController extends Controller
{
    public function index()
    {
        return EntryProductResource::collection(EntryProduct::with('product.category','entry.provider','entry.user')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required',
                'entry_id' => 'required|integer',
                'quantity' => 'required|integer',
                'entry_purchase_price' => 'required|numeric|min:0',
                'batch_number' => 'required|string|max:120',
                'expiry_date' => 'required|date',
                'manufacture_date' => 'sometimes|nullable|date',
            ]);

            $product = $this->resolveProduct(trim((string) $request['product_id']));

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            $entryProduct = DB::transaction(function () use ($request, $product) {
                $quantity = intval($request['quantity']);

                $entryProduct = EntryProduct::create([
                    'product_id' => intval($product->id),
                    'entry_id' => intval($request['entry_id']),
                    'quantity' => $quantity,
                    'entry_purchase_price' => trim((string) $request['entry_purchase_price']),
                    'batch_number' => trim((string) $request['batch_number']),
                    'expiry_date' => trim((string) $request['expiry_date']),
                    'manufacture_date' => $request->filled('manufacture_date') ? trim((string) $request['manufacture_date']) : null,
                ]);

                $newQuantity = intval($product->quantity) + $quantity;
                $product->update([
                    'quantity' => $newQuantity,
                    'batch_number' => trim((string) $request['batch_number']),
                    'expiry_date' => trim((string) $request['expiry_date']),
                    'manufacture_date' => $request->filled('manufacture_date') ? trim((string) $request['manufacture_date']) : null,
                    'purchase_price' => trim((string) $request['entry_purchase_price']),
                ]);

                $this->incrementProductLot(
                    $product,
                    trim((string) $request['batch_number']),
                    trim((string) $request['expiry_date']),
                    $request->filled('manufacture_date') ? trim((string) $request['manufacture_date']) : null,
                    $quantity,
                    trim((string) $request['entry_purchase_price']),
                    intval($request['entry_id']),
                    intval($entryProduct->id)
                );

                return $entryProduct;
            });

            return response()->json(['message' => 'EntryProduct created successfully', 'EntryProduct' => $entryProduct]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $entryProduct = EntryProduct::find($id);

        if (!$entryProduct) {
            return response(['error' => 'entryProduct not found'],404);
        }

        $entryProduct->load('product.category','entry.provider','entry.user');

        return new EntryProductResource($entryProduct);
    }

    public function update(Request $request, $id)
    {
        try {

            $entryProduct = EntryProduct::find($id);

            if (!$entryProduct) {
                return response(['error' => 'entryProduct not found'],404);
            }

            $request->validate([
                // 'product_id' => 'required|integer|unique:products,id',
                // 'entry_id' => 'required|integer|unique:entries,id',
                'quantity' => 'required|integer',
                'entry_purchase_price' => 'required|numeric|min:0',
                'batch_number' => 'sometimes|nullable|string|max:120',
                'expiry_date' => 'sometimes|nullable|date',
                'manufacture_date' => 'sometimes|nullable|date',
            ]);

            $entryProduct->update([
                'product_id' => $request->filled('product_id') ? trim($request['product_id']) : $entryProduct->product_id,
                'entry_id' => $request->filled('entry_id') ? trim($request['entry_id']) : $entryProduct->entry_id,
                'quantity' => trim($request['quantity']),
                'entry_purchase_price' => trim($request['entry_purchase_price']),
                'batch_number' => $request->filled('batch_number') ? trim($request['batch_number']) : $entryProduct->batch_number,
                'expiry_date' => $request->filled('expiry_date') ? trim($request['expiry_date']) : $entryProduct->expiry_date,
                'manufacture_date' => $request->filled('manufacture_date') ? trim($request['manufacture_date']) : $entryProduct->manufacture_date,
            ]);

            return response()->json(['message' => 'entryProduct updated successfully', 'entryProduct' => $entryProduct]);

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
            $entryproduct = EntryProduct::find($id);

            if (!$entryproduct) {
                return response(['error' => 'entryProduct not found'],404);
            }

            $product = Product::find($entryproduct->product_id);

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            DB::transaction(function () use ($entryproduct, $product) {
                $newQuantity = intval($product->quantity) - intval($entryproduct->quantity);

                $product->update([
                    'quantity' => max(0, $newQuantity),
                ]);

                if (!empty($entryproduct->batch_number) && !empty($entryproduct->expiry_date)) {
                    $lot = ProductLot::where('product_id', $product->id)
                        ->where('batch_number', $entryproduct->batch_number)
                        ->whereDate('expiry_date', $entryproduct->expiry_date)
                        ->first();

                    if ($lot) {
                        $lot->available_quantity = max(0, intval($lot->available_quantity) - intval($entryproduct->quantity));
                        $lot->save();
                    }
                }

                $entryproduct->delete();
            });

            return response()->json(['message' => 'EntryProduct deleted success']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    private function resolveProduct(string $productIdOrName): ?Product
    {
        if (is_numeric($productIdOrName)) {
            return Product::find(intval($productIdOrName));
        }

        return Product::where('name', $productIdOrName)->first();
    }

    private function incrementProductLot(
        Product $product,
        string $batchNumber,
        string $expiryDate,
        ?string $manufactureDate,
        int $quantity,
        string $purchasePrice,
        int $entryId,
        int $entryProductId
    ): void {
        $lot = ProductLot::firstOrNew([
            'product_id' => $product->id,
            'batch_number' => $batchNumber,
            'expiry_date' => $expiryDate,
        ]);

        if (!$lot->exists) {
            $lot->available_quantity = 0;
            $lot->received_quantity = 0;
        }

        $lot->manufacture_date = $manufactureDate;
        $lot->available_quantity = intval($lot->available_quantity) + $quantity;
        $lot->received_quantity = intval($lot->received_quantity) + $quantity;
        $lot->last_purchase_price = $purchasePrice;
        $lot->last_entry_id = $entryId;
        $lot->last_entry_product_id = $entryProductId;
        $lot->last_received_at = now();
        $lot->save();
    }
}
