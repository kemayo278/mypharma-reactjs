<?php

namespace App\Http\Resources;

use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
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
            'sale_id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'product'=> new ProductResource($this->whenLoaded('product')),
            // 'order'=> new OrderResource($this->whenLoaded('order')),
            'sale_quantity' => $this->quantity,
            'sell_price' => $this->sell_price,
            'sale_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'sale_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }

}
