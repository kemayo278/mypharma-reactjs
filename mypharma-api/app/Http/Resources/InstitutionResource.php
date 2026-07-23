<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InstitutionResource extends JsonResource
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
            'Institution_id' => $this->id,
            'Institution_name' => $this->name,
            'Institution_state' => $this->state,
            'Institution_matriculation' => $this->matriculation,
            'Institution_phone' => $this->phone,
            'Institution_pj' => $this->pj,
            'Institution_number_register' => $this->number_register,
            'Institution_pj_register' => $this->pj_register,
            'Institution_num_declaration' => $this->num_declaration,
            'Institution_img' => $this->img ? asset("storage/avatars/{$this->img}") : null,
            'Institution_cycle' => $this->cycle,
            'Institution_telephone' => $this->telephone,
            'Institution_couverture' => $this->couverture,
            'Institution_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'Institution_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
