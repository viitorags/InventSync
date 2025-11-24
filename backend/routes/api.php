<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
/* use Illuminate\Http\Request; */

// UserAPI
Route::get('/users', 'UserController@showUser');

// ProductAPI
Route::get('/products', 'ProductController@getProducts');
