<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $customerStatus = $this->status;

        if ($this->is_prospect) {
            $customerStatus = "prospect";
        }

        return [
            'id'              => $this->id,
            'firstName'       => $this->first_name,
            'matricule'       => $this->matricule,
            'name'            => $this->first_name . ' ' . $this->last_name,
            'isProspect'      => $this->is_prospect == 0 ? false : true,
            'lastName'        => $this->last_name,
            'status'          => $customerStatus,
            'contractStart'   => $this->contract_start?->toDateString(),
            'contractEnd'     => $this->contract_end?->toDateString(),
            'paymentExpiry'   => $this->payment_expiry?->toDateString(),
            'email'           => $this->email,
            'phone'           => $this->phone,
            'dateOfBirth'     => $this->date_of_birth?->toDateString(),
            'nationality'     => $this->nationality,
            'countryOfOrigin' => $this->country_of_origin,
            'profession'      => $this->profession,
            'employer'        => $this->employer,
            'monthlyIncome'   => $this->monthly_income,
            'emergencyContact'=> $this->emergency_contact,
            'emergencyPhone'  => $this->emergency_phone,
            'notes'           => $this->notes,
            'documents'       => $this->documents ?? [],
            'createdAt'       => $this->created_at?->format('Y-m-d H:i:s'),
            'updatedAt'       => $this->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}
