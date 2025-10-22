<?php

require __DIR__ . "/../Config/Database.php";

class ProductModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConn();
    }

    public function getAllProducts()
    {
        try {
            $query = "SELECT * FROM products";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            echo "Erro ao obter produtos " . $err->getMessage();
            return false;
        }
    }

    public function createNewProduct($product_name, $product_price, $product_amount, $user_id)
    {
        try {
            $query = "INSERT INTO products (
                product_name,
                product_price,
                product_amount,
                user_id)
            VALUES (:product_name, :product_price, :product_amount, :user_id)";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'product_name' => $product_name,
                'product_price' => $product_price,
                'product_amount' => $product_amount,
                'user_id' => $user_id
            ]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $err) {
            echo "Erro ao criar novo produto " . $err->getMessage();
        }
    }

    public function updateProduct($product_id, $product_name, $product_price, $product_amount)
    {
        try {
            $query = "UPDATE products
                      SET product_name = :product_name,
                          product_price = :product_price,
                          product_amount = :product_amount
                      WHERE product_id = :product_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'product_name'    => $product_name,
                'product_price' => $product_price,
                'product_amount' => $product_amount,
                'product_id' => $product_id
            ]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $err) {
            echo "Erro ao atualizar produto " . $err->getMessage();
        }
    }

    public function deleteProduct($product_id)
    {
        try {
            $query = "DELETE FROM products WHERE product_id = :product_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['product_id' => $product_id]);
            return $stmt->rowCount();
        } catch (PDOException $err) {
            echo "Erro ao deletar produto " . $err->getMessage();
        }
    }
}
