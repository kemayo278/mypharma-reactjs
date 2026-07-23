<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReturnSaleResource;
use App\Models\FalseSale;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductLot;
use App\Models\ReturnSale;
use App\Models\Sale;
use App\Models\SaleLotAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnSaleController extends Controller
{
    public function index()
    {
        $returnSales = ReturnSale::with(['user', 'order', 'product'])->get();
        return ReturnSaleResource::collection($returnSales);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'order_id' => 'nullable|exists:orders,id',
                'sale_id' => 'nullable|exists:sales,id',
                'reason' => 'nullable|string|max:255',
                'quantity' => 'required|integer|min:1',
                'product_id' => 'required|exists:products,id',
            ]);

            $order = $validated['order_id'] ? Order::find($validated['order_id']) : null;

            if($order->state != 'unpaid and destocked'){
                return response()->json(['error' => 'Impossible'], 400);
            }

            $returnSale = DB::transaction(function () use ($validated) {
                $returnSale = ReturnSale::create(array_filter($validated, fn ($value) => !is_null($value) && $value !== ''));

                $product = Product::find($returnSale->product_id);
                if (!$product) {
                    throw new \RuntimeException('product not found');
                }

                $order = $returnSale->order_id ? Order::find($returnSale->order_id) : null;
                if ($order) {
                    $order->update([
                        'price' => intval($order->price) - (intval($returnSale->quantity) * intval($product->sale_price)),
                    ]);
                }

                $sale = $returnSale->sale_id ? Sale::find($returnSale->sale_id) : null;
                $falseSale = $returnSale->sale_id ? FalseSale::find($returnSale->sale_id) : null;

                if ($falseSale) {
                    $falseSale->update([
                        'quantity' => intval($falseSale->quantity) - intval($returnSale->quantity)
                    ]);
                }

                if ($sale) {
                    $sale->update(['quantity' => intval($sale->quantity) - intval($returnSale->quantity)]);
                    $this->restoreReturnedQuantityToLots($sale, intval($returnSale->quantity));
                } else {
                    $this->restoreQuantityToFallbackLot($product, intval($returnSale->quantity));
                }

                $product->update([
                    'quantity' => intval($product->quantity) + intval($returnSale->quantity)
                ]);

                return ReturnSale::with(['user', 'order', 'product'])->find($returnSale->id);
            });

            $auditLogController = new AuditLogController();
            $auditLogController->store(new Request([
                'user_id' => $returnSale->user_id,
                'action' => 'created',
                'previous_state' => null,
                'new_state' => $returnSale->toArray(),
                'metadata' => ['return_sale_id' => $returnSale->id],
            ]));

            return response()->json(['message' => 'Return Sale created successfully', 'id' => $returnSale->id]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    private function restoreReturnedQuantityToLots(Sale $sale, int $quantity): void
    {
        $remaining = $quantity;

        $allocations = SaleLotAllocation::where('sale_id', $sale->id)
            ->where('quantity', '>', 0)
            ->orderBy('id', 'desc')
            ->lockForUpdate()
            ->get();

        foreach ($allocations as $allocation) {
            if ($remaining <= 0) {
                break;
            }

            $restoreQty = min($remaining, intval($allocation->quantity));
            if ($restoreQty <= 0) {
                continue;
            }

            $lot = ProductLot::find($allocation->product_lot_id);
            if ($lot) {
                $lot->available_quantity = intval($lot->available_quantity) + $restoreQty;
                $lot->save();
            }

            $allocation->quantity = intval($allocation->quantity) - $restoreQty;
            if (intval($allocation->quantity) <= 0) {
                $allocation->delete();
            } else {
                $allocation->save();
            }

            $remaining -= $restoreQty;
        }

        if ($remaining > 0) {
            $this->restoreQuantityToFallbackLot($sale->product, $remaining);
        }
    }

    private function restoreQuantityToFallbackLot(Product $product, int $quantity): void
    {
        $fallbackLot = ProductLot::where('product_id', $product->id)
            ->orderBy('expiry_date', 'asc')
            ->orderBy('id', 'asc')
            ->lockForUpdate()
            ->first();

        if (!$fallbackLot) {
            return;
        }

        $fallbackLot->available_quantity = intval($fallbackLot->available_quantity) + $quantity;
        $fallbackLot->save();
    }
}
