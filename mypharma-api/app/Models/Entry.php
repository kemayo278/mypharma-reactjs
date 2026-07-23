<?php

namespace App\Models;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_number','provider_id', 'user_id','date_entry'];

    // public function product()
    // {
    //     return $this->belongsTo(Product::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function entryproducts()
    {
        return $this->hasMany(EntryProduct::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    // public function products()
    // {
    //     return $this->belongsToMany(Product::class,'entryProducts','entry_id','product_id');
    // }
}
