<?php

require_once __DIR__ . '/../Models/productModel.php';

class ProductController
{
    private $productModel;

    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $this->productModel = new ProductModel();
    }

    public function getAllProducts()
    {
        try {
            if (!isset($_SESSION["user_id"])) {
                header('Content-Type: application/json');
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
                return;
            }

            $user_id = $_SESSION["user_id"];
            $products = $this->productModel->getAllProducts($user_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $products]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function createNewProduct()
    {
        try {
            if (!isset($_SESSION['user_id'])) {
                header('Content-Type: application/json');
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
                return;
            }

            $product_name = $_POST['product_name'] ?? '';
            $product_price = $_POST['product_price'] ?? '';
            $product_amount = $_POST['product_amount'] ?? '';
            $user_id = $_SESSION['user_id'] ?? '';

            $productId = $this->productModel->createNewProduct($product_name, $product_price, $product_amount, $user_id);

            header('Content-Type: application/json');
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Produto criado com sucesso!', 'data' => ['product_id' => $productId]]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function updateProduct()
    {
        try {
            if (!isset($_SESSION['user_id'])) {
                header('Content-Type: application/json');
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
                return;
            }

            parse_str(file_get_contents("php://input"), $_PUT);

            $product_name = $_PUT['product_name'] ?? '';
            $product_price = $_PUT['product_price'] ?? '';
            $product_amount = $_PUT['product_amount'] ?? '';
            $product_id = $_PUT['product_id'] ?? '';

            $success = $this->productModel->updateProduct($product_id, $product_name, $product_price, $product_amount);

            if ($success) {
                header('Content-Type: application/json');
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso!']);
            } else {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Falha ao atualizar produto.']);
            }
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function deleteProduct()
    {
        try {
            if (!isset($_SESSION['user_id'])) {
                header('Content-Type: application/json');
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
                return;
            }

            parse_str(file_get_contents("php://input"), $_DELETE);
            $product_id = $_DELETE['product_id'] ?? '';

            if (empty($product_id)) {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID do produto não fornecido']);
                return;
            }

            $result = $this->productModel->deleteProduct($product_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Produto removido com sucesso!']);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
