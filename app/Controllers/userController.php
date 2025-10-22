<?php
require __DIR__ . "/../Models/userModel.php";

class UserController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function getUser()
    {
        $user_id = $_SESSION['user_id'];

        header('Content-Type: application/json');

        $this->userModel->getUser($user_id);

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function createUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $user_name = $data['user_name'] ?? '';
        $user_email = $data['user_email'] ?? '';
        $user_img = $data['user_img'] ?? '';
        $user_password = $data['user_password'] ?? '';
        $passwordHash = password_hash($user_password, PASSWORD_ARGON2ID);


        $this->userModel->createUser($user_name, $user_email, $user_img, $passwordHash);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function updateUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $user_id = $_SESSION['user_id'];
        $user_name = $data['user_name'] ?? '';
        $user_email = $data['user_email'] ?? '';
        $user_img = $data['user_img'] ?? '';
        $user_password = $data['user_password'] ?? '';
        $passwordHash = password_hash($user_password, PASSWORD_ARGON2ID);


        $this->userModel->updateUser($user_id, $user_name, $user_email, $user_img, $passwordHash);

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }

    public function deleteUser()
    {
        $user_id = $_SESSION['user_id'];

        header('Content-Type: application/json');

        $this->userModel->deleteUser($user_id);

        echo json_encode(['success' => true]);
        http_response_code('success' ? 201 : 500);
    }
}
