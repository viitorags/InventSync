<?php

require_once __DIR__ . '/../Config/Database.php';

class UserModel
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
            $stmt = $this->db->prepare("SELECT user_id FROM users WHERE user_id = :id");
            $stmt->execute(['id' => $id]);

            $exists = $stmt->fetch();
        } while ($exists);

        return $id;
    }

    public function getUserByEmail($email)
    {
        try {
            $query = "SELECT * FROM users WHERE user_email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['email' => $email]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function getUser($user_id)
    {
        try {
            $query = "SELECT * FROM users WHERE user_id = :user_id";

            $stmt = $this->db->prepare($query);
            $stmt->execute(['user_id' => $user_id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $err) {
            echo "Erro ao obter usuário: " . $err->getMessage();
            return false;
        }
    }

    public function createUser($user_name, $user_email, $user_img, $user_password)
    {
        try {
            $id = $this->generateUniqueId();
            $query = "INSERT INTO users (
                user_id,
                user_name,
                user_email,
                user_img,
                user_password)
            VALUES (:user_id, :user_name, :user_email, :user_img, :user_password)";

            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'user_id' => $id,
                'user_name' => $user_name,
                'user_email' => $user_email,
                'user_img' => $user_img,
                'user_password' => $user_password
            ]);

            return $id;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function updateUser($user_id, $user_name, $user_email, $user_img, $user_password)
    {
        try {
            $query = "UPDATE users
                  SET user_name = :user_name, user_email = :user_email, user_img = :user_img, user_password = :user_password
                  WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'user_name' => $user_name,
                'user_email' => $user_email,
                'user_img' => $user_img,
                'user_password' => $user_password,
                'user_id' => $user_id
            ]);
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function deleteUser($user_id)
    {
        try {
            $query = "DELETE FROM users WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['user_id' => $user_id]);
            return $stmt->rowCount();
        } catch (PDOException $err) {
            throw $err;
        }
    }
}
