<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        $products = Product::where('user_id', $user->user_id)->get();
        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $user = auth('api')->user();

        $data = $request->validated();
        $data['user_id'] = $user->user_id;

        $product = Product::create($data);
        return new ProductResource($product);
    }

    public function update(StoreProductRequest $request)
    {
        $user = auth('api')->user();
        $productId = $request->query('product_id');

        if (!$productId) {
            return response()->json(['message' => 'ID do produto não fornecido'], 400);
        }

        $product = Product::where('product_id', $productId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }

        $product->update($request->validated());
        return new ProductResource($product);
    }

    public function destroy()
    {
        $user = auth('api')->user();
        $productId = request()->query('product_id');

        if (!$productId) {
            return response()->json(['message' => 'ID do produto não fornecido'], 400);
        }

        $product = Product::where('product_id', $productId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Produto não encontrado'], 404);
        }

        $product->delete();
        return response(null, 204);
    }
}
