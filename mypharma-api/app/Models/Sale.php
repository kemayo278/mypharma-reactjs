<?php

namespace App\Models;

use App\Models\Order;
use App\Models\Product;
use App\Models\SaleLotAllocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['id','order_id', 'product_id', 'quantity','sell_price'];

    protected $table = 'sales';

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function lotAllocations()
    {
        return $this->hasMany(SaleLotAllocation::class, 'sale_id');
    }
}
