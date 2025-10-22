<?php

require __DIR__ . "/../Config/Database.php";

class ClientModel
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConn();
    }

    public function getClient()
    {
        try {
            $query = "SELECT * FROM clients";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $err) {
            echo "Erro ao obter clientes " . $err->getMessage();
            return false;
        }
    }

    public function createNewClient($client_name, $client_number, $user_id)
    {
        try {
            $query = "
                INSERT INTO clients (client_name, client_number, user_id)
                VALUES (:client_name, :client_number, :user_id)
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['client_name' => $client_name, 'client_number' => $client_number, 'user_id' => $user_id]);
            return $stmt->rowCount();
        } catch (PDOException $err) {
            echo "Erro ao criar cliente " . $err->getMessage();
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
            echo "Erro ao atualizar cliente " . $err->getMessage();
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
            echo "Erro ao deletar cliente " . $err->getMessage();
        }
    }
}
