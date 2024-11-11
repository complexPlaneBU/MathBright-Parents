<?php
require_once 'database.php';

// controllers/BaseController.php

abstract class BaseController {
    protected $view;

    public function __construct($view) {
        $this->view = $view;
    }

    public function model($model) {
        require_once 'src/models/' . $model . '.php';
        $db = Database::getConnection();
        return new $model($db);
    }

    protected function loadView_orig($view, $data = []) {
        $viewFile = './src/views/' . $view . '.php';
        if (file_exists($viewFile)) {
            extract($data);
            require $viewFile;
        } else {
            echo "View not found: $viewFile";
        }
    }

    protected function loadView($view, $data) {
        $viewFile = './src/views/' . $view . '.php';
        if (file_exists($viewFile)) {
            if (is_array($data)) {
                extract($data);
            } elseif (is_object($data)) {
                foreach ($data as $key => $value) {
                    $$key = $value;
                }
            }
            require $viewFile;
        } else {
            echo "View not found: $viewFile";
        }
    }




    public function handleRequest() {
        // Implement logic to handle the request
    }

    public function index() {
        // Default index method
        return 'Default index method in BaseController';
    }
}

?>