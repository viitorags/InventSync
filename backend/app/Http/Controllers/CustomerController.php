<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $customers = Customer::where('user_id', $user->user_id)->get();
        return CustomerResource::collection($customers);
    }

    public function store(StoreCustomerRequest $request)
    {
        $user = auth('api')->user();

        $data = $request->validated();
        $data['user_id'] = $user->user_id;

        $customer = Customer::create($data);
        return new CustomerResource($customer);
    }

    public function update(StoreCustomerRequest $request)
    {
        $user = auth('api')->user();
        $customerId = $request->query('customer_id');

        if (!$customerId) {
            return response()->json(['message' => 'ID do cliente não fornecido'], 400);
        }

        $customer = Customer::where('customer_id', $customerId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$customer) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        $customer->update($request->validated());
        return new CustomerResource($customer);
    }

    public function destroy()
    {
        $user = auth('api')->user();
        $customerId = request()->query('customer_id');

        if (!$customerId) {
            return response()->json(['message' => 'ID do cliente não fornecido'], 400);
        }

        $customer = Customer::where('customer_id', $customerId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$customer) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        $customer->delete();
        return response(null, 204);
    }
}
