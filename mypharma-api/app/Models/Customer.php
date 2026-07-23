<?php

namespace App\Models;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'is_prospect',
        'email',
        'phone',
        'date_of_birth',
        'nationality',
        'country_of_origin',
        'profession',
        'employer',
        'monthly_income',
        'emergency_contact',
        'emergency_phone',
        'notes',
        'documents',
        'matricule',
        'status',
        'contract_start',
        'contract_end',
        'payment_expiry',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'monthly_income' => 'decimal:2',
        'documents' => 'array',
        'contract_start' => 'date',
        'contract_end' => 'date',
        'payment_expiry' => 'date',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    protected static function booted()
    {
        static::saving(function ($customer){
            if (!empty($customer->first_name)) {
                $customer->first_name = ucwords(strtolower($customer->first_name));
            }
            if (!empty($customer->last_name)) {
                $customer->last_name = ucwords(strtolower($customer->last_name));
            }

            if (empty($customer->matricule)) {
                $customer->matricule = 'CUST-' . strtoupper(uniqid());
            }
        });
    }
}
