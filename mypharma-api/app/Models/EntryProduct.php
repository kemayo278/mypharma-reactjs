<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntryProduct extends Model
{
    use HasFactory;
    protected $fillable = ['entry_id', 'product_id','quantity','entry_purchase_price', 'batch_number', 'expiry_date', 'manufacture_date'];

    protected $casts = [
        'expiry_date' => 'date',
        'manufacture_date' => 'date',
    ];

   // protected $table = 'EntryProducts';

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    public function entry()
    {
        return $this->belongsTo(Entry::class);
    }
}
