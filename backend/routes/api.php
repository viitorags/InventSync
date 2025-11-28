<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Rotas publicas para autenticação
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Rotas Protegidas por Middelware
Route::middleware('jwt.auth')->group(function () {
    // Usuários
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Produtos
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products', [ProductController::class, 'update']);
    Route::delete('/products', [ProductController::class, 'destroy']);

    // Clientes
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers', [CustomerController::class, 'update']);
    Route::delete('/customers', [CustomerController::class, 'destroy']);

    // Pedidos
    Route::get('/orders', [OrdersController::class, 'index']);
    Route::post('/orders', [OrdersController::class, 'store']);
    Route::put('/orders', [OrdersController::class, 'update']);
    Route::delete('/orders', [OrdersController::class, 'destroy']);
});
