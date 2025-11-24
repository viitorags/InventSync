<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrder;
use App\Http\Resources\OrderResource;

class OrdersController extends Controller
{
    public function index()
    {
        $orders = Order::all();
        return OrderResource::collection($orders);
    }

    public function store(StoreOrder $request)
    {
        $order = Order::create($request->validate());
        return new OrderResource($order);
    }

    public function update(StoreOrder $request, Order $order)
    {
        $order->update($request->validate());
        return new OrderResource($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response(null, 204);
    }
}
