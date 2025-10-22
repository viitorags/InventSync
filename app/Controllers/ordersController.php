<?php
require __DIR__ . "/../Models/ordersModel.php";

class OrdersController
{
    private $ordersModel;

    public function __construct()
    {
        $this->ordersModel = new OrdersModel();
    }

    public function getOrders()
    {
        header('Content-Type: application/json');

        $this->ordersModel->getOrder();

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function createNewOrder()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $order_details = $data['order_details'] ?? '';
        $order_date = $data['order_date'] ?? '';
        $order_status = $data['order_status'] ?? '';
        $order_price = $data['order_price'] ?? '';
        $client_name = $data['client_name'] ?? '';
        $client_number = $data['client_number'] ?? '';
        $client_id = $data['client_id'] ?? '';
        $product_ids = $data['product_ids'] ?? '';

        $this->ordersModel->createNewOrder(
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
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function updateOrder()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $user_id = $_SESSION['user_id'];
        $order_id = $data['order_id'] ?? '';
        $order_details = $data['order_details'] ?? '';
        $order_date = $data['order_date'] ?? '';
        $client_name = $data['client_name'] ?? '';
        $client_number = $data['client_number'] ?? '';
        $order_price = $data['order_price'] ?? '';

        $this->ordersModel->updateOrder(
            $order_id,
            $order_details,
            $order_date,
            $client_name,
            $client_number,
            $order_price,
            $user_id
        );

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function deleteOrder()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $order_id = $data['order_id'] ?? '';

        header('Content-Type: application/json');

        $this->ordersModel->deleteOrder($order_id);

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }
}
