<?php
// Debug switch only for development.  set to 'false' for production.

require_once 'BaseController.php';

class HomeController extends BaseController {
    private $simulate_logged_in_user = false;

    public function __construct() {
        parent::__construct('parent_dashboard_view');

    }

    public function indexAction() {
         {
            // Default index action
            // =====================
            $viewModel = new stdClass();

            // return username if someone is logged in
            $model = $this->model('LoginModel');
            $isAuthenticated = $model->isAuthenticated();
            $viewModel->username = null; // default assignment


            //Password1
            $verbose = 2;
            $viewModel->verbose = $verbose;

            if (isset( $_GET['verbose']) ) {
                $viewModel->verbose = $_GET['verbose'];
            }

            
            //if ($isAuthenticated['userData']['username'] == "debug") {
            if ($isAuthenticated && isset($isAuthenticated['userData']['username']) && $isAuthenticated['userData']['username'] == "debug") {
                echo json_encode([
                    'success' => true,
                    'data' => 'in HomeController',
                    'debug' => $isAuthenticated ,
                    'verbose' => $verbose
                ]); 
            }

            // for development testing
            if ($this->simulate_logged_in_user) {
                $isAuthenticated['loggedIn'] = true;
                $isAuthenticated['userData']['username'] = true;
                $isAuthenticated['userData']['user_id'] = true;
            }

            if ($isAuthenticated && isset($isAuthenticated['loggedIn']) && $isAuthenticated['loggedIn']) { // logged in
                $viewModel->loggedIn = true;
                $viewModel->username = $isAuthenticated['userData']['username'];
                $viewModel->user_id = $isAuthenticated['userData']['user_id'];
                $data = ['error' => 'Default index action executed. No specific action requested.'];
                $this->loadView('parent_dashboard_view', $viewModel);
            } else { // not logged in
                $viewModel->loggedIn = false;
                $data = ['error' => 'Default index action executed. No specific action requested.'];
                $viewModel->state = "login";
                $this->loadView('signup_view', $viewModel);
            }

        }
    }



    // OTP Verify action (with an optional parameter)
    public function signupAction($state = 'signup') {
        $viewModel = new stdClass();

        $viewModel->state = $state;

        // Handle the case where 'state' is missing
        if ($state === null) {
            $response = [
                'success' => false,
                'data' => 'in HomeController: Signup Action',
                'debug' => "No state provided."
            ];
            echo json_encode($response);
        } else {
            $response = [
                'success' => true,
                'data' => 'in HomeController: Signup Action',
                'debug' => $state
            ];
            echo json_encode($response);
        }

        $this->loadView('signup_view', $viewModel);
    }
    

    public function verifyEmailAction($token = 'none') {
        $viewModel = new stdClass();
        
        $viewModel->token = $token;

        if ($token === null) {
            $response = [
                'success' => false,
                'data' => 'in HomeController: Signup Action',
                'debug' => "No state provided."
            ];
            echo json_encode($response);
        } else {
            $response = [
                'success' => true,
                'data' => 'in HomeController: Signup Action',
                'token' => $token
            ];
            echo json_encode($response);
        }

        $this->loadView('verifyEmail_view', $viewModel);
    }


    public function routeAction($confirm, $id, $token) {
        // Validate and sanitize inputs
        $confirm = htmlspecialchars($confirm, ENT_QUOTES, 'UTF-8');
        $id = (int)$id;
        $token = htmlspecialchars($token, ENT_QUOTES, 'UTF-8');

        // Construct the cleaner URL
        $url = "index.php?controller=RewardsController&action=ConfirmReward&confirm={$confirm}&id={$id}&token={$token}";

        // Redirect to the RewardsController action
        header("Location: $url");
        exit();
    }


    public function sendEmailConfirmationAction() {
        // Example usage: Generate a cleaner URL for email links
        $confirm = 'yes';
        $id = 6;
        $token = '663adf05e82b8f8ea84e983960313cf1';

        // Call the redirect method
        $this->redirectToRewards($confirm, $id, $token);
    }

    // You can define other methods as needed
}

//end
?>
