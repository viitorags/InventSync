<?php

require_once __DIR__ . '/../Config/Database.php';

class ProductModel
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
            $stmt = $this->db->prepare("SELECT product_id FROM products WHERE product_id = :id");
            $stmt->execute(['id' => $id]);

            $exists = $stmt->fetch();
        } while ($exists);

        return $id;
    }

    public function getAllProducts($user_id)
    {
        try {
            $query = "SELECT * FROM products WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['user_id' => $user_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function createNewProduct($product_name, $product_price, $product_amount, $user_id)
    {
        try {
            $id = $this->generateUniqueId();
            $query = "INSERT INTO products (
                product_id,
                product_name,
                product_price,
                product_amount,
                user_id)
            VALUES (:product_id, :product_name, :product_price, :product_amount, :user_id)";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'product_id' => $id,
                'product_name' => $product_name,
                'product_price' => $product_price,
                'product_amount' => $product_amount,
                'user_id' => $user_id
            ]);
            return $id;
        } catch (PDOException $err) {
            throw $err;
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
            throw $err;
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
            throw $err;
        }
    }
}
