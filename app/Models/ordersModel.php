<?php

require_once __DIR__ . "/../Config/Database.php";

class OrdersModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConn();
    }

    public function generateUniqueId()
    {
        do {
            $id = random_int(100000, 999999);
            $stmt = $this->db->prepare("SELECT order_id FROM orders WHERE order_id = :id");
            $stmt->execute(['id' => $id]);

            $exists = $stmt->fetch();
        } while ($exists);

        return $id;
    }

    public function getOrder($client_id)
    {
        try {
            $query = "SELECT * FROM orders WHERE client_id = :client_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['client_id' => $client_id]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function getOrdersByUser($user_id)
    {
        try {
            $query = "SELECT o.* FROM orders o
                      INNER JOIN clients c ON o.client_id = c.client_id
                      WHERE c.user_id = :user_id
                      ORDER BY o.order_date DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['user_id' => $user_id]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function createNewOrder(
        $order_details,
        $order_date,
        $order_status,
        $order_price,
        $client_name,
        $client_number,
        $client_id,
        $product_ids
    ) {
        $clientIdInt = (int)$client_id;
        try {
            $id = $this->generateUniqueId();
            $this->db->beginTransaction();

            $orderQuery = "
            INSERT INTO orders (
                order_id,
                order_details,
                order_date,
                order_status,
                order_price,
                client_name,
                client_number,
                client_id)
                VALUES (:order_id ,:order_details, :order_date, :order_status, :order_price, :client_name, :client_number, :client_id)
            ";
            $stmt = $this->db->prepare($orderQuery);
            $stmt->execute([
                'order_id' => $id,
                'order_details' => $order_details,
                'order_date' => $order_date,
                'order_status' => $order_status,
                'order_price' => $order_price,
                'client_name' => $client_name,
                'client_number' => $client_number,
                'client_id' => $clientIdInt,
            ]);

            $orderProductQuery = "INSERT INTO ordersproduct (order_id, product_id) VALUES (?, ?)";
            $stmtProduct = $this->db->prepare($orderProductQuery);

            foreach ($product_ids as $product_id) {
                $stmtProduct->execute([$id, (int)$product_id]);
            }

            $this->db->commit();

            return ['order_id' => $id];
        } catch (PDOException $err) {
            $this->db->rollBack();
            throw $err;
        }
    }

    public function updateOrder(
        $order_id,
        $order_details,
        $order_date,
        $client_name,
        $client_number,
        $order_price,
        $user_id
    ) {
        try {
            $query = "
                UPDATE orders
                SET order_details = :order_details,
                    order_date = :order_date,
                    client_name = :client_name,
                    client_number = :client_number,
                    order_price = :order_price,
                    client_id = :client_id
                WHERE order_id = :order_id
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'order_details' => $order_details,
                'order_date'   => $order_date,
                'client_name'  => $client_name,
                'client_number' => $client_number,
                'order_price' => $order_price,
                'client_id' => $user_id,
                'order_id' => $order_id,
            ]);

            $selectQuery = "SELECT * FROM orders WHERE order_id = :order_id";
            $selectStmt = $this->db->prepare($selectQuery);
            $selectStmt->execute(['order_id' => $order_id]);
            $result = $selectStmt->fetch(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function deleteOrder($order_id)
    {
        try {
            $query = "DELETE FROM orders WHERE order_id = :order_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['order_id' => $order_id]);
            return $stmt->rowCount();
        } catch (PDOException $err) {
            throw $err;
        }
    }
}
