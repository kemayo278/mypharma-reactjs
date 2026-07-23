<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'state','matriculation', 'phone', 'pj', 'number_register',
        'pj_register', 'num_declaration', 'img', 'cycle', 'telephone', 'couverture',
    ];
}
