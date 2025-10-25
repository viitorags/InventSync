<?php

require_once __DIR__ . '/../Models/clientModel.php';

class ClientController
{
    private $clientModel;

    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $this->clientModel = new ClientModel();
    }

    public function getClient()
    {
        try {
            if (!isset($_SESSION["user_id"])) {
                header('Content-Type: application/json');
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
                return;
            }

            $user_id = $_SESSION["user_id"];
            $clients = $this->clientModel->getClient($user_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $clients]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function createNewClient()
    {
        try {
            $client_name = $_POST['client_name'] ?? '';
            $client_number = $_POST['client_number'] ?? '';
            $user_id = $_SESSION['user_id'] ?? '';

            $clientId = $this->clientModel->createNewClient($client_name, $client_number, $user_id);

            header('Content-Type: application/json');
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Cliente criado com sucesso!',
                'data' => [
                    'client_id' => $clientId,
                    'client_name' => $client_name,
                    'client_number' => $client_number
                ]
            ]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function updateClient()
    {
        parse_str(file_get_contents("php://input"), $_PUT);

        $client_id = $_PUT['client_id'] ?? '';
        $client_name = $_PUT['client_name'] ?? '';
        $client_number = $_PUT['client_number'] ?? '';

        $success = $this->clientModel->updateClient($client_id, $client_name, $client_number);

        try {
            if ($success) {
                header('Content-Type: application/json');
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Update successful']);
            } else {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Failed to update client.']);
            }
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function deleteClient()
    {
        try {
            parse_str(file_get_contents("php://input"), $_DELETE);
            $client_id = $_DELETE['client_id'] ?? '';

            if (empty($client_id)) {
                header('Content-Type: application/json');
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID do cliente não fornecido']);
                return;
            }

            $this->clientModel->deleteClient($client_id);

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Cliente removido com sucesso!']);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }
}
