<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'BaseController.php';



class LoginController extends BaseController {
    public function __construct() {
        parent::__construct('learner_dashboard_view');
    }

    public function sayHelloAction() {
        return "Hello World from LoginController!";
    }

    

    public function saveEmailAction() {
        // Get the email from the POST request (assuming it's sent as JSON)
        $postData = json_decode(file_get_contents('php://input'), true);
    
        // Check if email is provided
        if (empty($postData['email'])) {
            echo json_encode(['success' => false, 'error' => 'Email is required']);
            return;
        }

        // Get the email from the POST data
        $email = $postData['email'];

        // Call the model's saveEmail method to store the email in the database
        $model = $this->model('LoginModel');
        $response = $model->saveEmail($email);

        // Check if the response from the model is successful
        if ($response && isset($response['success']) && $response['success'] === true) {
            // Return a success response
            echo json_encode(['success' => true, 'message' => 'Email saved successfully']);
        } else {
            // Return an error response
            echo json_encode(['success' => false, 'error' => 'Failed to save email']);
        }
    }


    public function loginAction() {

        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $password = isset($data['password']) ? $data['password'] : null;

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Username and password are required.']);
            return;
        }

        $model = $this->model('LoginModel');
        $response = $model->login($username, $password);

        if ($response === null) {
            // Return a JSON error response if the model returns null
            echo json_encode(['success' => false, 'error' => 'An unknown error occurred. Response is null.']);
            return;
        }

        if (!is_array($response)) {
            // Return a JSON error response if the model returns a non-array value
            echo json_encode(['success' => false, 'error' => 'Invalid response from the model. not an array.']);
            return;
        }

        //CBUNOTE - remove the session variable passsing.  it exposer the userid
        if (isset($response['success'])) {
            // Return the JSON response
            echo json_encode(['response' => $response, 'session' => var_export($_SESSION, true)]);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['success' => false, 'error' => 'An unknown error occurred.', 'session' => var_export($_SESSION, true)]);
        }
    }


    public function isAuthenticatedAction() {
        $model = $this->model('LoginModel');
        $response = $model->isAuthenticated();

        if ($response === null) {
            // Return a JSON error response if the model returns null
            echo json_encode(['success' => false, 'error' => 'An unknown error occurred. Response is null.']);
            return;
        }

        if (!is_array($response)) {
            // Return a JSON error response if the model returns a non-array value
            echo json_encode(['success' => false, 'error' => 'Invalid response from the model. Not an array.']);
            return;
        }

        // Return the JSON response
        echo json_encode(['response' => $response]);
    }


    public function logoutAction() {
        $model = $this->model('LoginModel');
        $response = $model->logout();

        if ($response === null) {
            // Return a JSON error response if the model returns null
            echo json_encode(['success' => false, 'error' => 'An unknown error occurred. Response is null.']);
            return;
        }

        if (!is_array($response)) {
            // Return a JSON error response if the model returns a non-array value
            echo json_encode(['success' => false, 'error' => 'Invalid response from the model. Not an array.']);
            return;
        }

        // Return the JSON response and redirect (client-side)
        echo json_encode(['success' => $response['success'], 'message' => $response['message']]);

        // Optional: Redirect to login page (server-side)
        // header('Location: login.php');
        // exit;
    }

}

/*
class AdminController {
    public function changePassword() { ... }
    public function manageUsers() { ... }
    public function viewLogs() { ... }
}

class ChangePasswordController { ... }
class UserManagementController { ... }
class LogViewController { ... }
*/
?>
