<?php

namespace App\Http\Resources;

use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Models\Product;
use App\Models\Provider;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'entry_id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'user_id' => $this->user_id,
            'user'=> new UserResource($this->whenLoaded('user')),
            'provider_id' => $this->provider_id,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'entryproducts' => EntryProductResource::collection($this->whenLoaded('entryproducts')),
            'date_entry' => $this->date_entry,
            'entry_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'entry_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
