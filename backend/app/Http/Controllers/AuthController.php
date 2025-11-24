<?php

use App\Http\Controllers\Controller;
use App\Models\User;

class AuthController extends Controller
{
    private $user;

    public function __construct(User $user)
    {
        //
    }

    public function login()
    {
        try {
        } catch (\Exception | PDOException $err) {
            throw $err->getMessage();
        }
    }

    public function register()
    {
        //
    }
}
