<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

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
                'access_token' => $token,
                'token_type' => 'bearer',
            ]);
        }
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['user_password'] = Hash::make($data['user_password']);

        $user = User::create($data);

        if ($request->hasFile('avatar')) {
            $user->user_avatar = $request->file('avatar')->store('avatars', 'public');
            $user->save();
        }

        try {
            $token = auth()->guard('api')->login($user);
        } catch (JWTException $err) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
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
        try {
            $user = auth()->guard('api')->user();
            if (!$user) {
                return response()->json(['error' => 'sem user'], 401);
            }
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['debug' => $e->getMessage()], 500);
        }
    }
}
