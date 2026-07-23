<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = ['name','email','phone','location'];
    
    public function entries(){
        return $this->hasMany(Entry::class);
    }
}
