<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReturnSaleResource extends JsonResource
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
            'id'         => $this->id,
            'user'       => new UserResource($this->whenLoaded('user')),
            'order'      => new OrderResource($this->whenLoaded('order')),
            'product'    => new ProductResource($this->whenLoaded('product')),
            'quantity'   => $this->quantity,
            'reason'     => $this->reason,
            'sale_id'    => $this->sale_id,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
