<?php

require_once __DIR__ . "/../Config/Database.php";

class ClientModel
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
            $stmt = $this->db->prepare("SELECT client_id FROM clients WHERE client_id = :id");
            $stmt->execute(['id' => $id]);

            $exists = $stmt->fetch();
        } while ($exists);

        return $id;
    }


    public function getClient($user_id)
    {
        try {
            $query = "SELECT * FROM clients WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['user_id' => $user_id]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $err) {
            throw $err;
            return false;
        }
    }

    public function createNewClient($client_name, $client_number, $user_id)
    {
        try {
            $id = $this->generateUniqueId();
            $query = "
                INSERT INTO clients (client_id, client_name, client_number, user_id)
                VALUES (:client_id, :client_name, :client_number, :user_id)
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'client_id' => $id,
                'client_name' => $client_name,
                'client_number' => $client_number,
                'user_id' => $user_id
            ]);
            return $id;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function updateClient($client_id, $client_name, $client_number)
    {
        try {
            $query = "
                UPDATE clients
                SET client_name = :client_name,
                    client_number = :client_number
                WHERE client_id = :client_id
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['client_name' => $client_name, 'client_number' => $client_number, 'client_id' => $client_id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $err) {
            throw $err;
        }
    }

    public function deleteClient($client_id)
    {
        try {
            $query = "DELETE FROM clients WHERE client_id = :client_id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['client_id' => $client_id]);
            return $stmt->rowCount();
        } catch (PDOException $err) {
            throw $err;
        }
    }
}
