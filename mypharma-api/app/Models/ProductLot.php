<?php

namespace App\Models;

use App\Models\SaleLotAllocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductLot extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_number',
        'expiry_date',
        'manufacture_date',
        'available_quantity',
        'received_quantity',
        'last_purchase_price',
        'last_entry_id',
        'last_entry_product_id',
        'last_received_at',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'manufacture_date' => 'date',
        'last_received_at' => 'datetime',
        'available_quantity' => 'integer',
        'received_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function entry()
    {
        return $this->belongsTo(Entry::class, 'last_entry_id');
    }

    public function entryProduct()
    {
        return $this->belongsTo(EntryProduct::class, 'last_entry_product_id');
    }

    public function saleLotAllocations()
    {
        return $this->hasMany(SaleLotAllocation::class, 'product_lot_id');
    }
}
