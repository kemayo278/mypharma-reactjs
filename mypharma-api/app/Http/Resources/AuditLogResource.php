<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
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
            'id'             => $this->id,
            'user'           => new UserResource($this->whenLoaded('user')),
            'action'         => $this->action,
            'previous_state' => $this->previous_state,
            'new_state'      => $this->new_state,
            'metadata'       => $this->metadata,
            'changes'        => $this->changes,
            'ip_address'     => $this->ip_address,
            'status'         => $this->status,
            'message'        => $this->message,
            'created_at'     => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at'     => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
