<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\EntryController;
use App\Http\Controllers\Api\EntryProductController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\LicenseController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProviderController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\FalsesaleController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ReturnSaleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeUnit\FunctionUnit;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function (){
    Route::get('/user', function (Request $request){
        return $request->user();
    });
  //  Route::post('logout',[AuthController::class,'logout']);
});

//Auth
Route::group(['controller'=>AuthController::class],function(){
    Route::post('login', 'login');
    Route::post('signup', 'signup');
    Route::post('logout', 'logout');
    Route::get('forgetpassword/{email}', 'forgetPassword');
    Route::put('changepassword/{id}', 'resetPassword');
    Route::put('/setstate/{id}/{newState}', 'setstate');
});

//User
Route::group(['controller'=>UserController::class], function (){
    Route::get('/user/{id}', 'show');
    Route::get('/users', 'index');
    Route::put('/user/edit/{id}', 'update');
    Route::put('/user/editrole/{id}', 'setrole');
    Route::put('/user/editroledegree/{id}', 'setRoleAndDegree');
    Route::put('/changedegree/{id}', 'changeDegree');
});

//category
Route::group(['controller' => CategoryController::class],function(){
    Route::post('/category', 'store');
    Route::get('/categories', 'index');
    Route::get('/categories/{id}', 'show');
    Route::put('/category/{id}', 'update');
    Route::delete('/category/{id}', 'destroy');
});

//config
Route::group(['controller'=>ConfigController::class],function (){
    Route::put('/config/{id}', 'update');
    Route::get('/config/{id}', 'Show');
});

//customer
Route::group(['controller' => CustomerController::class], function () {
    Route::get('/customers', 'index');
    Route::post('/customers-list/country', 'getCustomersByCountry');
    Route::get('/customers/{id}', 'show');
    Route::post('/customers', 'store');
    Route::put('/customers/{id}', 'update');
    Route::delete('/customers/{id}', 'destroy');
});

//entry
Route::group(['controller'=>EntryController::class], function(){
    Route::post('/entry/add', 'store');
    Route::get('/entries', 'index');
    Route::get('/entry/{id}', 'show');
    Route::get('/entries/dates/between', 'countIndexBetweenDates');
    Route::post('/entries/dates/between', 'indexBetweenDates');
    Route::put('/entry/{id}', 'update');
});

//institution
Route::group(['controller'=>InstitutionController::class],function(){
    Route::post('institution/add',  'store');
    Route::get('/institutions',  'index');
    Route::get('/institution/{id}',  'show');
    Route::put('/institution/{id}', 'update');
});

//order
Route::group(['controller' => OrderController::class],function(){
    Route::post('/order/add',  'store');
    Route::post('/storeOrderSale/add',  'storeOrderSale');
    Route::get('/orders',  'index');
    Route::get('/orders/forall', 'allOrders');
    Route::post('/orders/dates/between',  'indexBetweenDates');
    Route::get('/order/{id}', 'show');
    Route::put('/order/setstate/{id}', 'setStateOrder');
    Route::put('/order/assign-customer/{orderId}', 'setCustomerToOrder');
    Route::put('/order/{id}', 'update');
    Route::delete('/order/{id}', 'destroy');

    //unpaid
    Route::get('/orders-unpaid',  'getOrdersByStateUnpaid');
    Route::get('/orders-unpaid-count/{userId}',  'getCountOrderStateUnpaidsByUser');
    Route::post('/orders-unpaid-dates/between',  'getOrdersUnpaidBetweenDatesOrTodayOrUserId');  // 06-10-2024 // il prend en compte aussi l'id de l'utilisateur au cas ou // pour obtenir les orders du jour il faut juste passer la date du jour uniquement

    //paid
    Route::get('/orders-paid',  'getOrdersByStatepaid');
    Route::post('/orders-paid-between',  'getOrdersByStatepaidBetweenDatesOrToday');

    //debt
    Route::get('/orders-debt',  'getOrdersByStateDebt');
    Route::post('/orders-debt-between',  'getOrdersByStateDebtBetweenDatesOrToday');

    //by user
    Route::get('/orders-user/{userId}', 'getOrdersByUser');
    Route::get('/orders-today/user/{userId}', 'getOrdersTodayBetweenUser');

    // by customer
    Route::get('/orders-customer/{customerId}', 'getOrdersByCustomer');

    //recap
    Route::post('/orders/recap', 'getOrderRecap');
    Route::post('/orders/recap/setstate', 'setStateOrdersRecap');

    //unpaid by user
    Route::get('/list/user/orders/unpaid', 'getUsersByRecentOrderUnpaid');
    Route::post('/list/user/orders-unpaid/between',  'getUsersByRecentOrderUnpaidBetweenDatesOrToday');   // 06-10-2024 // il prend en compte aussi l'id de l'utilisateur au cas ou // pour obtenir les orders du jour il faut juste passer la date du jour uniquement
});

//product
Route::group(['controller'=>ProductController::class],function(){
    Route::post('/product',  'store');
    Route::get('/products', 'index');
    Route::post('/most-sold-products', 'mostSoldProductsBetweenDates');
    Route::get('/mostsoldproducts', 'mostSoldProducts');
    Route::get('/products/{id}', 'show');
    Route::get('/category/products', 'getProductByCategory');
    Route::put('/product/{id}', 'update');
    Route::delete('/product/{product}', 'destroy');
});

//role
Route::group(['controller'=>RoleController::class],function(){
    Route::post('/role', 'store');
    Route::get('/roles',  'index');
    Route::get('/roles/{id}', 'show');
    Route::put('/role/{id}', 'update');
    Route::delete('/role/{id}','destroy');
});

//sale
Route::group(['controller' => SaleController::class], function(){
    Route::get('/sales', 'index');
    Route::post('/sale', 'store');
    Route::delete('/sale/{id}', 'destroy');
    // Route::put('/sale/{id}', 'update');
});

//sale
Route::group(['controller' => FalsesaleController::class], function(){
    Route::post('/falsesale', 'store');
    Route::delete('/falsesale/{id}', 'destroy');
});

//provider
Route::group(['controller'=>ProviderController::class], function(){
    Route::get('/providers', 'index');
    Route::get('/providers/{id}', 'show');
    Route::post('/provider/add', 'store');
    Route::put('/provider/{id}', 'update');
    Route::delete('/provider/{id}', 'destroy');
});

//EntryProduct
Route::group(['controller'=>EntryProductController::class],function(){
    Route::post('/entryproduct/add',  'store');
    Route::get('/entryproducts',  'index');
    Route::get('/entryproduct/{id}', 'show');
    Route::delete('/entryproduct/{id}','destroy');
});

Route::group(['controller' => FileController::class], function () {
    Route::post('files', 'store');
});

Route::group(['prefix' => 'audit-logs', 'controller' => AuditLogController::class], function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::get('/user/{userId}', 'getAuditLogsByUserId');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::group(['controller' => ReturnSaleController::class, 'prefix' => 'return-sales'], function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

//licenses
Route::group(['controller' => LicenseController::class, 'prefix' => 'licenses'], function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::post('/reactivate', 'reactivate');
    Route::get('/key/{activationKey}', 'showByKey');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});
