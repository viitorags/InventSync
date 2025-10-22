<?php
require __DIR__ . "/../Models/clientModel.php";

class ClientController
{
    private $clientModel;

    public function __construct()
    {
        $this->clientModel = new ClientModel();
    }

    public function getClient()
    {
        header('Content-Type: application/json');

        $this->clientModel->getClient();

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function createNewClient()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $client_name = $data['client_name'] ?? '';
        $client_number = $data['client_number'] ?? '';
        $user_id = $_SESSION['user_id'] ?? '';

        $this->clientModel->createNewClient($client_name, $client_number, $user_id);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function updateClient()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $client_id = $data['client_id'] ?? '';
        $client_name = $data['client_name'] ?? '';
        $client_number = $data['client_number'] ?? '';

        $this->clientModel->updateClient($client_id, $client_name, $client_number);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function deleteClient()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $client_id = $data['client_id'];

        header('Content-Type: application/json');

        $this->clientModel->deleteClient($client_id);

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }
}
