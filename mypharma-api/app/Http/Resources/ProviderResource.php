<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
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
       return[
                'provider_id' => $this->id,
                'provider_name' => $this->name,
                'provider_email' => $this->email,
                'provider_phone' => $this->phone,
                'provider_location' => $this->location,
                'provider_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
                'provider_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            ];
    }
}
