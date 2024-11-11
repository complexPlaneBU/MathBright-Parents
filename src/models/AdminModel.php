<?php

class AdminModel {
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
    public function getUserNamedFromUserID($user_id) {
        $stmt = $this->db->prepare("SELECT username FROM users WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchColumn(); // Returns the user_id
    }

    public function getParentEmailsByUserID($userId) {
        // Query to get parent emails
        $query = "
            SELECT p.parent_email
            FROM parent_kids pk
            JOIN parents p ON pk.parent_id = p.parent_id
            WHERE pk.user_id = :user_id
        ";

        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        $parentEmails = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if ($parentEmails) {
            return ['success' => true, 'data' => $parentEmails];
        } else {
            return ['success' => false, 'error' => 'No parent emails found for user'];
        }
    }

    public function getParentEmails($username) {
        // Get user_id from username
        $userId = $this->getUserIdFromUsername($username);

        // Check if user_id is valid
        if (!$userId) {
            return ['success' => false, 'error' => 'getParentEmails: User not found'];
        }

        // Query to get parent emails
        $query = "
            SELECT p.parent_email
            FROM parent_kids pk
            JOIN parents p ON pk.parent_id = p.parent_id
            WHERE pk.user_id = :user_id
        ";

        $stmt = $this->db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        $parentEmails = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if ($parentEmails) {
            return ['success' => true, 'data' => $parentEmails];
        } else {
            return ['success' => false, 'error' => 'No parent emails found for user'];
        }
    }


    public function getUserInfo($username) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: []; // Return an empty array if $result is false
    }

    public function logEmail($username, $logId, $rewardId, $emailType, $status, $errorMessage) {
        $sql = "INSERT INTO log_email_bonus (username, log_id, reward_id, email_type, status, error_message) VALUES (:username, :logId, :rewardId, :emailType, :status, :errorMessage)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'username' => $username,
            'logId' => $logId,
            'rewardId' => $rewardId,
            'emailType' => $emailType,
            'status' => $status,
            'errorMessage' => $errorMessage
        ]);
    }
    

    /*
 // Fetch the parent ID and email address

            $parentSql = "SELECT p.parent_email

                          FROM parent_kids pk

                          JOIN parents p ON pk.parent_id = p.parent_id

                          WHERE pk.user_id = :user_id";

            $parentStmt = $pdo->prepare($parentSql);

            $parentStmt->execute(['user_id' => $user_id]);



            // Get the parent's email address

            $parentEmail = $parentStmt->fetchColumn();



            // Generate a random token

            $token = bin2hex(random_bytes(16));

            echo "<p>Generated token: $token</p>";
    */

    //end
}



