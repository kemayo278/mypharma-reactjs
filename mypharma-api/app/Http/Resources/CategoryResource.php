<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
        return [ // Si vous avez besoin de contrôler précisément quels attributs sont inclus dans la réponse JSON, en les sélectionnant manuellement, le deuxième bloc de code est préférable.
            'category_id' => $this->id,
            'category_name' => $this->name,
            'category_description' => $this->description == null ? '' : $this->description,
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'category_created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'category_updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
