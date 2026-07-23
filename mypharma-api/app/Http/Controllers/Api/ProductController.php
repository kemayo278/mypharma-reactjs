<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductLot;
use Illuminate\Http\Request;


class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'sales', 'productLots'])->get();

        $sortedProducts = $products->sortByDesc(function ($product) {
            return $product->sales->count();
        });

        return ProductResource::collection($sortedProducts);
    }

    public function mostSoldProductsBetweenDates(Request $request)
    {
        try
        {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $startDate = (new \DateTime(trim($request['start_date'])))->setTime(0, 0, 0);
            $endDate = (new \DateTime(trim($request['end_date'])))->setTime(23, 59, 59);

            $products = Product::with(['category'])
                ->withCount(['orders' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                }])
                ->withSum(['orders as total_quantity' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                }], 'sales.quantity')
                ->orderBy('total_quantity', 'desc')
                ->get();

            return ProductResource::collection($products);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function mostSoldProducts()
    {
        try {
            $products = Product::with(['category'])
                ->withCount('orders')
                ->withSum('orders as total_quantity', 'sales.quantity')
                ->orderBy('total_quantity', 'desc')
                ->get();

            return ProductResource::collection($products);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching most sold products'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:products,name',
                'reference' => 'sometimes|nullable|string|max:120|unique:products,reference',
                'category_id' => 'required|exists:categories,id',
                'quantity' => 'sometimes|integer|min:0',
                'quantity_alert' => 'required|integer|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'sale_price' => 'required|numeric|min:0',
                'batch_number' => 'required|string|max:120',
                'expiry_date' => 'required|date',
                'manufacture_date' => 'sometimes|nullable|date',
                'active_ingredient' => 'required|string|max:255',
                'dosage' => 'required|string|max:120',
                'form' => 'required|string|max:120',
                'laboratory' => 'sometimes|nullable|string|max:255',
                'barcode' => 'sometimes|nullable|string|max:120|unique:products,barcode',
                'therapeutic_class' => 'sometimes|nullable|string|max:255',
                'storage_condition' => 'sometimes|nullable|string|max:255',
                'picture' => 'sometimes|nullable|string|max:255',
                'source' => 'sometimes|nullable|string|max:120',
            ]);

            $category = Category::find(trim($request['category_id']));

            if (!$category) {
                return response(['error' => 'category not found'],404);
            }

            if ($request->filled('reference')) {
                $reference = trim($request['reference']);
            }else{
                $productCount = Product::count();
                if($productCount < 10){
                    $productCount = $productCount + 1;
                    $reference = strtoupper("P000".$productCount);
                }
                elseif($productCount>= 10 AND $productCount< 100){
                    $productCount = $productCount + 1;
                    $reference = strtoupper("P00".$productCount);
                }
                elseif($productCount>= 100 AND $productCount< 1000){
                    $productCount = $productCount + 1;
                    $reference = strtoupper("P0".$productCount);
                }
                else{
                    $productCount = $productCount + 1;
                    $reference = strtoupper("P".$productCount);
                }
            }

            $product = Product::create([
                'name' => trim($request['name']),
                'reference' => $reference,
                'category_id' => trim($category->id),
                'quantity' => $request->filled('quantity') ? intval(trim($request['quantity'])) : 0,
                'quantity_alert' => intval(trim($request['quantity_alert'])),
                'purchase_price' => trim($request['purchase_price']),
                'sale_price' => trim($request['sale_price']),
                'batch_number' => trim($request['batch_number']),
                'expiry_date' => trim($request['expiry_date']),
                'manufacture_date' => $request->filled('manufacture_date') ? trim($request['manufacture_date']) : null,
                'active_ingredient' => trim($request['active_ingredient']),
                'dosage' => trim($request['dosage']),
                'form' => trim($request['form']),
                'laboratory' => $request->filled('laboratory') ? trim($request['laboratory']) : null,
                'barcode' => $request->filled('barcode') ? trim($request['barcode']) : null,
                'therapeutic_class' => $request->filled('therapeutic_class') ? trim($request['therapeutic_class']) : null,
                'storage_condition' => $request->filled('storage_condition') ? trim($request['storage_condition']) : null,
                'picture' => $request->filled('picture') ? trim($request['picture']) : null,
                'source' => $request->filled('source') ? trim($request['source']) : null,
            ]);

            $this->syncPrimaryLotFromProduct($product);

            return response()->json(['message' => 'Product created successfully', 'product' => $product]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response(['error' => 'product not found'],404);
        }

        $product->load(['category', 'productLots']);

        return new ProductResource($product);
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            $request->validate([
                'name' => 'required|string|max:255|unique:products,name,' . $product->id,
                'reference' => 'sometimes|nullable|string|max:120|unique:products,reference,' . $product->id,
                'category_id' => 'required|exists:categories,id',
                'quantity' => 'sometimes|integer|min:0',
                'quantity_alert' => 'required|integer|min:0',
                'purchase_price' => 'required|numeric|min:0',
                'sale_price' => 'required|numeric|min:0',
                'batch_number' => 'required|string|max:120',
                'expiry_date' => 'required|date',
                'manufacture_date' => 'sometimes|nullable|date',
                'active_ingredient' => 'required|string|max:255',
                'dosage' => 'required|string|max:120',
                'form' => 'required|string|max:120',
                'laboratory' => 'sometimes|nullable|string|max:255',
                'barcode' => 'sometimes|nullable|string|max:120|unique:products,barcode,' . $product->id,
                'therapeutic_class' => 'sometimes|nullable|string|max:255',
                'storage_condition' => 'sometimes|nullable|string|max:255',
                'picture' => 'sometimes|nullable|string|max:255',
                'source' => 'sometimes|nullable|string|max:120',
            ]);

            $category = Category::find(trim($request['category_id']));

            if (!$category) {
                return response(['error' => 'category not found'],404);
            }

            $product->update([
                'name' => trim($request['name']),
                'reference' => $request->filled('reference') ? trim($request['reference']) : $product->reference,
                'quantity' => $request->filled('quantity') ? trim($request['quantity']) : $product->quantity,
                'quantity_alert' => trim($request['quantity_alert']),
                'purchase_price' => trim($request['purchase_price']),
                'sale_price' => trim($request['sale_price']),
                'batch_number' => trim($request['batch_number']),
                'expiry_date' => trim($request['expiry_date']),
                'manufacture_date' => $request->filled('manufacture_date') ? trim($request['manufacture_date']) : null,
                'active_ingredient' => trim($request['active_ingredient']),
                'dosage' => trim($request['dosage']),
                'form' => trim($request['form']),
                'laboratory' => $request->filled('laboratory') ? trim($request['laboratory']) : null,
                'barcode' => $request->filled('barcode') ? trim($request['barcode']) : null,
                'therapeutic_class' => $request->filled('therapeutic_class') ? trim($request['therapeutic_class']) : null,
                'storage_condition' => $request->filled('storage_condition') ? trim($request['storage_condition']) : null,
                'picture' => $request->filled('picture') ? trim($request['picture']) : $product->picture,
                'category_id' => trim($category->id),
                'source' => $request->filled('source') ? trim($request['source']) : $product->source,
            ]);

            $this->syncPrimaryLotFromProduct($product);

            return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }

    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            if ($product->sales()->exists()) {
                return response()->json(['message' => 'Impossible de supprimer ce produit.'], 500);
            }

            $product->delete();

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getProductByCategory()
    {
        $categories = Category::with('products.sales', 'products.productLots')->get();

        // Parcourir les catégories pour calculer le nombre de ventes de chaque produit
        $categories->each(function ($category) {
            $category->products = $category->products->map(function ($product) {
                $product->sales_count = $product->sales->count();
                return $product;
            })->sortByDesc('sales_count')->values(); // Trier par ventes et réindexer
        });

        // Trier les catégories par la popularité de leurs produits (par le produit le plus vendu dans chaque catégorie)
        $sortedCategories = $categories->sortByDesc(function ($category) {
            return $category->products->max('sales_count');
        })->values();

        return CategoryResource::collection($sortedCategories);
    }

    private function syncPrimaryLotFromProduct(Product $product): void
    {
        if (empty($product->batch_number) || empty($product->expiry_date)) {
            return;
        }

        $lot = ProductLot::firstOrNew([
            'product_id' => $product->id,
            'batch_number' => $product->batch_number,
            'expiry_date' => $product->expiry_date,
        ]);

        if (!$lot->exists) {
            $lot->available_quantity = intval($product->quantity);
            $lot->received_quantity = intval($product->quantity);
        }

        $lot->manufacture_date = $product->manufacture_date;
        $lot->last_purchase_price = $product->purchase_price;
        $lot->save();
    }
}
