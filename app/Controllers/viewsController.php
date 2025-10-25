<?php

require_once __DIR__ . '/../Models/userModel.php';
require_once __DIR__ . '/../Models/clientModel.php';
require_once __DIR__ . '/../Models/productModel.php';
require_once __DIR__ . '/../Models/ordersModel.php';

class ViewsController
{
    private $userModel;
    private $productModel;
    private $clientModel;
    private $ordersModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->productModel = new ProductModel();
        $this->clientModel = new ClientModel();
        $this->ordersModel = new OrdersModel();
    }

    public function getUserData()
    {
        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) return null;

        return $this->userModel->getUser($user_id);
    }

    public function getAllProducts()
    {
        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) return null;

        return $this->productModel->getAllProducts($user_id);
    }

    public function getClient()
    {
        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) return null;

        return $this->clientModel->getClient($user_id);
    }

    public function getOrders()
    {
        $user_id = $_SESSION['user_id'] ?? null;
        if (!$user_id) return [];

        return $this->ordersModel->getOrdersByUser($user_id);
    }
}
