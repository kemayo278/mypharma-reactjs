<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use App\Models\FalseSale;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductLot;
use App\Models\Sale;
use App\Models\SaleLotAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        return SaleResource::collection(Sale::with('order','product.category')->orderBy('id','desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required',
                'product_id' => 'required',
                'quantity' => 'required|integer|min:1',
                'sell_price' => 'required|numeric|min:0'
            ]);

            $product = $this->resolveProduct((string) $request['product_id']);

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            $sale = DB::transaction(function () use ($request, $product) {
                $requiredQuantity = intval(trim((string) $request['quantity']));
                $allocations = $this->allocateFifoLots($product, $requiredQuantity);

                $sale = Sale::create([
                    'order_id' => trim((string) $request['order_id']),
                    'product_id' => intval($product->id),
                    'quantity' => $requiredQuantity,
                    'sell_price' => intval(trim((string) $request['sell_price'])),
                ]);

                foreach ($allocations as $allocation) {
                    SaleLotAllocation::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_lot_id' => $allocation['lot']->id,
                        'quantity' => $allocation['quantity'],
                    ]);
                }

                $product->update([
                    'quantity' => intval($product->quantity) - $requiredQuantity,
                ]);

                return $sale;
            });

            return response()->json(['message' => 'Sale created successfully', 'id' => $sale->id], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $sale = Sale::find($id);

            if (!$sale) {
                return response()->json(['error' => 'Sale not found'], 404);
            }

            $product = Product::find($sale->product_id);

            if (!$product) {
                return response(['error' => 'product not found'],404);
            }

            $order = Order::find($sale->order_id);

            if (!$order) {
                return response(['error' => 'order not found'],404);
            }

            // $newqte = intval($product->quantity) + intval($sale->quantity);

            // $product->update([
            //     'quantity' => $newqte
            // ]);

            $returnSaleController = new ReturnSaleController();

            $returnSaleController->store(new Request([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'sale_id' => $sale->id,
                'product_id' => $product->id,
                'reason' => 'Sale deleted',
                'quantity' => $sale->quantity,
            ]));

            $falseSale = FalseSale::find($sale->id);

            $falseSale->delete();

            $sale->delete();

            if ($order->sales->count() <= 0) {
                // Call store as an instance method, not statically
                $auditLogController = new AuditLogController();
                $auditLogController->store(new Request([
                    'user_id' => $order->user_id,
                    'action' => 'Delete Order',
                    'previous_state' => $order->toArray(),
                    'new_state' => null,
                    'metadata' => ['order_id' => $order->id],
                    'ip_address' => request()->ip(),
                    'status' => 'success',
                    'message' => 'Order deleted as it had no more sales after sale deletion.'
                ]));

                $order->delete();
            }else{
                $auditLogController = new AuditLogController();
                $auditLogController->store(new Request([
                    'user_id' => $order->user_id,
                    'action' => 'Update Order',
                    'previous_state' => $order->toArray(),
                    'new_state' => null,
                    'metadata' => ['order_id' => $order->id],
                    'ip_address' => request()->ip(),
                    'status' => 'success',
                    'message' => 'Order not deleted as it has other sales.'
                ]));
            }

            return response()->json(['message' => 'sale deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    private function resolveProduct(string $productIdOrName): ?Product
    {
        if (is_numeric($productIdOrName)) {
            return Product::find(intval($productIdOrName));
        }

        return Product::where('name', trim($productIdOrName))->first();
    }

    private function allocateFifoLots(Product $product, int $requiredQuantity): array
    {
        $this->bootstrapFallbackLotIfNeeded($product);

        $lots = ProductLot::where('product_id', $product->id)
            ->where('available_quantity', '>', 0)
            ->orderBy('expiry_date', 'asc')
            ->orderBy('id', 'asc')
            ->lockForUpdate()
            ->get();

        $remaining = $requiredQuantity;
        $allocations = [];

        foreach ($lots as $lot) {
            if ($remaining <= 0) {
                break;
            }

            $take = min($remaining, intval($lot->available_quantity));
            if ($take <= 0) {
                continue;
            }

            $lot->available_quantity = intval($lot->available_quantity) - $take;
            $lot->save();

            $allocations[] = [
                'lot' => $lot,
                'quantity' => $take,
            ];

            $remaining -= $take;
        }

        if ($remaining > 0) {
            throw new \RuntimeException('Stock insuffisant dans les lots pour appliquer FIFO.');
        }

        return $allocations;
    }

    private function bootstrapFallbackLotIfNeeded(Product $product): void
    {
        $hasLots = ProductLot::where('product_id', $product->id)->exists();

        if ($hasLots || intval($product->quantity) <= 0) {
            return;
        }

        if (empty($product->batch_number) || empty($product->expiry_date)) {
            return;
        }

        ProductLot::create([
            'product_id' => $product->id,
            'batch_number' => $product->batch_number,
            'expiry_date' => $product->expiry_date,
            'manufacture_date' => $product->manufacture_date,
            'available_quantity' => intval($product->quantity),
            'received_quantity' => intval($product->quantity),
            'last_purchase_price' => $product->purchase_price,
        ]);
    }
}
