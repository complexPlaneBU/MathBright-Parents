<?php
class WeeklyStatsModel {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Private helper method to get the user_id from the username
    private function getUserIdFromUsername($username) {
        $stmt = $this->db->prepare("SELECT user_id FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetchColumn(); // Returns the user_id
    }

  // Private helper method to get the weekly stats query
    private function getWeeklyStatsQuery($userId = null, $weekStartEpoch = null) {
  
    // Get user data
    //private function getUserStatsQuery($userId = null, $weekStartEpoch = null) {
        $query = "
            SELECT 
                ws.*, 
                u.username, 
                up.avatar_config,
                rl.won AS raffle_won
            FROM 
                weekly_stats ws 
            JOIN 
                users u ON ws.User_id = u.user_id 
            LEFT JOIN 
                user_profiles up ON ws.User_id = up.user_id 
            LEFT JOIN 
                raffle_log rl ON ws.User_id = rl.user_id AND ws.week_start_epoch = rl.week_epoch
        ";

        $params = [];

        if ($userId !== null) {
            $query .= " WHERE ws.User_id = :user_id";
            $params['user_id'] = $userId;
        }

        if ($weekStartEpoch !== null) {
            if ($userId !== null) {
                $query .= " AND ws.week_start_epoch = :week_start_epoch";
            } else {
                $query .= " WHERE ws.week_start_epoch = :week_start_epoch";
            }
            $params['week_start_epoch'] = $weekStartEpoch;
        }

        return [$query, $params];
    }

    // Get available bonus rewards
     private function getBonusRewardsQuery() {
        $query = "SELECT * FROM rewards_bonus";
        return [$query, []];
    }

    // Get available standard rewards
    private function getStandardRewardsQuery() {
        $query = "SELECT * FROM rewards_parent";
        return [$query, []];
    }


    public function getLastTwoWeeksStatsByUsername($username) {
        // Get user_id from username
        $userId = $this->getUserIdFromUsername($username);

        // Check if user_id is valid
        if (!$userId) {
            return ['success' => false, 'error' => 'getLastTwoWeeksStatsByUsername: User not found'];
        }

        // Get timestamp epochs
        $thisWeekStartEpoch = $this->getCurrentWeekEpoch();
        $lastWeekStartEpoch = strtotime("-7 days", $thisWeekStartEpoch);


        // Use new calculations above to get stats for the last two weeks
        $thisWeekStats = $this->getWeeklyStats($username, $thisWeekStartEpoch);
        $lastWeekStats = $this->getWeeklyStats($username, $lastWeekStartEpoch);


        // Initialize success flags
        $hasThisWeekData = $thisWeekStats['success'];
        $hasLastWeekData = $lastWeekStats['success'];

        // Determine overall success status
        $successStatus = 'false'; // Default to false
        if ($hasThisWeekData && $hasLastWeekData ) {
            $successStatus = 'success'; // All data is available
        } elseif ($hasThisWeekData || $hasLastWeekData ) {
            $successStatus = 'partial-data'; // Some data is available
        }

        // Return the combined stats and rewards with the appropriate success status
        return [
            'success' => $successStatus,
            'data' => [
                'timestamps' => [
                    'this_week_start' => $thisWeekStartEpoch,
                    'last_week_start' => $lastWeekStartEpoch,
                ],
                'this_week' => $hasThisWeekData ? $thisWeekStats['data'] : null,
                'last_week' => $hasLastWeekData ? $lastWeekStats['data'] : null,                
            ],
            'error' => $successStatus === 'false' ? 'No data found for user' : null,
        ];
    }

      public function getLastTwoWeeksStatsByUsername_orig($username) {
        // Get user_id from username
        $userId = $this->getUserIdFromUsername($username);

        // Check if user_id is valid
        if (!$userId) {
            return ['success' => false, 'error' => 'getLastTwoWeeksStatsByUsername: User not found'];
        }

        // Calculate the last two weeks' start epochs - 8am Monday GMT reset for everyone, worldwide
        $currentDate = new DateTime('now', new DateTimeZone('GMT'));
        if ($currentDate->format('H') >= 8) { // If current hour is 8 or later
            $currentDate->modify('this week'); // Roll over to next week
        } else {
            $currentDate->modify('last week'); // Stay in current week
        }
        $currentDate->setTime(8, 0, 0); // Set time to 8am
        $thisWeekStartEpoch = $currentDate->getTimestamp();
        $lastWeekStartEpoch = $currentDate->modify('-1 week')->getTimestamp();

        // Use new calculations above to get stats for the last two weeks
        $thisWeekStats = $this->getWeeklyStats($username, $thisWeekStartEpoch);
        $lastWeekStats = $this->getWeeklyStats($username, $lastWeekStartEpoch);

        // Get available rewards
        $bonusRewards = $this->getBonusRewards();
        $standardRewards = $this->getStandardRewards();

        // Initialize success flags
        $hasThisWeekData = $thisWeekStats['success'];
        $hasLastWeekData = $lastWeekStats['success'];
        $hasBonusRewards = $bonusRewards['success'];
        $hasStandardRewards = $standardRewards['success'];

        // Determine overall success status
        $successStatus = 'false'; // Default to false
        if ($hasThisWeekData && $hasLastWeekData && $hasBonusRewards && $hasStandardRewards) {
            $successStatus = 'success'; // All data is available
        } elseif ($hasThisWeekData || $hasLastWeekData || $hasBonusRewards || $hasStandardRewards) {
            $successStatus = 'partial-data'; // Some data is available
        }

        // Return the combined stats and rewards with the appropriate success status
        return [
            'success' => $successStatus,
            'data' => [
                'timestamps' => [
                    'this_week_start' => $thisWeekStartEpoch,
                    'last_week_start' => $lastWeekStartEpoch,
                    'current_date' => $currentDate->getTimestamp(),
                ],
                'this_week' => $hasThisWeekData ? $thisWeekStats['data'] : null,
                'last_week' => $hasLastWeekData ? $lastWeekStats['data'] : null,
                'rewards' => [
                    'bonus' => $hasBonusRewards ? $bonusRewards['data'] : null,
                    'standard' => $hasStandardRewards ? $standardRewards['data'] : null,
                ],
            ],
            'error' => $successStatus === 'false' ? 'No data found for user' : null,
        ];
    }

    // Method to get weekly stats by user ID and week start epoch
    public function getWeeklyStats($username, $weekStartEpoch) {
        // Get user_id from username
        $userId = $this->getUserIdFromUsername($username);

        // Check if user_id is valid
        if (!$userId) {
            return ['success' => false, 'error' => 'getWeeklyStats: User not found'];
        }

        list($query, $params) = $this->getWeeklyStatsQuery($userId, $weekStartEpoch);
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            return ['success' => true, 'data' => $data];
        } else {
            return ['success' => false, 'error' => 'No data found for user'];
        }
    }

// Method to get bonus rewards
public function getBonusRewards() {
    list($query, $params) = $this->getBonusRewardsQuery();
    $stmt = $this->db->prepare($query);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($data) {
        return ['success' => true, 'data' => $data];
    } else {
        return ['success' => false, 'error' => 'No bonus rewards found'];
    }
}

// Method to get standard rewards
public function getStandardRewards() {
    list($query, $params) = $this->getStandardRewardsQuery();
    $stmt = $this->db->prepare($query);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if ($data) {
        return ['success' => true, 'data' => $data];
    } else {
        return ['success' => false, 'error' => 'No standard rewards found'];
    }
}


