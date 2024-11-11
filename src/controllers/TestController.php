<?php
require_once 'BaseController.php';

// src/controllers/TestController.php

class TestController extends BaseController {
    public function __construct() {
        parent::__construct('test_view');
    }

    public function testAction() {
        $model = $this->model('TestModel');
        $data = $model->getData();
        $this->loadView('test_view', $data);
    }
}
?>
