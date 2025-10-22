<?php

require __DIR__ . "/../Config/Database.php";

class OrdersModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConn();
    }

    public function getOrder()
    {
        try {
            $query = "SELECT * FROM orders";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result[0] ?? null;
        } catch (PDOException $err) {
            echo "Erro ao obter pedidos " . $err->getMessage();
            return null;
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
            $this->db->beginTransaction();

            $orderQuery = "
                INSERT INTO orders (order_details, order_date, order_status, order_price, client_name, client_number, client_id)
                VALUES (:order_details, :order_date, :order_status, :order_price, :client_name, :client_number, :client_id)
            ";
            $stmt = $this->db->prepare($orderQuery);
            $stmt->execute([
                'order_details' => $order_details,
                'order_date' => $order_date,
                'order_status' => $order_status,
                'order_price' => $order_price,
                'client_name' => $client_name,
                'client_number' => $client_number,
                'client_id' => $clientIdInt,
            ]);
            $order_id = $this->db->lastInsertId();

            $orderProductQuery = "INSERT INTO ordersproduct (order_id, product_id) VALUES (?, ?)";
            $stmtProduct = $this->db->prepare($orderProductQuery);

            foreach ($product_ids as $product_id) {
                $stmtProduct->execute([$order_id, (int)$product_id]);
            }

            $this->db->commit();

            return ['order_id' => $order_id];
        } catch (PDOException $err) {
            $this->db->rollBack();
            echo "Erro ao criar pedido " . $err->getMessage();
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
            echo "Erro ao atualizar pedido " . $err->getMessage();
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
            echo "Erro ao deletar pedido " . $err->getMessage();
        }
    }
}
