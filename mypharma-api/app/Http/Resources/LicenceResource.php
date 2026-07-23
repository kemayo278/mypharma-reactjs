<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LicenceResource extends JsonResource
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
            'id' => $this->id,
            'activationKey' => $this->activation_key,
            'userId' => $this->user_id,
            'configId' => $this->config_id,
            'durationDays' => $this->duration_days,
            'amount' => $this->amount,
            'paymentMethod' => $this->payment_method,
            'phoneNumber' => $this->phone_number,
            'isActive' => $this->is_active,
            'notes' => $this->notes,
            'beginDate' => $this->begin_date,
            'endDate' => $this->end_date,
            'user' => $this->whenLoaded('user') ? new UserResource($this->whenLoaded('user')) : null,
            'config' => $this->whenLoaded('config') ? new ConfigResource($this->whenLoaded('config')) : null,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
