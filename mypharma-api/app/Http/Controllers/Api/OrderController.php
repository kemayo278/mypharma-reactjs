<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Models\Customer;
use App\Models\FalseSale;
use App\Models\Institution;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductLot;
use App\Models\Provider;
use App\Models\Sale;
use App\Models\SaleLotAllocation;
use App\Models\User;
use Facade\FlareClient\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index()
    {
        return OrderResource::collection(Order::with('user','customer')->orderBy('id', 'desc')->get());
    }

    public function allOrders()
    {
        return OrderResource::collection( Order::with('user.role','customer','sales.product.category')->orderBy('id','desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'customer_id' => 'nullable|exists:customers,id',
                'price' => 'required',
                'titled' => 'required',
                'state' => 'required|string',
                'amount_mix' => 'nullable|array',
                'customer_name' => 'nullable|string',
            ]);

            // $customer = Customer::where('name',(trim($request['customer_id'])))->first();

            // if (!$customer) {
            //     return response(['error' => 'customer not found'],404);
            // }

            $countOrders = Order::orderBy('id', 'desc')->count();
            $countOrders       = intval($countOrders)+1;
            $reference = "CMD".date('YmdHis').$countOrders;

            // Si customer_id est fourni, récupérer le customer et construire le customer_name
            $customerName = null;
            if ($request->filled('customer_id') && trim($request['customer_id']) !== '') {
                $customer = Customer::find(trim($request['customer_id']));
                if ($customer) {
                    $customerName = trim($customer->first_name . ' ' . $customer->last_name);
                }
            } elseif ($request->has('customer_name')) {
                $customerName = trim($request['customer_name']);
            }

            $order = Order::create([
                'reference' => trim($reference),
                'titled' => trim($request['titled']),
                'user_id' => trim($request['user_id']),
                'customer_id' => $request->filled('customer_id') && trim($request['customer_id']) !== '' ? trim($request['customer_id']) : null,
                'price' => intval(trim($request['price'])),
                'state' => trim($request['state']),
                'amount_mix' => $request->has('amount_mix') ? $request['amount_mix'] : null,
                'customer_name' => $customerName,
                'date_order' => date('Ymd'),
            ]);

            return response()->json(['message' => 'order created successfully', 'id' => $order->id]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    public function storeOrderSale(Request $request)
    {
        try {
            // Validation des données de la commande
            $request->validate([
                'user_id' => 'required',
                'customer_id' => 'nullable|exists:customers,id',
                'customer_name' => 'nullable|string',
                'price' => 'required',
                'titled' => 'required',
                'state' => 'required|string',
                'products' => 'required|array',
                'products.*.product_id' => 'required',
                'products.*.quantity' => 'required',
                'products.*.sell_price' => 'required',
            ]);

            // Générer la référence de la commande
            $countOrders = Order::orderBy('id', 'desc')->count() + 1;
            $reference = "CMD" . date('YmdHis') . $countOrders;

                        $customerName = null;
            if ($request->filled('customer_id') && trim($request['customer_id']) !== '') {
                $customer = Customer::find(trim($request['customer_id']));
                if ($customer) {
                    $customerName = trim($customer->first_name . ' ' . $customer->last_name);
                }
            } elseif ($request->has('customer_name')) {
                $customerName = trim($request['customer_name']);
            }

            // Créer la commande
            $order = Order::create([
                'reference' => trim($reference),
                'titled' => trim($request['titled']),
                'user_id' => trim($request['user_id']),
                'customer_id' => $request->filled('customer_id') && trim($request['customer_id']) !== '' ? trim($request['customer_id']) : null,
                'price' => intval(trim($request['price'])),
                'state' => trim($request['state']),
                'amount_mix' => $request->has('amount_mix') ? $request['amount_mix'] : null,
                'customer_name' => $customerName,
                'date_order' => date('Ymd'),
            ]);


            foreach ($request->products as $saleproduct) {

                $product = Product::where('name',(trim($saleproduct['product_id'])))->first();

                if (!$product) {
                    return response(['error' => 'product not found'],404);
                }

                FalseSale::create([
                    'order_id' => $order->id,
                    'product_id' => trim($product->id),
                    'quantity' => intval(trim($saleproduct['quantity'])),
                    'sell_price' => intval(trim($saleproduct['sell_price'])),
                ]);

            }

            return response()->json(['message' => 'Order created successfully', 'id' => $order->id]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }


    public function indexBetweenDates(Request $request)
    {
        try
        {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $startDate = trim($request['start_date']);

            $endDate = trim($request['end_date']);

            if (strlen($startDate) === 10) {
                $startDate .= ' 00:00:00';
            }

            if (strlen($endDate) === 10) {
                $endDate .= ' 23:59:59';
            }

            $query = Order::with('user', 'customer', 'falsesales.product.category')->whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc');

            if ($request->has('state') && trim($request['state']) !== '') {
                $query->where('state', trim($request['state']));
            }

            if ($request->has('user_id') && trim($request['user_id']) !== '') {
                $query->where('user_id', trim($request['user_id']));
            }

            return OrderResource::collection($query->get());

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response(['error' => 'order not found'],404);
        }

        $order->load('user.role','customer','sales.product.category','falsesales.product.category');

        $institution = Institution::first();

        return response()->json([
            'data' => new OrderResource($order),
            'institution' => new InstitutionResource($institution),
        ]);

        return new OrderResource($order);
    }

    public function destroy($id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response(['error' => 'order not found'],404);
            }

            if ($order->state != "unpaid and not cleared") {
                $falseSales = FalseSale::where('order_id', $order->id)->get();

                foreach ($falseSales as $falseSale) {
                    $product = Product::find($falseSale->product_id);

                    if (!$product) {
                        return response(['error' => 'product not found'],404);
                    }

                    $newqte = intval($product->quantity) + intval(trim($falseSale->quantity));

                    $product->update([
                        'quantity' => $newqte
                    ]);
                }
            }

            if (FalseSale::where('order_id', $order->id)->exists()) {
                FalseSale::where('order_id', $order->id)->delete();
            }

            $order->delete();

            return response()->json(['message' => 'order delete successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }


    public function setStateOrder(Request $request , $id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response(['error' => 'order not found'],404);
            }

            $request->validate([
                'state' => 'required',
                // 'amount_mix' => 'nullable|array',
            ]);

            $order->update([
                'state' => trim($request['state']),
                'amount_mix' => $request->has('amount_mix') ? $request['amount_mix'] : null,
            ]);

            if($request->has('customer_name') and !empty(trim($request['customer_name']))){
                $order->update([
                    'customer_name' => trim($request['customer_name']),
                ]);
            }

            if (trim($request['state']) == 'unpaid and destocked') {
                $falseSales = FalseSale::where('order_id', $id)->get();

                DB::transaction(function () use ($falseSales, $order) {
                    foreach ($falseSales as $falseSale) {
                        $product = Product::find($falseSale->product_id);

                        if (!$product) {
                            throw new \RuntimeException('product not found');
                        }

                        $requiredQuantity = intval(trim((string) $falseSale->quantity));
                        $allocations = $this->allocateFifoLots($product, $requiredQuantity);

                        $sale = Sale::create([
                            'id' => $falseSale->id,
                            'order_id' => $order->id,
                            'product_id' => intval($falseSale->product_id),
                            'quantity' => $requiredQuantity,
                            'sell_price' => intval(trim((string) $falseSale->sell_price)),
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
                    }
                });
            }

            $order->load('user','customer','sales.product','falsesales.product.category');

            return response()->json(['message' => 'order state updated success','order' => new OrderResource($order)]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function setCustomerToOrder(Request $request, $orderId)
    {
        try {

            $request->validate([
                'customer_id' => 'required|exists:customers,id',
            ]);

            $order = Order::find($orderId);

            if (!$order) {
                return response(['error' => 'order not found'],404);
            }

            $customerId = trim($request['customer_id']);

            $customer = Customer::find($customerId);

            if (!$customer) {
                return response(['error' => 'customer not found'],404);
            }

            $order->update([
                'customer_id' => $customer->id,
                'customer_name' => trim($customer->first_name . ' ' . $customer->last_name),
            ]);

            return response()->json(['message' => 'Customer set to order successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response(['error' => 'order not found'],404);
            }

            $customer = Customer::where('name',(trim($request['customer_id'])))->first();

            if (!$customer) {
                return response(['error' => 'customer not found'],404);
            }

            $order->update([
                'user_id' => trim($request['user_id']),
                'customer_id' => trim($customer->id),
                'price' => trim($request['price'])
            ]);

            return response()->json(['message' => 'Order updated successfully']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }



    public function getOrdersByStateUnpaid()
    {
        return OrderResource::collection(Order::with('user', 'customer', 'falsesales.product.category')->where('state', 'LIKE', 'Unpaid%')->orderBy('created_at', 'desc')->get());
    }

    public function getCountOrderStateUnpaidsByUser($userId)
    {
        $user = User::find($userId);

        if(!$user){
            return response()->json(['errornotfound' => 'User not found'], 422);
        }

        $count = Order::with('user', 'customer', 'falsesales.product.category')->where('state', 'LIKE', 'unpaid%')->where('user_id', $userId)->orderBy('created_at', 'desc')->count();

        return response()->json(['count' => $count]);
    }

    public function getOrdersByStatepaid()
    {
        return OrderResource::collection(Order::with('user', 'customer', 'sales.product')->where('state', 'LIKE', 'paid%')->orderBy('created_at', 'desc')->get());
    }

    public function getOrdersByStatepaidBetweenDatesOrToday(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $rawStart = $request['start_date'];
            $rawEnd = $request['end_date'];

            // Détection : contient une heure ?
            $startHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawStart);
            $endHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawEnd);

            $start = Carbon::parse($rawStart);
            $end = Carbon::parse($rawEnd);

            // Appliquer startOfDay / endOfDay uniquement si aucune heure n’est fournie
            if (!$startHasTime) {
                $start = $start->startOfDay();
            }

            if (!$endHasTime) {
                $end = $end->endOfDay();
            }

            // Cas : même jour → inclure la veille
            if (!$startHasTime && !$endHasTime && $start->isSameDay($end)) {
                $start = $start->copy()->subDay()->startOfDay();
            }

            $orders = Order::with([
                    'user',
                    'customer',
                    'sales.product.category',
                    'falsesales.product.category',
                    'returns.product.category'
                ])
                ->where('state', 'LIKE', 'paid%')
                ->whereBetween('created_at', [$start, $end])
                ->orderBy('updated_at', 'desc')
                ->get();

            $institution = Institution::first();

            // 📊 Statistiques
            $totalOrders = $orders->count();
            $currentMonthRevenue = $orders->sum('price'); // suppose que Order a total_amount

            // Comparaison avec le mois précédent
            $previousStart = (clone $start)->subMonth();
            $previousEnd   = (clone $end)->subMonth();

            $previousOrders = Order::where('state', 'LIKE', 'paid%')
                ->whereBetween('updated_at', [$previousStart, $previousEnd])
                ->get();

            $lastMonthRevenue = $previousOrders->sum('price');

            // 📈 Évolution des revenus
            if ($lastMonthRevenue == 0) {
                $revenueChange = $currentMonthRevenue > 0 ? 100 : 0;
            } else {
                $revenueChange = round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2);
            }

            return response()->json([
                'data' => OrderResource::collection($orders),
                'institution' => new InstitutionResource($institution),

                'stats' => [
                    'total_orders'   => $totalOrders,
                    'total_amount'   => $currentMonthRevenue,
                    'revenue_change' => $revenueChange,
                ],
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getOrdersByCustomer($customerId)
    {
        $customer = Customer::find($customerId);

        if(!$customer){
            return response()->json(['errornotfound' => 'Customer not found'], 422);
        }

        return OrderResource::collection(Order::with('user','customer','sales.product','falsesales.product','returns.product')->where('customer_id', $customerId)->orderBy('created_at', 'desc')->get());
    }

    public function getOrdersByStateDebt()
    {
        return OrderResource::collection(Order::with('user', 'customer', 'sales.product')->where('state', 'LIKE', 'debt%')->orderBy('created_at', 'desc')->get());
    }

    public function getOrdersByStateDebtBetweenDatesOrToday(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $rawStart = $request['start_date'];
            $rawEnd = $request['end_date'];

            // Détection : contient une heure ?
            $startHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawStart);
            $endHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawEnd);

            $start = Carbon::parse($rawStart);
            $end = Carbon::parse($rawEnd);

            // Appliquer startOfDay / endOfDay uniquement si aucune heure n’est fournie
            if (!$startHasTime) {
                $start = $start->startOfDay();
            }

            if (!$endHasTime) {
                $end = $end->endOfDay();
            }

            if (!$startHasTime && !$endHasTime && $start->isSameDay($end)) {
                $start = $start->copy()->subDay()->startOfDay();
            }

            $orders = Order::with([
                    'user',
                    'customer',
                    'sales.product',
                    'falsesales.product',
                    'returns.product'
                ])
                ->where('state', 'LIKE', 'debt%')
                ->whereBetween('created_at', [$start, $end])
                ->orderBy('created_at', 'desc')
                ->get();

            $institution = Institution::first();

            return response()->json([
                'data' => OrderResource::collection($orders),
                'institution' => new InstitutionResource($institution),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getOrdersTodayBetweenUser($userId)
    {
        $user = User::find($userId);

        if(!$user){
            return response()->json(['errornotfound' => 'User not found'], 422);
        }

        $rawStart = date('Y-m-d');
        $rawEnd = date('Y-m-d');

        // Détection : contient une heure ?
        $startHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawStart);
        $endHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawEnd);

        $start = Carbon::parse($rawStart);
        $end = Carbon::parse($rawEnd);

        // Appliquer startOfDay / endOfDay uniquement si aucune heure n’est fournie
        if (!$startHasTime) {
            $start = $start->startOfDay();
        }

        if (!$endHasTime) {
            $end = $end->endOfDay();
        }

        // Cas : même jour → inclure la veille
        if ($start->isSameDay($end)) {
            $start = $start->copy()->subDay()->startOfDay();
        }

        return OrderResource::collection(Order::with('user', 'customer', 'falsesales.product.category','returns.product')->where('user_id', $userId)->whereBetween('created_at', [$start, $end])->orderBy('created_at','desc')->get());
    }

    public function getOrdersByUser($userId)
    {
        $user = User::find($userId);

        if(!$user){
            return response()->json(['errornotfound' => 'User not found'], 422);
        }

        return OrderResource::collection(Order::with('user','customer','sales.product','falsesales.product')->where('user_id', $userId)->orderBy('id','desc')->get());
    }

    public function getUsersByRecentOrderUnpaid()
    {
        $users = User::whereHas('orders', function ($query) {
            $query->where('orders.state', 'LIKE BINARY', 'unpaid%');
        })
        ->with(['orders' => function ($query) {
            $query->where('orders.state', 'LIKE BINARY', 'unpaid%')->orderBy('created_at', 'desc');
        }, 'orders.falsesales.product.category'])
        ->get();

        $users = $users->sortByDesc(function ($user) {
            return optional($user->orders->first())->created_at;
        });

        return UserResource::collection($users);
    }

    public function getUsersByRecentOrderUnpaidBetweenDatesOrToday(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $rawStart = $request['start_date'];
            $rawEnd = $request['end_date'];

            // Détection : contient une heure ?
            $startHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawStart);
            $endHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawEnd);

            $start = Carbon::parse($rawStart);
            $end = Carbon::parse($rawEnd);

            // Appliquer startOfDay / endOfDay uniquement si aucune heure n’est fournie
            if (!$startHasTime) {
                $start = $start->startOfDay();
            }

            if (!$endHasTime) {
                $end = $end->endOfDay();
            }

            if (!$startHasTime && !$endHasTime && $start->isSameDay($end)) {
                $start = $start->copy()->subDay()->startOfDay();
            }

            $usersQuery = User::whereHas('orders', function ($query) use ($start, $end) {
                $query->where('state', 'LIKE BINARY', 'unpaid%')
                      ->whereBetween('created_at', [$start, $end])
                      ->orderBy('updated_at', 'desc');
            })
            ->with([
                'orders' => function ($query) use ($start, $end) {
                    $query->where('state', 'LIKE BINARY', 'unpaid%')
                          ->whereBetween('created_at', [$start, $end])
                          ->orderBy('updated_at', 'desc');
                },
                'orders.falsesales.product.category',
                'orders.customer',
                'orders.user'
            ]);

            if ($request->has('user_id') && !empty(trim($request['user_id']))) {
                $usersQuery->where('id', trim($request['user_id']));
            }

            $users = $usersQuery->get()->sortByDesc(function ($user) {
                return optional($user->orders->first())->updated_at;
            });

            $institution = Institution::first();

            return response()->json([
                'data' => UserResource::collection($users),
                'institution' => new InstitutionResource($institution),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function setStateOrdersRecap(Request $request)
    {
        try
        {
            $request->validate([
                'state' => 'required|string|max:255',
            ]);

            $string = trim($request['order_ids']);

            $array = explode('-', $string);

            $array = array_filter($array, function($value) {
                return $value !== '';
            });

            $orderIds = $array;

            foreach($orderIds as $orderId){
                $order = Order::find($orderId);

                if (!$order) {
                    return response(['error' => 'order not found', 'id' => $orderId],404);
                }

                $order->update([
                    'state' => trim($request['state']),
                ]);

            }

            return response()->json(['message' => 'order state updated success']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function getOrderRecap(Request $request)
    {
        try
        {
            $string = trim($request['order_ids']);

            $array = explode('-', $string);

            $array = array_filter($array, function($value) {
                return $value !== '';
            });

            $orderIds = $array;

            $recap = $this->TraitementRecap($orderIds);

            return response()->json($recap);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function TraitementRecap(array $orderIds)
    {
        $orders = Order::with('falsesales.product', 'user')->whereIn('id', $orderIds)->get();

        $productRecap = [];
        $orderReferences = [];
        $totalAmount = 0;
        $userNames = [];
        $orderTitled = [];
        $orderDate = [];

        foreach ($orders as $order) {
            $orderReferences[] = $order->reference;
            $totalAmount += $order->price;

            $userFullName = $order->user->first_name . ' ' . $order->user->second_name;
            if (!in_array($userFullName, $userNames)) {
                $userNames[] = $userFullName;
            }

            if (!in_array($order->titled, $orderTitled)) {
                $orderTitled[] = $order->titled;
            }

            if (!in_array($order->created_at, $orderDate)) {
                $orderDate[] = $order->created_at;
            }

            foreach ($order->falsesales as $sale) {
                $productId = $sale->product->id;
                if (isset($productRecap[$productId])) {
                    $productRecap[$productId]['quantity'] += $sale->quantity;
                } else {
                    $productRecap[$productId] = [
                        'product_details' => new ProductResource($sale->product),
                        'quantity' => $sale->quantity
                    ];
                }
            }
        }

        $orderReferencesString = implode(', ', $orderReferences);
        $userNamesString = implode(', ', $userNames);
        $orderTitledString = implode(', ', $orderTitled);
        $orderDateString = implode(', ', $orderDate);

        $institution = Institution::first();

        return [
            'institution' => new InstitutionResource($institution),
            'product_recap' => array_values($productRecap),
            'total_amount' => $totalAmount,
            'order_references' => $orderReferencesString,
            'user_names' => $userNamesString,
            'order_titled' => $orderTitledString,
            'order_date' => $orderDateString,
        ];
    }

    public function getOrdersUnpaidBetweenDatesOrTodayOrUserId(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $rawStart = $request['start_date'];
            $rawEnd = $request['end_date'];

            // Détection : contient une heure ?
            $startHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawStart);
            $endHasTime = preg_match('/\d{2}:\d{2}(:\d{2})?/', $rawEnd);

            $start = Carbon::parse($rawStart);
            $end = Carbon::parse($rawEnd);

            // Appliquer startOfDay / endOfDay uniquement si aucune heure n’est fournie
            if (!$startHasTime) {
                $start = $start->startOfDay();
            }

            if (!$endHasTime) {
                $end = $end->endOfDay();
            }

            // Cas : même jour → inclure la veille
            if (!$startHasTime && !$endHasTime && $start->isSameDay($end)) {
                $start = $start->copy()->subDay()->startOfDay();
            }

            $query = Order::with([
                    'user',
                    'customer',
                    'falsesales.product.category',
                    'returns.product'
                ])
                ->where('state', 'LIKE BINARY', 'unpaid%')
                ->whereBetween('created_at', [$start, $end])
                ->whereHas('falsesales', function ($query) {
                    $query->whereNotNull('id'); // vérifie que falsesales existe
                })
                ->orderBy('updated_at', 'desc');

            // if ($request->has('user_id') && trim($request['user_id']) !== '') {
            //     $query->where('user_id', trim($request['user_id']));
            // }

            $institution = Institution::first();
            $user = User::find(trim($request['user_id']));

            return response()->json([
                'data' => OrderResource::collection($query->get()),
                'institution' => new InstitutionResource($institution),
                'user' => $user ? new UserResource($user) : null,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    private function allocateFifoLots(Product $product, int $requiredQuantity): array
    {
        if ($requiredQuantity <= 0) {
            return [];
        }

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
