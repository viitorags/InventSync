<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\StoreCustomer;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::all();
        return CustomerResource::collection($customers);
    }

    public function store(StoreCustomer $request)
    {
        $customer = Customer::create($request->validate());
        return new CustomerResource($customer);
    }

    public function update(StoreCustomer $request, Customer $customer)
    {
        $customer->update($request->validate());
        return new CustomerResource($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response(null, 204);
    }
}
