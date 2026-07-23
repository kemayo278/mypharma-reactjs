<?php

namespace App\Models;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['reference','titled','user_id','customer_id','sale_id','price','state','date_order','amount_mix','customer_name'];

    protected $casts = [
        'amount_mix' => 'array'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class,'sales','order_id','product_id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function falsesales()
    {
        return $this->hasMany(FalseSale::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function returns()
    {
        return $this->hasMany(ReturnSale::class);
    }
}