    // Method to get top X users for the last two weeks
public function getTopXPUsersForLastTwoWeeks($numUsers) {
    try {
        $currentDate = new DateTime('now', new DateTimeZone('GMT'));
        $lastTwoWeeksData = [];
        $weekStartEpoch = 1728288000;

        // Get data for this week
        $currentWeekEpoch = $this->getCurrentWeekEpoch();
        $lastTwoWeeksData['this_week'] = $this->getTopUsersForWeek($numUsers, $currentWeekEpoch);

        // Get data for last week
        $previousWeekEpoch = strtotime("-7 days", $currentWeekEpoch);
        $lastTwoWeeksData['last_week'] = $this->getTopUsersForWeek($numUsers, $previousWeekEpoch);

        return ['success' => true, 'data' => $lastTwoWeeksData];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

    private function getCurrentWeekEpoch() {
        $stmt = $this->db->prepare("SELECT current_week_epoch FROM config WHERE id = 1");
        $stmt->execute();

        $result = $stmt->fetchColumn();
        if ($result === false) {
            throw new RuntimeException("Failed to retrieve current week epoch.");
        }
        return $result;
    }

//=============== Above is the most frequently used stuff
    // Method to get weekly stats by username (now fetching user_id first)
    public function getWeeklyStatsByUsername($username) {
        $userId = $this->getUserIdFromUsername($username);
        if (!$userId) {
            return ['success' => false, 'error' => 'getWeeklyStatsByUsername: User not found'];
        }
        list($query, $params) = $this->getWeeklyStatsQuery($userId);
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($data) {
            return ['success' => true, 'data' => $data];
        } else {
            return ['success' => false, 'error' => 'No data found for user'];
        }
    }

    // Method to get weekly stats by week start epoch
    public function getWeeklyStatsByWeek($weekStartEpoch) {
        list($query, $params) = $this->getWeeklyStatsQuery(null, $weekStartEpoch);
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   
    private function getMondayStartEpoch(DateTime $date) {
        $monday = clone $date;
        $currentDate = new DateTime('now', new DateTimeZone('GMT'));
        if ($currentDate->format('H') >= 8) { 
            $monday->modify('this week'); 
        } else { 
            $monday->modify('last week'); 
        }
        $monday->setTime(8, 0, 0); // 8am GMT
        return $monday->getTimestamp();
    }


    // Method to get top X users for the last two weeks
public function getTopUsersForLastTwoWeeks($numUsers) {
    try {
        $currentDate = new DateTime('now', new DateTimeZone('GMT'));
        $lastTwoWeeksData = [];

        // Get data for this week
        $mondayStartEpoch = $this->getMondayStartEpoch($currentDate);
        $lastTwoWeeksData['this_week'] = $this->getTopUsersForWeek($numUsers, $mondayStartEpoch);

        // Get data for last week
        $lastMonday = $currentDate->modify('-7 days');
        $lastWeekMondayStartEpoch = $this->getMondayStartEpoch($lastMonday);
        $lastTwoWeeksData['last_week'] = $this->getTopUsersForWeek($numUsers, $lastWeekMondayStartEpoch);

        return ['success' => true, 'data' => $lastTwoWeeksData];
    } catch (PDOException $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// Helper method to get top users for a given week epoch
private function getTopUsersForWeek($numUsers, $weekStartEpoch) {
    // Updated SQL query to select all columns from weekly_stats
    $stmt = $this->db->prepare("
        SELECT 
            ws.*,                -- Select all columns from weekly_stats
            u.username, 
            up.avatar_config
        FROM 
            weekly_stats ws 
        JOIN 
            users u ON ws.User_id = u.user_id 
        LEFT JOIN 
            user_profiles up ON ws.User_id = up.user_id 
        WHERE 
            ws.week_start_epoch = :week_start_epoch 
        ORDER BY 
            ws.Xp_total DESC, 
            ws.User_id DESC
        LIMIT 
            :num_users
    ");
    
    // Binding parameters
    $stmt->bindParam(':week_start_epoch', $weekStartEpoch, PDO::PARAM_INT);
    $stmt->bindParam(':num_users', $numUsers, PDO::PARAM_INT);
    
    // Execute the statement
    $stmt->execute();
    
    // Return the result set
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


    // Method to get top X users for a given week
    public function getTopUsers($numUsers, $weekType) {
        try {
            // Determine the week epoch based on the week type
            $currentDate = new DateTime('now', new DateTimeZone('GMT'));
            $mondayStartEpoch = 0;
            if ($weekType == 'this_week') {
                $mondayStartEpoch = $this->getMondayStartEpoch($currentDate);
            } elseif ($weekType == 'last_week') {
                $lastMonday = $currentDate->modify('-7 days');
                $mondayStartEpoch = $this->getMondayStartEpoch($lastMonday);
            }

            // Query the weeks table to find the matching week epoch
            $stmt = $this->db->prepare("SELECT week_epoch FROM weeks WHERE week_epoch = :week_epoch");
            $stmt->bindParam(':week_epoch', $mondayStartEpoch, PDO::PARAM_INT);
            $stmt->execute();
            $weekEpochRow = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$weekEpochRow) {
                throw new PDOException('Week epoch not found');
            }
            $weekStartEpoch = $weekEpochRow['week_epoch'];

            // Proceed with the original query
            $stmt = $this->db->prepare("
                SELECT 
                    ws.User_id, 
                    u.username, 
                    ws.Xp_total, 
                    up.avatar_config,
                    ws.Bonus_rewards_available
                FROM 
                    weekly_stats ws 
                JOIN 
                    users u ON ws.User_id = u.user_id 
                LEFT JOIN 
                    user_profiles up ON ws.User_id = up.user_id 
                WHERE 
                    ws.week_start_epoch = :week_start_epoch 
                ORDER BY 
                    ws.Xp_total DESC, 
                    ws.User_id DESC
                LIMIT 
                    :num_users
            ");
            $stmt->bindParam(':week_start_epoch', $weekStartEpoch, PDO::PARAM_INT);
            $stmt->bindParam(':num_users', $numUsers, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $data];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }


}


?>

