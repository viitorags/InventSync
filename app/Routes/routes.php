<?php

require_once __DIR__ . "/../Controllers/userController.php";
require_once __DIR__ . "/../Controllers/productController.php";
require_once __DIR__ . "/../Controllers/clientController.php";
require_once __DIR__ . "/../Controllers/ordersController.php";

class Router
{
    private $routes = [];

    public function add($method, $path, $handler)
    {
        $this->routes[$method][$path] = $handler;
    }

    public function dispatch($method, $path)
    {
        if (isset($this->routes[$method][$path])) {
            call_user_func($this->routes[$method][$path]);
        } else {
            http_response_code(404);
        }
    }
}

$router = new Router();

// FrontEnd EndPoints
$router->add('GET', '/', function () {
    include __DIR__ . "/../Views/index.php";
});
$router->add('GET', '/register', function () {
    include __DIR__ . "/../Views/signup.php";
});
$router->add('GET', '/dashboard', function () {
    include __DIR__ . "/../Views/dashboard.php";
});
$router->add('GET', '/stock', function () {
    include __DIR__ . "/../Views/stock.php";
});
$router->add('GET', '/orders', function () {
    include __DIR__ . "/../Views/orders.php";
});
$router->add('GET', '/customer', function () {
    include __DIR__ . "/../Views/customer.php";
});
$router->add('GET', '/configurations', function () {
    include __DIR__ . '/../Views/configurations.php';
});

// APIs EndPoints
$router->add('GET', '/api/produtos', function () {
    $controller = new ProductController();
    $controller->getAllProducts();
});

$router->add('POST', '/api/produtos', function () {
    $controller = new ProductController();
    $controller->createNewProduct();
});

$router->add('PUT', '/api/produtos', function () {
    $controller = new ProductController();
    $controller->updateProduct();
});

$router->add('DELETE', '/api/produtos', function () {
    $controller = new ProductController();
    $controller->deleteProduct();
});

// User API endpoints
$router->add('POST', '/api/login', function () {
    $controller =  new UserController();
    $controller->loginUser();
});

$router->add('POST', '/api/logout', function () {
    $controller = new UserController();
    $controller->logoutUser();
});

$router->add('GET', '/api/users', function () {
    $controller = new UserController();
    $controller->getUser();
});

$router->add('POST', '/api/users', function () {
    $controller = new UserController();
    $controller->createUser();
});

$router->add('PUT', '/api/users', function () {
    $controller = new UserController();
    $controller->updateUser();
});

$router->add('DELETE', '/api/users', function () {
    $controller = new UserController();
    $controller->deleteUser();
});

// Client API endpoints
$router->add('GET', '/api/clients', function () {
    $controller = new ClientController();
    $controller->getClient();
});

$router->add('POST', '/api/clients', function () {
    $controller = new ClientController();
    $controller->createNewClient();
});

$router->add('PUT', '/api/clients', function () {
    $controller = new ClientController();
    $controller->updateClient();
});

$router->add('DELETE', '/api/clients', function () {
    $controller = new ClientController();
    $controller->deleteClient();
});

// Order API endpoints
$router->add('GET', '/api/orders', function () {
    $controller = new OrdersController();
    $controller->getOrders();
});

$router->add('POST', '/api/orders', function () {
    $controller = new OrdersController();
    $controller->createNewOrder();
});

$router->add('PUT', '/api/orders', function () {
    $controller = new OrdersController();
    $controller->updateOrder();
});

$router->add('DELETE', '/api/orders', function () {
    $controller = new OrdersController();
    $controller->deleteOrder();
});
