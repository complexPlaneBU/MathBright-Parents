<?php

//define('DEFAULT_CONTROLLER', 'HomeController');
define('DEFAULT_CONTROLLER', 'Home');
define('DEFAULT_ACTION', 'index');
define('DEFAULT_METHOD', 'indexAction');


// Include configuration settings
if (file_exists('src/config.php')) {
    require_once 'src/config.php';
} else {
    echo "<br>Error: Configuration file, 'src/config.php', not found!";
}

// Get URL parameters (excluding controller and action)
$params = $_GET;
unset($params['controller']);
unset($params['action']);


//-=========================================
// index.php

// Determine which controller and action to load
$controllerName = filter_input(INPUT_GET, 'controller', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? DEFAULT_CONTROLLER;
$action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? DEFAULT_ACTION;

$controllerName = $controllerName . 'Controller';

// Also check the request body for controller and action
$requestBody = json_decode(file_get_contents('php://input'), true);
if ($requestBody) {
    $controllerName = $requestBody['controller'] ?? $controllerName;
    $action = $requestBody['action'] ?? $action;
}

// Include the controller class file
//$controllerFile = './src/controllers/' . $controllerName . '.php';
$controllerFile = './src/controllers/' . $controllerName . '.php';


if (file_exists($controllerFile)) {
    require_once $controllerFile;

    // Instantiate the controller class
    if (class_exists($controllerName)) {
        $controller = new $controllerName();

        // Call the method based on the action (or use a default method)
        $methodName = $action . 'Action';

        // Check if the action exists in the controller
        if (method_exists($controller, $methodName)) {
            // If no params are passed, $params will be an empty array
            $params = isset($params) ? array_values($params) : [];

            // Call the method, pass parameters if they exist
            $ret = $controller->{$methodName}(...$params);

            // Output the result
            echo $ret;
        } else {
            echo "Action $action not found in $controllerName";
        }
    } else {
        echo "Controller class $controllerName not found";
    }
} else {
    echo "Controller file $controllerFile not found";
}
