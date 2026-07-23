<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    use HasFactory;
    protected $fillable = ['begin', 'end'];

    /**
     * Relation avec les licences
     */
    public function licenses()
    {
        return $this->hasMany(License::class);
    }
}
