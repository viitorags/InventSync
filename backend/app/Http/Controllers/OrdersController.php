<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $orders = Order::where('user_id', $user->user_id)
            ->with('products')
            ->get();
        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request)
    {
        $user = auth('api')->user();

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['user_id'] = $user->user_id;

            $products = $data['products'] ?? [];
            unset($data['products']);

            $order = Order::create($data);

            if (!empty($products)) {
                $order->products()->attach($products);
            }

            DB::commit();

            return new OrderResource($order->load('products'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(StoreOrderRequest $request)
    {
        $user = auth('api')->user();
        $orderId = $request->query('order_id');

        if (!$orderId) {
            return response()->json(['message' => 'ID do pedido não fornecido'], 400);
        }

        $order = Order::where('order_id', $orderId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        try {
            DB::beginTransaction();

            $data = $request->validated();

            $products = $data['products'] ?? [];
            unset($data['products']);

            $order->update($data);

            if (isset($products)) {
                $order->products()->sync($products);
            }

            DB::commit();

            return new OrderResource($order->load('products'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy()
    {
        $user = auth('api')->user();
        $orderId = request()->query('order_id');

        if (!$orderId) {
            return response()->json(['message' => 'ID do pedido não fornecido'], 400);
        }

        $order = Order::where('order_id', $orderId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        $order->delete();
        return response(null, 204);
    }
}
