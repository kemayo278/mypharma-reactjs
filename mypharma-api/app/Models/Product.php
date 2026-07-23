<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function (Product $product) {
            if (!empty($product->reference)) {
                return;
            }

            do {
                $candidate = 'PH' . date('ymd') . strtoupper(dechex(random_int(0, 65535)));
            } while (self::where('reference', $candidate)->exists());

            $product->reference = $candidate;
        });
    }

    protected $fillable = [
        'reference',
        'name',
        'category_id',
        'quantity',
        'quantity_alert',
        'purchase_price',
        'sale_price',
        'batch_number',
        'expiry_date',
        'manufacture_date',
        'active_ingredient',
        'dosage',
        'form',
        'laboratory',
        'barcode',
        'therapeutic_class',
        'storage_condition',
        'picture',
        'source',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'sales', 'product_id', 'order_id');
    }

    public function entries()
    {
        return $this->belongsToMany(Entry::class);
    }

    public function productLots()
    {
        return $this->hasMany(ProductLot::class)->orderBy('expiry_date');
    }

}
