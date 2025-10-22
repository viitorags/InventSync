<?php

class UserModel
{
    private $db;

    public function __construct($dbConn)
    {
        $this->db = $dbConn;
    }

    public function generateUniqueId()
    {
        do {
            $id = random_int(100000, 999999);
            $stmt = $this->db->prepare("SELECT id FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);

            $exists = $stmt->fetch();
        } while ($exists);

        return $id;
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
        } catch (PDOException $err) {
            echo "Erro ao criar usuário " . $err->getMessage();
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
            echo "Erro ao atualizar usuário: " . $err->getMessage();
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
            echo "Erro ao deletar usuário: " . $err->getMessage();
        }
    }
}
