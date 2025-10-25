<?php

require_once __DIR__ . "/./Database.php";

class TablesInitializer
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConn();
    }

    public function initializeTables()
    {
        try {
            $this->db->exec("
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT PRIMARY KEY,
                    user_name VARCHAR(255) NOT NULL,
                    user_email VARCHAR(255) NOT NULL UNIQUE,
                    user_img TEXT,
                    user_password VARCHAR(255) NOT NULL
                )
            ");

            $this->db->exec("
                CREATE TABLE IF NOT EXISTS clients (
                    client_id INT AUTO_INCREMENT PRIMARY KEY,
                    client_name VARCHAR(255) NOT NULL,
                    client_number VARCHAR(20) NOT NULL,
                    user_id INT,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                )
            ");

            $this->db->exec("
                CREATE TABLE IF NOT EXISTS products (
                    product_id INT AUTO_INCREMENT PRIMARY KEY,
                    product_name VARCHAR(255) NOT NULL,
                    product_price DECIMAL(10,2) NOT NULL,
                    product_amount INT NOT NULL,
                    user_id INT,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                )
            ");

            $this->db->exec("
                CREATE TABLE IF NOT EXISTS orders (
                    order_id INT AUTO_INCREMENT PRIMARY KEY,
                    order_details TEXT,
                    order_date DATETIME NOT NULL,
                    order_status VARCHAR(50) NOT NULL,
                    order_price DECIMAL(10,2) NOT NULL,
                    client_name VARCHAR(255) NOT NULL,
                    client_number VARCHAR(20) NOT NULL,
                    client_id INT,
                    FOREIGN KEY (client_id) REFERENCES clients(client_id)
                )
            ");

            $this->db->exec("
                CREATE TABLE IF NOT EXISTS ordersproduct (
                    order_id INT,
                    product_id INT,
                    PRIMARY KEY (order_id, product_id),
                    FOREIGN KEY (order_id) REFERENCES orders(order_id),
                    FOREIGN KEY (product_id) REFERENCES products(product_id)
                )
            ");

            return true;
        } catch (PDOException $err) {
            echo "Database initialization failed: " . $err->getMessage();
            return false;
        }
    }
}
