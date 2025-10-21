<?php

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
