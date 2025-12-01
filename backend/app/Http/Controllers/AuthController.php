<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        /** @var JWTGuard */
        $jwt = auth('api');

        $data = $request->validated();

        $remember = $data['remember'] ?? false;

        $ttl = $remember ? 10080 : 60;

        $user = User::where('user_email', $data['user_email'])->first();

        if (! $user || ! Hash::check($data['user_password'], $user->user_password)) {
            return response()->json([
                'message' => 'Credenciais Inválidas'
            ], 401);
        }

        $token = $jwt->setTTL($ttl)->login($user);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $jwt->factory()->getTTL() * 60,
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['user_password'] = Hash::make($data['user_password']);

        if (isset($data['user_avatar']) && $data['user_avatar']) {
            $avatar = $data['user_avatar'];

            if (preg_match('/^data:image\/(\w+);base64,/', $avatar, $type)) {
                $avatar = substr($avatar, strpos($avatar, ',') + 1);
                $type = strtolower($type[1]);

                if (in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $avatar = base64_decode($avatar);

                    if ($avatar !== false) {
                        $filename = 'avatars/' . uniqid() . '_' . time() . '.' . $type;

                        Storage::disk('public')->put($filename, $avatar);

                        $data['user_avatar'] = $filename;
                    }
                }
            }
        }

        $user = User::create($data);

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
            return new UserResource($user);
        } catch (\Exception $e) {
            return response()->json(['debug' => $e->getMessage()], 500);
        }
    }

    public function update(StoreUserRequest $request)
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        $data = $request->validated();

        if (isset($data['user_password'])) {
            $data['user_password'] = Hash::make($data['user_password']);
        }

        if (isset($data['user_avatar']) && $data['user_avatar']) {
            $avatar = $data['user_avatar'];

            if (preg_match('/^data:image\/(\w+);base64,/', $avatar, $type)) {
                $avatar = substr($avatar, strpos($avatar, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif

                if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    return response()->json(['error' => 'Tipo de imagem inválido'], 400);
                }

                $avatar = base64_decode($avatar);

                if ($avatar === false) {
                    return response()->json(['error' => 'Falha ao decodificar imagem'], 400);
                }

                if ($user->user_avatar && Storage::disk('public')->exists($user->user_avatar)) {
                    Storage::disk('public')->delete($user->user_avatar);
                }

                $filename = 'avatars/' . $user->user_id . '_' . time() . '.' . $type;

                Storage::disk('public')->put($filename, $avatar);

                $data['user_avatar'] = $filename;
            }
        }

        foreach ($data as $key => $value) {
            $user->$key = $value;
        }
        $user->save();

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response(null, 204);
    }
}
