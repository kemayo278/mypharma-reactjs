<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FalseSale extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'quantity','sell_price'];

    protected $table = 'false_sales';

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
