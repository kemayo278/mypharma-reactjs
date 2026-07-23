<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'previous_state',
        'new_state',
        'metadata',
        'changes',
        'ip_address',
        'status',
        'message',
    ];

    protected $casts = [
        'previous_state' => 'array',
        'new_state' => 'array',
        'metadata' => 'array',
        'changes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
