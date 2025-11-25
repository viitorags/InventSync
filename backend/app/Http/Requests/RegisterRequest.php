<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_name' => ['required', 'string', 'min:3'],
            'user_email' => ['required', 'email', 'unique:users,email'],
            'user_password' => ['required', 'string', 'min:8'],
            'user_avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
