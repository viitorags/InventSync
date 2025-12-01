<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_details' => ['nullable', 'string'],
            'order_date' => ['required', 'date'],
            'order_status' => ['required', 'string', 'max:50'],
            'order_price' => ['required', 'numeric', 'min:0'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_number' => ['required', 'string', 'max:20'],
            'customer_id' => ['nullable', 'string', 'exists:customers,customer_id'],
            'products' => ['nullable', 'array'],
            'products.*' => ['string', 'exists:products,product_id'],
        ];
    }
}
