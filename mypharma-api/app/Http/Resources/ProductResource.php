<?php

namespace App\Http\Resources;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'reference' => $this->reference,
            'name' => $this->name,
            'category_id' => $this->category_id,
            'quantity' => $this->quantity,
            'quantity_alert' => $this->quantity_alert,
            'purchase_price' => $this->purchase_price,
            'sale_price' => $this->sale_price,
            'batch_number' => $this->batch_number,
            'expiry_date' => $this->expiry_date,
            'manufacture_date' => $this->manufacture_date,
            'active_ingredient' => $this->active_ingredient,
            'dosage' => $this->dosage,
            'form' => $this->form,
            'laboratory' => $this->laboratory,
            'barcode' => $this->barcode,
            'therapeutic_class' => $this->therapeutic_class,
            'storage_condition' => $this->storage_condition,
            'source' => $this->source,
            // Legacy aliases for existing frontend screens.
            'product_id' => $this->id,
            'product_reference' => $this->reference,
            'product_name' => $this->name,
            'product_category_id' => $this->category_id,
            'product_quantity' => $this->quantity,
            'product_quantity_alert' => $this->quantity_alert,
            'product_purchase_price' => $this->purchase_price,
            'product_sale_price' => $this->sale_price,
            'product_batch_number' => $this->batch_number,
            'product_expiry_date' => $this->expiry_date,
            'product_manufacture_date' => $this->manufacture_date,
            'product_active_ingredient' => $this->active_ingredient,
            'product_dosage' => $this->dosage,
            'product_form' => $this->form,
            'product_laboratory' => $this->laboratory,
            'product_barcode' => $this->barcode,
            'product_therapeutic_class' => $this->therapeutic_class,
            'product_storage_condition' => $this->storage_condition,
            'picture' => $this->picture ? asset("public/storage/avatars/{$this->picture}") : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'product_lots' => $this->whenLoaded('productLots', function () {
                return $this->productLots->map(function ($lot) {
                    return [
                        'id' => $lot->id,
                        'batch_number' => $lot->batch_number,
                        'expiry_date' => $lot->expiry_date ? $lot->expiry_date->format('Y-m-d') : null,
                        'manufacture_date' => $lot->manufacture_date ? $lot->manufacture_date->format('Y-m-d') : null,
                        'available_quantity' => intval($lot->available_quantity),
                        'received_quantity' => intval($lot->received_quantity),
                        'last_purchase_price' => $lot->last_purchase_price,
                        'last_entry_id' => $lot->last_entry_id,
                        'last_received_at' => $lot->last_received_at ? $lot->last_received_at->format('Y-m-d H:i:s') : null,
                    ];
                })->values();
            }),
            'ordersCount' => $this->orders_count, // nombre de commandes donc figure le produits
            'totalQuantity' => $this->total_quantity == 'null' ? 0 : intval($this->total_quantity), // quantite vendu
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
