<?php

require_once __DIR__ . '/../Models/ordersModel.php';

class OrdersController
{
    private $ordersModel;

    public function __construct()
    {
        $this->ordersModel = new OrdersModel();
    }

    public function getOrders()
    {
        try {
            $user_id = $_SESSION["user_id"];
            $orders = $this->ordersModel->getOrder($user_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $orders]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function createNewOrder()
    {
        try {
            $order_details = $_POST['order_details'] ?? '';
            $order_date = $_POST['order_date'] ?? '';
            $order_status = $_POST['order_status'] ?? '';
            $order_price = $_POST['order_price'] ?? '';
            $client_name = $_POST['client_name'] ?? '';
            $client_number = $_POST['client_number'] ?? '';
            $client_id = $_POST['client_id'] ?? '';
            $product_ids_json = $_POST['product_ids'] ?? '';

            $product_ids = json_decode($product_ids_json, true);

            if (!is_array($product_ids) || empty($product_ids)) {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Nenhum produto selecionado']);
                return;
            }

            $order = $this->ordersModel->createNewOrder(
                $order_details,
                $order_date,
                $order_status,
                $order_price,
                $client_name,
                $client_number,
                $client_id,
                $product_ids
            );

            header('Content-Type: application/json');
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Pedido criado com sucesso!',
                'data' => [
                    'order_id' => $order['order_id'],
                    'order_details' => $order_details,
                    'order_date' => $order_date,
                    'order_status' => $order_status,
                    'order_price' => $order_price,
                    'client_name' => $client_name,
                    'client_number' => $client_number
                ]
            ]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function updateOrder()
    {
        try {
            parse_str(file_get_contents("php://input"), $_PUT);

            $order_id = $_PUT['order_id'] ?? '';
            $order_details = $_PUT['order_details'] ?? '';
            $order_date = $_PUT['order_date'] ?? '';
            $client_name = $_PUT['client_name'] ?? '';
            $client_number = $_PUT['client_number'] ?? '';
            $order_price = $_PUT['order_price'] ?? '';
            $client_id = $_PUT['client_id'] ?? '';

            if (empty($order_id)) {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID do pedido não fornecido']);
                return;
            }

            $success = $this->ordersModel->updateOrder(
                $order_id,
                $order_details,
                $order_date,
                $client_name,
                $client_number,
                $order_price,
                $client_id
            );

            if ($success) {
                header('Content-Type: application/json');
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Pedido atualizado com sucesso!']);
            } else {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Falha ao atualizar pedido.']);
            }
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function deleteOrder()
    {
        try {
            parse_str(file_get_contents("php://input"), $_DELETE);
            $order_id = $_DELETE['order_id'] ?? '';

            if (empty($order_id)) {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID do pedido não fornecido']);
                return;
            }

            $this->ordersModel->deleteOrder($order_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Pedido removido com sucesso!']);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }
}
