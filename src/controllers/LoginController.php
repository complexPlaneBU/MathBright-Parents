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



    public function verifyOTPAction() {
        // Get the email and OTP from the POST request (assuming it's sent as JSON)
        $postData = json_decode(file_get_contents('php://input'), true);

        $requiredFields = ['email', 'otp'];
        foreach ($requiredFields as $field) {
            if (empty($postData[$field])) {
                echo json_encode(['success' => false, 'error' => ucfirst($field) . ' is required']);
                return;
            }
        }

        // Get the email and OTP from the POST data
        $email = $postData['email'];
        $otp = $postData['otp'];

        // Call the model's verifyOTP method to verify the OTP
        $model = $this->model('LoginModel');
        $response = $model->verifyOTP($email, $otp);

        // Check if the response from the model is successful
        if ($response && isset($response['success']) && $response['success'] === true) {
            // Return a success response
            echo json_encode(['success' => true, 'message' => 'OTP verified successfully']);
        } else {
            // Return an error response with error message
            echo json_encode(['success' => false, 'error' => $response['error'] ?? 'Failed to verify OTP']);
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
