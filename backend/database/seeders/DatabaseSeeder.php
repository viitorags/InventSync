<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->create([
            'product_name' => "Smart TV",
            'product_price' => 1200.99,
            'product_amount' => 20,
            'product_desc' => "Televisão Smart TV",
            'user_id' => 1,
        ]);

        Product::factory()->create([
            'product_name' => "Smart TV",
            'product_price' => 1200.99,
            'product_amount' => 20,
            'product_desc' => "Televisão Smart TV",
            'user_id' => 1,
        ]);

        Product::factory()->create([
            'product_name' => "Smart TV",
            'product_price' => 1200.99,
            'product_amount' => 20,
            'product_desc' => "Televisão Smart TV",
            'user_id' => 1,
        ]);

        Product::factory()->create([
            'product_name' => "Smart TV",
            'product_price' => 1200.99,
            'product_amount' => 20,
            'product_desc' => "Televisão Smart TV",
            'user_id' => 1,
        ]);
    }
}

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        //
    }
}

class OrdersSeeder extends Seeder
{
    public function run(): void
    {
        //
    }
}
