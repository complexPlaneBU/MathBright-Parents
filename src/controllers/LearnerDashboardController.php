<?php
require_once 'BaseController.php';
//require_once  'database.php';

// src/controllers/LearnerDashboardController.php

class LearnerDashboardController extends BaseController {
    public function __construct() {
        parent::__construct('learner_dashboard_view');
    }



    public function GetLastTwoWeeksStatsByUsernameAction() {
    $username = htmlspecialchars(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

    if (empty($username)) {
        // Return a JSON error response
        echo json_encode(['error' => 'Username is required.']);
        return;
    }

    $model = $this->model('WeeklyStatsModel');
    $lastTwoWeeksStats = $model->getLastTwoWeeksStatsByUsername($username);

    if ($lastTwoWeeksStats['success']) {
        // Return the JSON response
        echo json_encode($lastTwoWeeksStats);
    } else {
        // Return a JSON error response if no data is found
        echo json_encode([
        'error' => $lastTwoWeeksStats['error'],
        'timestamps' => $lastTwoWeeksStats['timestamps']
    ]);
    }
}


    public function GetWeeklyStatsByUsernameAction() {
        $username = htmlspecialchars(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

        if (empty($username)) {
            // Return a JSON error response
            echo json_encode(['error' => 'Username is required.']);
            return;
        }

        $model = $this->model('WeeklyStatsModel');
        $weeklyStats = $model->getWeeklyStatsByUsername($username);

        if ($weeklyStats) {
            // Return the JSON response
            echo json_encode($weeklyStats);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['error' => "No data found for user: $username."]);
        }
    }

    public function GetThisWeekStatsByUsernameAction() {
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

    public function GetWeeklyStatsForUsernameForSpecificWeekAction() {
        // Sanitize and validate input
        $username = htmlspecialchars(filter_input(INPUT_GET, 'username', FILTER_SANITIZE_STRING));
        $weekStartEpoch = filter_input(INPUT_GET, 'weekStartEpoch', FILTER_SANITIZE_NUMBER_INT);

        if (empty($username)) {
            // Return a JSON error response for missing username
            echo json_encode(['error' => 'Username is required.']);
            return;
        }
        if (empty($weekStartEpoch) || !is_numeric($weekStartEpoch)) {
            // Return a JSON error response for missing or invalid weekStartEpoch
            echo json_encode(['error' => 'Valid Week Start Epoch is required.']);
            return;
        }

        $model = $this->model('WeeklyStatsModel');
        $weeklyStats = $model->getWeeklyStats($username, (int)$weekStartEpoch); // Ensure weekStartEpoch is an integer

        if ($weeklyStats) {
            // Return the JSON response with weekly stats
            echo json_encode($weeklyStats);
        } else {
            // Return a JSON error response if no data is found
            echo json_encode(['error' => "No data found for user: $username."]);
        }
    }

    public function indexAction() {
        // Load the username section by default
        //echo json_encode(['error' => 'Default index action executed. No specific action requested.']);
        $data =  (['error' => 'Default index action executed. No specific action requested.']);
         $this->loadView('learner_dashboard_view', ['section' => 'username']);
    }


    public function learnerdashboardAction() {
        $model = $this->model('WeeklyStatsModel');
       // $data = $model->getWeeklyStatsByUser(100);
       // $this->loadView('learner_dashboard_view', $data);

    
        // Instantiate the WeeklyStatsModel with the database connection
 
        //$userid = filter_input(INPUT_GET, 'userid', FILTER_SANITIZE_STRING);
        $userId = $_GET['userid'] ?? null; // Get week_start_epoch from query parameters (or use $_POST for POST data)
        $weekStartEpoch = $_GET['week_start_epoch'] ?? null; // Get week_start_epoch from query parameters (or use $_POST for POST data)
        //$userId = getUserIDFromUsername($username); // You need to implement this function to get the userId from the username
        $weekStartEpoch = 1724054400;

        //echo "userId = " . $userId;
        //echo "weekStartEpoch = " . $weekStartEpoch;

        if ($userId && $weekStartEpoch) {
            $data = $model->getWeeklyStats($userId, $weekStartEpoch);
            $this->loadView('learner_dashboard_view', $data);
        } else {
            // Handle the case where user_id or week_start_epoch is missing
            // e.g., show an error message or redirect
            //echo "User ID or Week Start Epoch is missing.";
            $userId = 100;
            $weekStartEpoch = 1724054400 ;
            $data = $model->getWeeklyStats($userId, $weekStartEpoch);
            $this->loadView('learner_dashboard_view', $data);
        }
        
    }


    

    public function GetLastTwoWeeksUserStatsAction() {
        $username = filter_input(INPUT_GET, 'username', FILTER_DEFAULT);

        if (empty($username)) {
            // Return a JSON error response
            echo json_encode(['error' => 'username is required.']);
            return;
        }


        $model = $this->model('WeeklyStatsModel');
        $userStatsData = $model->getLastTwoWeeksStatsByUsername($username);

        if ($userStatsData['success']) {
            // Return the JSON response
            echo json_encode($userStatsData);
        } else {
            // Return a JSON error response if no data is found        
            echo json_encode([
                'error' => [
                    'message' => 'Failed to retrieve userStatsData data.',
                    'details' => $userStatsData['error']
                ]
            ]);
        }
    }

    public function GetLastTwoWeeksLeaderboardAction() {
        $numUsers = htmlspecialchars(filter_input(INPUT_GET, 'num_users', FILTER_SANITIZE_NUMBER_INT));

        if (empty($numUsers)) {
            // Return a JSON error response
            echo json_encode(['error' => 'Number of users is required.']);
            return;
        }

        $model = $this->model('WeeklyStatsModel');
        $leaderboardData = $model->getTopXPUsersForLastTwoWeeks((int) $numUsers);

        if ($leaderboardData['success']) {
            // Return the JSON response
            echo json_encode($leaderboardData);
        } else {
            // Return a JSON error response if no data is found        
            echo json_encode([
                'error' => [
                    'message' => 'Failed to retrieve leaderboard data.',
                    'details' => $leaderboardData['error']
                ]
            ]);
        }
        exit; // for debug so i can see json messages
    }


    public function GetLeaderboardAction() {
        $numUsers = htmlspecialchars(filter_input(INPUT_GET, 'num_users', FILTER_SANITIZE_NUMBER_INT));
        $weekStartEpoch = htmlspecialchars(filter_input(INPUT_GET, 'week_start_epoch', FILTER_SANITIZE_NUMBER_INT));
        //$numUsers = htmlspecialchars(filter_input(INPUT_GET, 'num_users', FILTER_SANITIZE_NUMBER_INT));
        $weekType = filter_input(INPUT_GET, 'week_type', FILTER_UNSAFE_RAW);
        //$numUsers = $_GET['num_users'];
        //$weekType = $_GET['week_type'];

     
        if (empty($numUsers) || empty($weekStartEpoch) || empty($weekType) ) {
            // Return a JSON error response
            echo json_encode(['error' => 'Number of users and week type are required.']);
            return;
        }

       
        $model = $this->model('WeeklyStatsModel');
        //$leaderboardData = $model->getTopUsers((int) $numUsers, $weekStartEpoch);
        $leaderboardData = $model->getTopUsers((int) $numUsers, $weekType);

        if ($leaderboardData['success']) {
            // Return the JSON response
            echo json_encode($leaderboardData);
        } else {
            // Return a JSON error response if no data is found        
            echo json_encode([
                'error' => [
                    'message' => 'Failed to retrieve leaderboard data.',
                    'details' => $leaderboardData['error']
                ]
            ]);
        }


    }

}
?>
