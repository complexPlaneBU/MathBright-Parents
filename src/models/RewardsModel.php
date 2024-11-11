<?php

class RewardsModel {
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


    
    public function getRewardCards() {

        // Get available rewards
        $bonusRewards = $this->getBonusRewards();
        $standardRewards = $this->getStandardRewards();

        // Initialize success flags
        $hasBonusRewards = $bonusRewards['success'];
        $hasStandardRewards = $standardRewards['success'];

        // Determine overall success status
        $successStatus = 'false'; // Default to false
        if ( $hasBonusRewards && $hasStandardRewards) {
            $successStatus = 'success'; // All data is available
        } elseif ( $hasBonusRewards || $hasStandardRewards) {
            $successStatus = 'partial-data'; // Some data is available
        }

        // Return the combined stats and rewards with the appropriate success status
        return [
            'success' => $successStatus,
            'rewardCards' => [
                'bonus' => $hasBonusRewards ? $bonusRewards['data'] : null,
                'standard' => $hasStandardRewards ? $standardRewards['data'] : null,
            ],
            'error' => $successStatus === 'false' ? 'No reward Cards found' : null,
        ];
    }
    
    public function GetAvailableRewardsForUser($username) {

        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Fetch available rewards from log_reward_bonus table
        $stmt = $this->db->prepare("
            SELECT *
            FROM log_reward_bonus
            WHERE user_id = :user_id AND status NOT IN ('claimed', 'email_sent', 'parent_confirmed', 'delivered')
        ");
        $stmt->execute(['user_id' => $userId]);
        $rewards = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rewards) {
            return [
                'success' => true,
                'data' => $rewards
            ];
        } else {
            return ['success' => false, 'error' => 'No rewards information found'];
        }
    }

