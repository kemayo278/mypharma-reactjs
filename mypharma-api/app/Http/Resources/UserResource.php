<?php

namespace App\Http\Resources;

use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
       // return parent::toArray($request);
       return [
        'user_id' => $this->id,
        'user_first_name' => $this->first_name,
        'user_second_name' => $this->second_name,
        'user_date_of_birth' => $this->date_of_birth,
        'user_phone' => $this->phone,
        'user_email' => $this->email,
        'user_state' => $this->state,
        'user_degree' => intval($this->degree),
        'user_img' => $this->img ? asset("storage/avatars/{$this->img}") : null,
        'user_cni_number' => $this->cni_number,
        'user_pseudo' => $this->pseudo,
        'role_id' => $this->role_id,
        'role' =>new RoleResource($this->whenLoaded('role')),
        'user_img_cni_recto' => $this->img_cni_recto,
        'user_img_cni_verso' => $this->img_cni_verso,
        'user_remember_token' => $this->remember_token,
        'orders' => OrderResource::collection($this->whenLoaded('orders')),
        'user_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        'user_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
    ];
    }
}
