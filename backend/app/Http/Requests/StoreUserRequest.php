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
            'user_name' => ['required', 'string', 'min:3'],
            'user_email' => ['required', 'email', 'unique:users,user_email'],
            'user_password' => ['required', 'string', 'min:8'],
            'user_avatar' => ['nullable', 'string'],
        ];
    }


    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json([
                'msg' => 'Ops! Campo obrigatório não preenchido',
                'status' => false,
                'errors' => $validator->errors(),
                'url' => route('users.createUser')
            ], 403));
        }
    }
}
