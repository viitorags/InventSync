<?php

require_once __DIR__ . '/../Models/userModel.php';

class UserController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function loginUser()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $user_email = $_POST['user_email'] ?? '';
        $user_password = $_POST['user_password'] ?? '';

        if (empty($user_email) || empty($user_password)) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Email and password are required']);
            http_response_code(400);
            return;
        }

        $user = $this->userModel->getUserByEmail($user_email);

        if (!$user || !password_verify($user_password, $user['user_password'])) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            http_response_code(401);
            return;
        }

        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_name'] = $user['user_name'];
        $_SESSION['user_email'] = $user['user_email'];

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'name' => $user['user_name'],
                'email' => $user['user_email']
            ]
        ]);
        http_response_code(200);
    }
    public function getUser()
    {
        $user_id = $_SESSION['user_id'];

        $userId = $this->userModel->getUser($user_id);

        try {
            header('Content-Type: application/json');
            http_response_code(201);
            echo json_encode(['success' => true, 'user_id' => $userId]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function createUser()
    {
        if (isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
            $this->updateUser();
            return;
        }

        $user_name = $_POST['user_name'] ?? '';
        $user_email = $_POST['user_email'] ?? '';
        $user_password = $_POST['user_password'] ?? '';
        $profileImg = $_FILES['user_img'] ?? null;
        $passwordHash = password_hash($user_password, PASSWORD_ARGON2ID);

        $profileImgPath = null;

        if ($profileImg && $profileImg['error'] === UPLOAD_ERR_OK) {
            $targetDir = ROOT_PATH . '/uploads/';
            if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

            $fileName = uniqid('profile_', true) . '-' . basename($profileImg['name']);
            $targetFile = $targetDir . $fileName;

            if (move_uploaded_file($profileImg['tmp_name'], $targetFile)) {
                $profileImgPath = 'uploads/' . $fileName;
            }
        }

        try {
            $user_id = $this->userModel->createUser($user_name, $user_email, $profileImgPath, $passwordHash);

            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $user_name;

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Create User Successfuly',
                'user' => [
                    'name' => $user_name,
                    'email' => $user_email,
                ]
            ]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function updateUser()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            header('Content-Type: application/json');
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Não autenticado']);
            return;
        }

        $user_id = $_SESSION['user_id'];

        $currentUser = $this->userModel->getUser($user_id);

        if (!$currentUser) {
            header('Content-Type: application/json');
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
            return;
        }

        $isPostMethod = $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT';

        if ($isPostMethod) {
            error_log("UpdateUser - Using POST method with _method=PUT");
            $user_name = $_POST['user_name'] ?? $currentUser['user_name'];
            $user_email = $_POST['user_email'] ?? $currentUser['user_email'];
            $user_password = $_POST['user_password'] ?? '';
            $profileImg = $_FILES['user_img'] ?? null;
        } else {
            error_log("UpdateUser - Using PUT method with multipart parsing");

            $_PUT = [];
            $_PUT_FILES = [];

            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

            error_log("UpdateUser - Content-Type: $contentType");

            if (strpos($contentType, 'multipart/form-data') !== false) {
                $raw_data = file_get_contents('php://input');
                $boundary = substr($raw_data, 0, strpos($raw_data, "\r\n"));

                error_log("UpdateUser - Parsing multipart data, boundary: $boundary");

                $parts = array_slice(explode($boundary, $raw_data), 1);

                error_log("UpdateUser - Found " . count($parts) . " parts");

                foreach ($parts as $part) {
                    if ($part == "--\r\n") break;

                    $part = ltrim($part, "\r\n");
                    if (empty($part)) continue;

                    list($raw_headers, $body) = explode("\r\n\r\n", $part, 2);
                    $body = substr($body, 0, strlen($body) - 2);

                    $raw_headers = explode("\r\n", $raw_headers);
                    $headers = [];
                    foreach ($raw_headers as $header) {
                        if (strpos($header, ':') !== false) {
                            list($name, $value) = explode(':', $header, 2);
                            $headers[strtolower($name)] = ltrim($value, ' ');
                        }
                    }

                    if (isset($headers['content-disposition'])) {
                        preg_match('/name="([^"]+)"(?:; filename="([^"]+)")?/', $headers['content-disposition'], $matches);
                        $field_name = $matches[1];
                        $file_name = $matches[2] ?? null;

                        if ($file_name) {
                            $tmp_name = tempnam(sys_get_temp_dir(), 'php');
                            file_put_contents($tmp_name, $body);

                            $_PUT_FILES[$field_name] = [
                                'name' => $file_name,
                                'type' => $headers['content-type'] ?? 'application/octet-stream',
                                'tmp_name' => $tmp_name,
                                'error' => UPLOAD_ERR_OK,
                                'size' => strlen($body)
                            ];

                            error_log("UpdateUser - Found file field: $field_name, filename: $file_name, size: " . strlen($body));
                        } else {
                            $_PUT[$field_name] = $body;
                            error_log("UpdateUser - Found text field: $field_name = " . substr($body, 0, 50));
                        }
                    }
                }
            } else {
                parse_str(file_get_contents("php://input"), $_PUT);
                error_log("UpdateUser - Parsed as URL encoded");
            }

            $user_name = $_PUT['user_name'] ?? $currentUser['user_name'];
            $user_email = $_PUT['user_email'] ?? $currentUser['user_email'];
            $user_password = $_PUT['user_password'] ?? '';
            $profileImg = $_PUT_FILES['user_img'] ?? null;
        }

        error_log("UpdateUser - Name: $user_name, Email: $user_email, HasPassword: " . (!empty($user_password) ? 'yes' : 'no'));

        $profileImgPath = $currentUser['user_img'];

        error_log("UpdateUser - Current image: $profileImgPath, New image: " . ($profileImg ? $profileImg['name'] : 'none'));

        if ($profileImg) {
            error_log("UpdateUser - Image details: size=" . $profileImg['size'] . ", error=" . $profileImg['error'] . ", tmp_name=" . $profileImg['tmp_name']);
        }

        if ($profileImg && $profileImg['error'] === UPLOAD_ERR_OK && $profileImg['size'] > 0) {
            $targetDir = ROOT_PATH . '/uploads/';
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
                error_log("UpdateUser - Created upload directory: $targetDir");
            }

            $fileName = uniqid('profile_', true) . '-' . basename($profileImg['name']);
            $targetFile = $targetDir . $fileName;

            error_log("UpdateUser - Attempting to move file from {$profileImg['tmp_name']} to $targetFile");

            if (move_uploaded_file($profileImg['tmp_name'], $targetFile)) {
                $profileImgPath = 'uploads/' . $fileName;
                error_log("UpdateUser - Image uploaded successfully: $profileImgPath");
            } else {
                error_log("UpdateUser - Failed to move uploaded file");
            }
        } else {
            error_log("UpdateUser - No valid image to upload");
        }

        $passwordHash = !empty($user_password) ? password_hash($user_password, PASSWORD_ARGON2ID) : $currentUser['user_password'];

        try {
            $this->userModel->updateUser($user_id, $user_name, $user_email, $profileImgPath, $passwordHash);

            $_SESSION['user_name'] = $user_name;
            $_SESSION['user_email'] = $user_email;

            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Usuário atualizado com sucesso!',
                'user' => [
                    'user_id' => $user_id,
                    'name' => $user_name,
                    'email' => $user_email,
                    'img' => $profileImgPath
                ]
            ]);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar: ' . $err->getMessage()]);
        }
    }

    public function deleteUser()
    {
        $user_id = $_SESSION['user_id'];

        $this->userModel->deleteUser($user_id);

        try {
            header('Content-Type: application/json');
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Delete User Successfuly']);
        } catch (PDOException $err) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $err->getMessage()]);
        }
    }

    public function logoutUser()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        session_destroy();

        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Logout successful']);
    }
}
