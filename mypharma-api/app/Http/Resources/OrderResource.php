<?php

namespace App\Http\Resources;

use App\Http\Resources\CustomerResource;
use App\Http\Resources\SaleResource;
use App\Http\Resources\UserResource;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'order_id' => $this->id,
            'order_reference' => $this->reference,
            'order_titled' => $this->titled,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'customer_id' => $this->customer_id,
            'customerName' => $this->customer_name,
            'customer' => $this->whenLoaded('customer') ?  new CustomerResource($this->whenLoaded('customer')) : null,
            'sales' => $this->whenLoaded('sales') ? SaleResource::collection($this->sales) : [],
            'falsesales' => SaleResource::collection($this->whenLoaded('falsesales')),
            'returns' => ReturnSaleResource::collection($this->whenLoaded('returns')),
            'order_price' => $this->price,
            'amountMix' => $this->amount_mix ? json_decode($this->amount_mix, true) : null,
            'order_state' => $this->state,
            'order_date' => $this->date_order,
            'order_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'order_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];

    }
}
