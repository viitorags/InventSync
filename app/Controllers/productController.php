<?php
require __DIR__ . "/../Models/productModel.php";

class ProductController
{
    private $productModel;

    public function __construct()
    {
        $this->productModel = new ProductModel();
    }

    public function getAllProducts()
    {
        header('Content-Type: application/json');

        $this->productModel->getAllProducts();

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function createNewProduct()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $product_name = $data['product_name'] ?? '';
        $product_price = $data['product_price'] ?? '';
        $product_amount = $data['product_amount'] ?? '';
        $user_id = $_SESSION['user_id'] ?? '';

        $this->productModel->createNewProduct($product_name, $product_price, $product_amount, $user_id);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function updateProduct()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $product_name = $data['product_name'] ?? '';
        $product_price = $data['product_price'] ?? '';
        $product_amount = $data['product_amount'] ?? '';
        $product_id = $data['user_id'] ?? '';

        $this->productModel->updateProduct($product_name, $product_price, $product_amount, $product_id);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function deleteProduct()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $product_id = $data['user_id'] ?? '';

        header('Content-Type: application/json');

        $this->productModel->deleteProduct($product_id);

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }
}
