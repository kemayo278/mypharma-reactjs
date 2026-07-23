<?php

namespace App\Models;

use App\Models\Entry;
use App\Models\Order;
use App\Models\Role;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    //use HasApiTokens, HasFactory, Notifiable;
    use HasApiTokens, HasFactory, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        'first_name', 'second_name','phone','email', 'pseudo',
        'password','state','img','cni_number','role_id','degree'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function entry()
    {
       return $this->belongsTo(Entry::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}
