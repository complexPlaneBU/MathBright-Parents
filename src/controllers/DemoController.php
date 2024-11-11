<?php
require_once 'BaseController.php';

// src/controllers/DemoController.php

class DemoController extends BaseController {
    public function __construct() {
        parent::__construct('test_view');
    }

    public function demoAction() {
        $model = $this->model('TestModel');
        $data = $model->getData();
        $this->loadView('test_view', $data);
    }
}
?>
