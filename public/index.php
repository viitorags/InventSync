<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0);
ini_set('session.cookie_samesite', 'Lax');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../app/Routes/routes.php';
require_once __DIR__ . '/../app/Config/TablesInitializer.php';

define('ROOT_PATH', __DIR__);

try {
    $initializer = new TablesInitializer();
    $initializer->initializeTables();
} catch (Exception $e) {
    error_log("Erro ao inicializar tabelas: " . $e->getMessage());
}

$method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$router->dispatch($method, $path);
