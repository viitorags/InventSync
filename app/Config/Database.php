<?php

class Database
{
    private static $conn = null;

    private function __construct() {}

    public static function getConn()
    {
        if (self::$conn === null) {
            $dbHost = getenv("DB_HOST");
            $dbPort = getenv("DB_PORT") ?: 3306;
            $dbName = getenv("DB_NAME");
            $dbUser = getenv("DB_USER");
            $dbPass = getenv("DB_PASS");

            $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$conn = new PDO($dsn, $dbUser, $dbPass, $options);
            } catch (\PDOException $e) {
                throw new \PDOException($e->getMessage(), (int)$e->getCode());
            }
        }

        return self::$conn;
    }
}
