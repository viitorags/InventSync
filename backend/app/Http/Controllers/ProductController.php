<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProduct;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return ProductResource::collection($products);
    }

    public function store(StoreProduct $request)
    {
        $product = Product::create($request->validate());
        return new ProductResource($product);
    }

    public function update(StoreProduct $request, Product $product)
    {
        $product->update($request->validate());
        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response(null, 204);
    }
}
