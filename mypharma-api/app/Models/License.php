<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class License extends Model
{
    use HasFactory;

    protected $fillable = [
        'activation_key',
        'user_id',
        'config_id',
        'duration_days',
        'amount',
        'payment_method',
        'phone_number',
        'begin_date',
        'end_date',
        'is_active',
        'notes' 
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration_days' => 'integer',
        'amount' => 'decimal:2',
    ];

    /**
     * Générer une clé d'activation unique
     * 
     * @return string
     */
    public static function generateActivationKey()
    {
        $key = strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4));
        
        // Vérifier que la clé est unique
        while (self::where('activation_key', $key)->exists()) {
            $key = strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4));
        }
        
        return $key;
    }

    /**
     * Relation avec le modèle Config
     */
    public function config()
    {
        return $this->belongsTo(Config::class);
    }

    /**
     * Relation avec le modèle User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
