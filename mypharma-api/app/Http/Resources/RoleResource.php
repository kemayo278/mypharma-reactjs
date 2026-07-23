<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        //return parent::toArray($request);

        return [
            'role_id' => $this->id,
            'role_name' => $this->name,
            'role_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'role_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];}
}
