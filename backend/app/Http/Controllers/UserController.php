<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Http\Resources\UserResource;

/* use App\Services\ResponseService; */

class UserController extends Controller
{
    public function update(StoreUserRequest $request, User $user)
    {
        $user->update($request->validated());

        if ($request->hasFile('avatar')) {
            $pathAvatar = $request->file('avatar')->store('avatars', 'public');
            $user->user_avatar = $pathAvatar;
            $user->save();
        }

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response(null, 204);
    }
}
