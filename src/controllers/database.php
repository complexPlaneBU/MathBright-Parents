<?php
// src/config/Database.php

class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $dsn = 'mysql:host=localhost;dbname=mathbright;charset=utf8';
            $username = getenv('MB_MYSQL_USER');
            $password = getenv('MB_MYSQL_PASSWORD');
            try {
                self::$pdo = new PDO($dsn, $username, $password);
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die('Database connection failed: ' . $e->getMessage());
            }
        }
        return self::$pdo;
    }
}

?>
