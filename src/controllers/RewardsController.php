<?php
require_once 'BaseController.php';
require_once './src/services/EmailService.php';



class RewardsController extends BaseController {
    public function __construct() {
        parent::__construct('learner_dashboard_view');
    }

    public function sayHelloAction() {
        return "Hello World from LoginController!";
    }

    
    public function getRewardCardsAction() {      
        $model = $this->model('RewardsModel');
        $availableRewards = $model->getRewardCards();

        if ($availableRewards) {
            // Return the JSON response
            echo json_encode($availableRewards);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['error' => "No rewards found"]);
        }
    }

    public function GetAvailableRewardsForUserAction() {

        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) ) {
            echo json_encode(['success' => false, 'error' => 'Username is required.']);
            return;
        }

        // Check if the user is authenticated
        $model = $this->model('LoginModel');
        $isAuthenticated = $model->isAuthenticated($username);

        if (!$isAuthenticated['loggedIn']) {
            echo json_encode([
                'success' => false,
                'error' => 'user not logged in',
                'loggedInData' => $isAuthenticated 
            ]);
            exit;
        }



        $model = $this->model('RewardsModel');
        $availableBonusRewards = $model->GetAvailableRewardsForUser($username);
        
        $availableParentRewards = $model->GetAvailableParentRewardsForUser($username);

        $response = [
            'availableBonusRewards' => $availableBonusRewards,
            'availableParentRewards' => $availableParentRewards
        ];

        if (empty($availableBonusRewards) && empty($availableParentRewards)) {
            $response['error'] = "No rewards found for user ID: $username.";
        }

        echo json_encode($response);
    }

    public function GetLoggedInUserInfo() {
        $username = htmlspecialchars(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        if (empty($username)) {
            // Return a JSON error response
            echo json_encode(['error' => 'Username is required.']);
            return;
        }

        $model = $this->model('WeeklyStatsModel');
        $weeklyStats = $model->getWeeklyStats($username, (int) '1724659200');    // Ensure '1722240000' is passed as an integer

        if ($weeklyStats) {
            // Return the JSON response
            echo json_encode($weeklyStats);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['error' => "No data found for user: $username."]);
        }
    }    

    public function UpdateRewardBonusAction_old() {
        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $logId = isset($data['logId']) ? (int) $data['logId'] : null;
        $rewardId = isset($data['rewardId']) ? (int) $data['rewardId'] : null;
        $status = isset($data['status']) ? htmlspecialchars(filter_var($data['status'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) || empty($logId) || empty($rewardId) || empty($status)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required.']);
            return;
        }

        $model = $this->model('RewardsModel');
        $updateRewardBonus = $model->updateRewardBonus($username, $logId, $rewardId, $status);

        if ($updateRewardBonus) {
            // Return the JSON response
            echo json_encode($updateRewardBonus);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['error' => "Failed to update reward bonus."]);
        }
    }


    public function sendRewardEmailBasedOnTemplate($templateName, $logId, $rewardId, $userInfo, $token=null) {
        $username = ''; // Initialize $username as an empty string

        $model = $this->model('AdminModel');

        if (isset($userInfo['username'])) {
            $parentEmails = $model->getParentEmails($userInfo['username']);
        } elseif (isset($userInfo['user_id'])) {
            $parentEmails = $model->getParentEmailsByUserID($userInfo['user_id']);
            $username = $model->getUserNamedFromUserID($userInfo['user_id']);
        } else {
            // Handle the case where neither $username nor $user_id is provided
            echo "Error: Either username or user_id must be provided.";
            return;
        }

        // Get reward description
        $model = $this->model('RewardsModel');
        $rewardDescription = $model->getBonusRewardInfo($rewardId);
        

        // Get Learner's first name
        $model = $this->model('AdminModel');
        //$userFirstName = $model->getUserInfo($username)['first_name'];

        $userInfo = $model->getUserInfo($username);
        if (isset($userInfo['first_name'])) {
            $userFirstName = $userInfo['first_name'];
        } else {
            // Handle the case where 'first_name' is not present in the array
            $userFirstName = "Learner";
        }

        // read email template and fill in parameters
        ob_start();
        include $templateName;
        $emailTemplate = ob_get_clean();

        $emailBody = str_replace(
            ['{{userFirstName}}', '{{bonusRewardName}}', '{{rewardDescription}}', '{{id}}', '{{token}}'],
            [$userFirstName, $rewardDescription['bonus_reward_name'], $rewardDescription['bonus_reward_description'], $logId, $token],
            $emailTemplate
        );

        // get read to send the email
        $emailService = new EmailService();


        $templateMap = [
            'bonus_reward_email_selection_confirmation.php' => 'template1',
            'bonus_reward_email_selection_confirmed.php' => 'template2',
            'bonus_reward_email_selection_pick_new_item.php' => 'template3',
        ];

        $templateNameIndex = basename($templateName); // remove directory path
        $templateKey = $templateMap[$templateNameIndex];


        $emailContent = json_decode(file_get_contents('./src/config/emailSubjectLines.json'));
        $subjectTemplate = $emailContent->$templateKey->subject;
        $subject = str_replace('{{userFirstName}}', $userFirstName, $subjectTemplate);

        // Send email to all parent emails found
        $emailResults = []; // Initialize an array to store email results
        foreach ($parentEmails['data'] as $email) {
            $emailSent = $emailService->sendEmail($email, '', '', $subject, $emailBody, $emailBody);
            $emailResults[] = $emailSent; // Store the result in the array
            if (!$emailSent) {
                echo json_encode([
                    'success' => false, 
                    'error' => 'Failed to send email to ' . $email . '. Details: ' . 
                        'Subject=' . $subject . 
                        ', EmailBody=' . $emailBody . 
                        ', EmailService=' . get_class($emailService)
                ]);
            }
        }

        return $emailResults; // Return the array of email results
    }



    public function writeBonusRewardDataToDatabaseAction() {
        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $logId = isset($data['logId']) ? (int) $data['logId'] : null;
        $rewardId = isset($data['rewardId']) ? (int) $data['rewardId'] : null;
        $status = isset($data['status']) ? htmlspecialchars(filter_var($data['status'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) || empty($logId) || empty($rewardId) || empty($status)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required.']);
            return;  //BUNOTE: Get rid of this
        }

        //$token = bin2hex(random_bytes(16));
        // use a default value for token
        $token = "DEADBEEF";

        // the email sending function will create and write the token
        $model = $this->model('RewardsModel');
        $writeRewardData = $model->writeRewardDataToDatabase($username, $logId, $rewardId, $token, $status);

        if ($writeRewardData) {
            echo json_encode(['success' => true, 'message' => 'Database updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update database.']);
        }
    }

    public function writeParentRewardDataToDatabaseAction() {
        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $logId = isset($data['logId']) ? (int) $data['logId'] : null;
        $rewardId = isset($data['rewardId']) ? (int) $data['rewardId'] : null;
        $status = isset($data['status']) ? htmlspecialchars(filter_var($data['status'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) || empty($logId) || empty($rewardId) || empty($status)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required.']);
            return;  //BUNOTE: Get rid of this
        }

        /*
         echo json_encode([
                'success' => true,
                'message' => 'Database updated successfully.',
                'debug' => [
                    'username' => $username,
                    'logId' => $logId,
                    'rewardId' => $rewardId,
                    'status' => $status,
                    'writeRewardData' => $writeRewardData // if applicable
                ]
            ]);
            exit; // for debug
            */

        //$token = bin2hex(random_bytes(16));
        // use a default value for token
        $token = "DEADBEEFPARENT";

        // the email sending function will create and write the token
        $model = $this->model('RewardsModel');
        //$writeRewardData = $model->writeRewardDataToDatabase($username, $logId, $rewardId, $token, $status);
        $writeRewardData = $model->writeRewardParentDataToDatabase($username, $logId, $rewardId, $token, $status);

        if ($writeRewardData) {
            echo json_encode(['success' => true, 'message' => 'Database updated successfully.', 'debug' => $writeRewardData]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update database.', 'debug' => $writeRewardData]);
        }
    }

    public function sendBonusRewardSelectionConfirmationEmailAction() {
        
        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $logId = isset($data['logId']) ? (int) $data['logId'] : null;
        $rewardId = isset($data['rewardId']) ? (int) $data['rewardId'] : null;
        $status = isset($data['status']) ? htmlspecialchars(filter_var($data['status'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) || empty($logId) || empty($rewardId) || empty($status)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required.']);
            return;  //BUNOTE: Get rid of this
        }

        $token = bin2hex(random_bytes(16));

        $userInfo = null;
        $userInfo['username'] = $username;
            // attempt to send email template for processing and  sending
        $templateName = './src/templates/bonus_reward_email_selection_confirmation.php';
        $emailResults = $this->sendRewardEmailBasedOnTemplate($templateName, $logId, $rewardId, $userInfo, $token);

        // Check if all emails were sent successfully
        $allEmailsSent = !in_array(false, $emailResults);

        // Log the result in the database
        $model = $this->model('AdminModel');
        $sendStatus = $allEmailsSent ? 'sent' : 'failed';
        $errorMessage = $allEmailsSent ? null : 'Failed to send email'; // You might want to capture detailed error

        $model->logEmail($username, $logId, $rewardId, 'bonus_reward_confirmation', $sendStatus, $errorMessage);

        if ($allEmailsSent) {
            // If all emails sent successfully, update database to provide token
            $model = $this->model('RewardsModel');
            $updateTokenResult = $model->updateToken($logId, $token, $status);

            if ($updateTokenResult['success']) {
                echo json_encode(['success' => true, 
                                  'message' => 'Email sent and data written successfully.', 
                                  'data' => [
                                             'templateName' => $templateName, 
                                             'logId' => $logId, 
                                             'rewardId' => $rewardId, 
                                             'userInfo' => $userInfo, 
                                             'token' => $token,
                                             'writeRewardData' => $updateTokenResult
                                            ]
                                 ]);            
            } else {
                echo json_encode(['success' => false, 'error' => 'Email sent but failed to write data to database.', 'data' => $updateTokenResult]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to send email.', 'data' => $emailResults]);
        }
    }



    // send email confirmation to parents and change status to "claim" in bonus reward log
    public function SendEmailConfAndLogBonusRewardAction() { //old
        
        $data = json_decode(file_get_contents('php://input'), true);

        $username = isset($data['username']) ? htmlspecialchars(filter_var($data['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;
        $logId = isset($data['logId']) ? (int) $data['logId'] : null;
        $rewardId = isset($data['rewardId']) ? (int) $data['rewardId'] : null;
        $status = isset($data['status']) ? htmlspecialchars(filter_var($data['status'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (empty($username) || empty($logId) || empty($rewardId) || empty($status)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required.']);
            return;  //BUNOTE: Get rid of this
        }

        $token = bin2hex(random_bytes(16));

        $userInfo = null;
        $userInfo['username'] = $username;
        // send email template for processing and  sending
        $templateName = './src/templates/bonus_reward_email_selection_confirmation.php';
        $emailSent = $this->sendRewardEmailBasedOnTemplate($templateName, $logId, $rewardId, $userInfo, $token);
        echo json_encode(['success' => true, 'emailSent' => $emailSent]);
        return;

        //echo json_encode(['success' => true, 'data' => "email sent... stopping here in DEBUG Mode"]);     
        //return;

        // If all emails sent successfully, write data to database
        $model = $this->model('RewardsModel');
        $writeRewardData = $model->writeRewardDataToDatabase($username, $logId, $rewardId, $token, $status);

        if ($writeRewardData) {
            echo json_encode(['success' => true, 'message' => 'Emails sent and data written successfully.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to write data to database.']);
        }
        
    }


    // Action for confirming or rejecting a reward
    public function confirmRewardAction() {
        // Retrieve query parameters
        $logId = isset($_GET['id']) ? (int) $_GET['id'] : null;
        $token = isset($_GET['token']) ? htmlspecialchars($_GET['token'], ENT_QUOTES, 'UTF-8') : null;
        $confirm = isset($_GET['confirm']) ? htmlspecialchars($_GET['confirm'], ENT_QUOTES, 'UTF-8') : null;

        // Validate parameters
        if ($logId === null || $token === null || ($confirm !== 'yes' && $confirm !== 'no')) {
            echo "Invalid request.";
            return;
        }

        // Load the model
        $model = $this->model('RewardsModel');

        // Process the confirmation
        if ($confirm === 'yes') {
            $templateName = './src/templates/bonus_reward_email_selection_confirmed.php';
            $result = $model->confirmReward($logId, $token, $confirm);
            $user_id = $result['reward_data']['user_id'];
            $rewardId = $result['reward_data']['reward_id'];

            if ($result) {
                // send email to parent                
                echo json_encode(['success' => true, 'userid' => $result]);
            } else {
                echo json_encode(['success' => false, 'data' => $result]);
            }
        } else if ($confirm === 'no') {
            $result = $model->rejectReward($id, $token);
            if ($result) {
                echo "Reward rejected.";
$templateName = './src/templates/bonus_reward_email_selection_pick_new_item.php';
$result = $model->confirmReward($logId, $token, $confirm);
$user_id = $result['reward_data']['user_id'];
$rewardId = $result['reward_data']['reward_id'];
                // Optionally redirect or provide further instructions
            } else {
                echo "Failed to reject reward.";
            }
        }


        $userInfo = null;
        $userInfo['user_id'] = $user_id;
        $this->sendRewardEmailBasedOnTemplate($templateName, $logId, $rewardId, $userInfo, $token=null);


        
    }


    //end
}
?>
