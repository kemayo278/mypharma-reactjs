<?php

namespace App\Http\Resources;

use App\Models\Entry;
use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;

class EntryProductResource extends JsonResource
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
        'entry_product_id' => $this->id,
        'product_id' => $this->product_id,
        'product' => new ProductResource($this->whenLoaded('product')),
        'entry_id' => $this->entry_id,
        'entry' => new EntryResource($this->whenLoaded('entry')),
        'entry_product_quantity' => $this->quantity,
        'entry_purchase_price' => $this->entry_purchase_price,
        'batch_number' => $this->batch_number,
        'expiry_date' => $this->expiry_date ? $this->expiry_date->format('Y-m-d') : null,
        'manufacture_date' => $this->manufacture_date ? $this->manufacture_date->format('Y-m-d') : null,
        'entry_product_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
        'entry_product_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
    ];

    }
}
