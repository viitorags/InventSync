<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'order_id' => $this->order_id,
            'order_details' => $this->order_details,
            'order_date' => $this->order_date,
            'order_status' => $this->order_status,
            'order_price' => $this->order_price,
            'customer_name' => $this->customer_name,
            'customer_number' => $this->customer_number,
            'customer_id' => $this->customer_id,
            'user_id' => $this->user_id,
            'products' => $this->whenLoaded('products', function () {
                return $this->products->pluck('product_name')->toArray();
            }),
            'product_ids' => $this->whenLoaded('products', function () {
                return $this->products->pluck('product_id')->toArray();
            }),
        ];
    }
}
