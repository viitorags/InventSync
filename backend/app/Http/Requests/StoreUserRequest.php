<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreUserRequest extends FormRequest
{
    /**
     *  Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_name' => ['nullable', 'string', 'min:3'],
            'user_email' => ['nullable', 'email'],
            'user_password' => ['nullable', 'string', 'min:8'],
            'user_avatar' => ['nullable', 'string'],
        ];
    }
}