    public function GetAvailableParentRewardsForUser($username) {

        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Fetch available rewards from log_reward_bonus table
        $stmt = $this->db->prepare("
            SELECT *
            FROM log_reward_parents
            WHERE user_id = :user_id AND status NOT IN ('claimed', 'email_sent', 'parent_confirmed', 'delivered')
        ");
        $stmt->execute(['user_id' => $userId]);
        $rewards = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($rewards) {
            return [
                'success' => true,
                'data' => $rewards
            ];
        } else {
            return ['success' => false, 'error' => 'No rewards information found'];
        }
    }

    public function getUserProfile($userId) {
        $stmt = $this->db->prepare("SELECT username, avatar_url FROM users WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateToken($logId, $token, $status) {
        $stmt = $this->db->prepare("SELECT status FROM log_reward_bonus WHERE log_id = :log_id");
        $stmt->execute([':log_id' => $logId]);
        $currentStatus = $stmt->fetchColumn();

        if ($currentStatus == 'claimed') {
            $stmt = $this->db->prepare("UPDATE log_reward_bonus SET token = :token, status = :status WHERE log_id = :log_id");
            $stmt->execute([':token' => $token, ':status' => $status, ':log_id' => $logId]);

            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Token and status updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update token and status'];
            }
        } else {
            return ['success' => false, 'error' => 'Token and status update failed. Status is not "claimed"'];
        }
    }

    public function writeRewardDataToDatabase($username, $logId, $rewardId, $token, $status) {
          
        $availableRewards = $this->GetAvailableRewardsForUser($username);

        if (!$availableRewards['success']) {
            return $availableRewards;
        }

        $rewards = $availableRewards['data'];

        // Check if the logId exists in the available rewards and status is not "delivered", "parent_confirmed", or "claimed"
        $rewardToUpdate = array_filter($rewards, function ($reward) use ($logId) {
            return $reward['log_id'] == $logId && !in_array($reward['status'], ['delivered', 'parent_confirmed', 'claimed']);
        });

        if (empty($rewardToUpdate)) {
            return ['success' => false, 'error' => 'No available rewards to claim or reward already claimed'];
        }
        

        $stmt = $this->db->prepare("
            UPDATE log_reward_bonus
            SET reward_id = :reward_id, token = :token, date_claimed = NOW(), status = :status
            WHERE log_id = :log_id
        ");
        $stmt->execute([':reward_id' => $rewardId, ':token' => $token, ':status' => $status, ':log_id' => $logId]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Reward bonus updated successfully'];
        } else {
            return ['success' => false, 'error' => 'Failed to update reward bonus'];
        }
        
    }

    
    public function writeRewardParentDataToDatabase($username, $logId, $rewardId, $token, $status) {
          
        $availableRewards = $this->GetAvailableParentRewardsForUser($username);

        if (!$availableRewards['success']) {
            return $availableRewards;
        }

        $rewards = $availableRewards['data'];

        // Check if the logId exists in the available rewards and status is not "delivered", "parent_confirmed", or "claimed"
        $rewardToUpdate = array_filter($rewards, function ($reward) use ($logId) {
            return $reward['log_id'] == $logId && !in_array($reward['status'], ['delivered', 'parent_confirmed', 'claimed']);
        });

        if (empty($rewardToUpdate)) {
            return ['success' => false, 'error' => 'No available rewards to claim or reward already claimed'];
        }
        

        $stmt = $this->db->prepare("
            UPDATE log_reward_parents
            SET reward_id = :reward_id, token = :token, date_claimed = NOW(), status = :status
            WHERE log_id = :log_id
        ");
        $stmt->execute([':reward_id' => $rewardId, ':token' => $token, ':status' => $status, ':log_id' => $logId]);

        if ($stmt->rowCount() > 0) {
            return ['success' => true, 'message' => 'Reward Parent updated successfully'];
        } else {
            return ['success' => false, 'error' => 'Failed to update reward Parent'];
        }
        
    }

    // Method to get available bonus rewards
    public function getBonusRewardInfo($rewardId) {
        $stmt = $this->db->prepare("SELECT * FROM rewards_bonus WHERE bonus_reward_id = :reward_id");
        $stmt->execute(['reward_id' => $rewardId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    
    // Update the Bonus Reward Log if confirm is YES or NO
    public function confirmReward($logId, $token, $confirm) {
    $stmt = $this->db->prepare("
        SELECT *
        FROM log_reward_bonus
        WHERE log_id = :log_id AND token = :token
    ");
    $stmt->execute([
        'log_id' => $logId,
        'token' => $token
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && $result['status'] == 'claimed') {
        if ($confirm == 'yes') {
            $updateStmt = $this->db->prepare("
                UPDATE log_reward_bonus
                SET status = 'parent_confirmed'
                WHERE log_id = :log_id AND token = :token
            ");
        } elseif ($confirm == 'no') {
            $updateStmt = $this->db->prepare("
                UPDATE log_reward_bonus
                SET status = 'returned'
                WHERE log_id = :log_id AND token = :token
            ");
        } else {
            // Handle invalid confirm value
            $rewardData = [
                'success' => false,
                'error' => 'Invalid confirm value',
                'verbose_error' => 'Confirm value must be "yes" or "no"'
            ];
            return $rewardData;
        }
        $updateStmt->execute([
            'log_id' => $logId,
            'token' => $token
        ]);

        if ($updateStmt->rowCount() > 0) {
            $rewardData = [
                'success' => true,
                'message' => 'Reward confirmed and updated',
                'reward_data' => $result
            ];
        } else {
            $errorInfo = $updateStmt->errorInfo();
            $rewardData = [
                'success' => false,
                'error' => 'Failed to update reward status',
                'verbose_error' => $errorInfo,
                'reward_data' => $result
            ];
        }
    } else {
        if (!$result) {
            $rewardData = [
                'success' => false,
                'error' => 'Reward not found',
                'verbose_error' => 'No result found for log_id and token'
            ];
        } else {
            $rewardData = [
                'success' => false,
                'error' => 'Not able to confirm',
                'verbose_error' => 'Status is not "claimed"',
                'reward_data' => $result
            ];
        }
    }

    return $rewardData;
}


    // ===============================
    // old stuff



    // Private helper method to validate if a reward_id exists in the correct table based on reward_type
    private function validateRewardId($rewardId, $rewardType) {
        if ($rewardType === 'bonus') {
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM rewards_bonus WHERE bonus_reward_id = :reward_id");
        } elseif ($rewardType === 'standard') {
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM rewards_parent WHERE reward_id = :reward_id");
        } else {
            return false; // Invalid reward_type
        }
        $stmt->execute(['reward_id' => $rewardId]);
        return $stmt->fetchColumn() > 0;
    }

    // Method to get available bonus rewards
    private function getBonusRewardsQuery() {
        $query = "SELECT * FROM rewards_bonus";
        return [$query, []];
    }

    // Method to get available standard rewards
    private function getStandardRewardsQuery() {
        $query = "SELECT * FROM rewards_parent";
        return [$query, []];
    }

    // Method to get available rewards
    public function getAvailableRewardNames() {
        $bonusRewards = $this->getBonusRewards();
        $standardRewards = $this->getStandardRewards();

        if ($bonusRewards['success'] && $standardRewards['success']) {
            return [
                'success' => true,
                'data' => [
                    'bonus' => $bonusRewards['data'],
                    'standard' => $standardRewards['data'],
                ],
            ];
        } else {
            return ['success' => false, 'error' => 'No rewards found'];
        }
    }

    // Method to get bonus rewards
    public function getBonusRewards() {
        list($query, $params) = $this->getBonusRewardsQuery();
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $data ? ['success' => true, 'data' => $data] : ['success' => false, 'error' => 'No bonus rewards found'];
    }

    // Method to get standard rewards
    public function getStandardRewards() {
        list($query, $params) = $this->getStandardRewardsQuery();
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $data ? ['success' => true, 'data' => $data] : ['success' => false, 'error' => 'No standard rewards found'];
    }

    // Method to add reward to user's cart
    public function addRewardToCart($username, $rewardId, $rewardType) {
        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Validate the reward_id and reward_type
        if (!$this->validateRewardId($rewardId, $rewardType)) {
            return ['success' => false, 'error' => 'Invalid reward ID or type'];
        }

        $query = "INSERT INTO user_cart (user_id, reward_id, reward_type) VALUES (:user_id, :reward_id, :reward_type)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':reward_id', $rewardId, PDO::PARAM_INT);
        $stmt->bindParam(':reward_type', $rewardType, PDO::PARAM_STR);

        try {
            $stmt->execute();
            return ['success' => true, 'message' => 'Reward added to cart'];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    // Method to check user's cart
    public function getUserCart($username) {
        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Query to get the user's cart items with reward details
        $query = "
            SELECT 
                uc.id,
                uc.reward_id,
                uc.reward_type,
                CASE 
                    WHEN uc.reward_type = 'bonus' THEN br.bonus_reward_name
                    WHEN uc.reward_type = 'standard' THEN sr.title
                END AS reward_name,
                CASE 
                    WHEN uc.reward_type = 'bonus' THEN br.bonus_reward_description
                    WHEN uc.reward_type = 'standard' THEN sr.description
                END AS reward_description,
                CASE 
                    WHEN uc.reward_type = 'bonus' THEN br.bonus_reward_value
                    WHEN uc.reward_type = 'standard' THEN NULL
                END AS reward_value,
                uc.added_at,
                uc.modified_at
            FROM 
                user_cart uc
            LEFT JOIN 
                rewards_bonus br ON uc.reward_type = 'bonus' AND uc.reward_id = br.bonus_reward_id
            LEFT JOIN 
                rewards_parent sr ON uc.reward_type = 'standard' AND uc.reward_id = sr.reward_id
            WHERE 
                uc.user_id = :user_id
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

        try {
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $data];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    // Method to claim reward and log it
    public function claimReward_old($username, $rewardId, $rewardType) {
        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Validate reward
        if (!$this->validateRewardId($rewardId, $rewardType)) {
            return ['success' => false, 'error' => 'Invalid reward ID or type'];
        }

        // Insert into user_rewards_log
        $token = bin2hex(random_bytes(16)); // Generate a random token for the claim
        $query = "INSERT INTO user_rewards_log (user_id, reward_id, reward_type, token) VALUES (:user_id, :reward_id, :reward_type, :token)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':reward_id', $rewardId, PDO::PARAM_INT);
        $stmt->bindParam(':reward_type', $rewardType, PDO::PARAM_STR);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);

        try {
            $stmt->execute();

            // Optionally, remove from user_cart after claiming
            $cartQuery = "DELETE FROM user_cart WHERE user_id = :user_id AND reward_id = :reward_id AND reward_type = :reward_type";
            $cartStmt = $this->db->prepare($cartQuery);
            $cartStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $cartStmt->bindParam(':reward_id', $rewardId, PDO::PARAM_INT);
            $cartStmt->bindParam(':reward_type', $rewardType, PDO::PARAM_STR);
            $cartStmt->execute();

            return ['success' => true, 'message' => 'Reward claimed successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }



    // Method to update the count of available rewards
    public function updateRewardCount($username, $rewardType, $change) {
        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        $stmt = $this->db->prepare("
            UPDATE user_rewards_available
            SET available_rewards = available_rewards + :change
            WHERE user_id = :user_id AND reward_type = :reward_type
        ");
        $stmt->execute([
            'user_id' => $userId,
            'reward_type' => $rewardType,
            'change' => $change
        ]);

        return ['success' => true];
    }



    // Method to claim reward and log it
    public function claimReward($username, $rewardId, $rewardType) {
        $userId = $this->getUserIdFromUsername($username);

        if (!$userId) {
            return ['success' => false, 'error' => 'User not found'];
        }

        // Validate reward
        if (!$this->validateRewardId($rewardId, $rewardType)) {
            return ['success' => false, 'error' => 'Invalid reward ID or type'];
        }

        // Check available rewards before claiming
        $stmt = $this->db->prepare("
            SELECT available_rewards
            FROM user_rewards_available
            WHERE user_id = :user_id AND reward_type = :reward_type
        ");
        $stmt->execute(['user_id' => $userId, 'reward_type' => $rewardType]);
        $rewardInfo = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($rewardInfo && $rewardInfo['available_rewards'] > 0) {
            $stmt = $this->db->prepare("INSERT INTO user_rewards_log (user_id, reward_id, reward_type) VALUES (:user_id, :reward_id, :reward_type)");
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':reward_id', $rewardId, PDO::PARAM_INT);
            $stmt->bindParam(':reward_type', $rewardType, PDO::PARAM_STR);

            try {
                $stmt->execute();

                // Optionally, remove from user_cart after claiming
                $cartQuery = "DELETE FROM user_cart WHERE user_id = :user_id AND reward_id = :reward_id AND reward_type = :reward_type";
                $cartStmt = $this->db->prepare($cartQuery);
                $cartStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
                $cartStmt->bindParam(':reward_id', $rewardId, PDO::PARAM_INT);
                $cartStmt->bindParam(':reward_type', $rewardType, PDO::PARAM_STR);
                $cartStmt->execute();

                // Decrement the available rewards count
                $this->updateRewardCount($username, $rewardType, -1);

                return ['success' => true, 'message' => 'Reward claimed successfully'];
            } catch (PDOException $e) {
                return ['success' => false, 'error' => $e->getMessage()];
            }
        } else {
            return ['success' => false, 'error' => 'No available rewards'];
        }
    }

}








?>
