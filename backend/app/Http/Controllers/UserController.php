<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUser;
use App\Models\User;
use App\Http\Resources\UserResource;

/* use App\Services\ResponseService; */

class UserController extends Controller
{
    public function show()
    {
        //
    }

    public function store(StoreUser $request)
    {
        $user = User::create($request->validate());
        return new UserResource($user);
    }

    public function update(StoreUser $request, User $user)
    {
        $user->update($request->validate());
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response(null, 204);
    }
}
