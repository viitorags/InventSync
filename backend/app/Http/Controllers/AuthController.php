<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        $user = User::where('user_email', $data['user_email'])->first();
        if (! $user || ! Hash::check($data['user_password'], $user->user_password)) {
            return response()->json([
                'message' => 'Credenciais Inválidas'
            ], 401);
        } else {
            $token = auth()->guard('api')->login($user);
            return response()->json([
                'acess_token' => $token,
                'token_type' => 'bearer',
            ]);
        }
    }

    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validate());
        $token = auth()->guard('api')->login($user);
        return response()->json([
            'user' => new UserResource($user),
            'acess_token' => $token,
            'token_type' => 'bearer',
        ]);
    }

    public function logout()
    {
        auth()->guard('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me()
    {
        return response()->json(auth()->guard('api')->user());
    }
}
