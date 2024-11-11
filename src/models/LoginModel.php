<?php

class LoginModel {
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

    public function login($username, $password) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $response = ['success' => false];
        try {
            if ($username === null || $password === null) {
                throw new Exception('Username or password not provided.');
            }

            $stmt = $this->db->prepare("SELECT user_id, password_hash FROM users WHERE username = :username");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $stored_hash = $row['password_hash'];

                if (password_verify($password, $stored_hash)) {
                    $_SESSION['username'] = $username;
                    $_SESSION['user_id'] = $row['user_id']; // Store user_id in session

                    $response['success'] = true;
                    $response['message'] = 'Login successful.';
                } else {
                    $response['message'] = 'Invalid password.';
                }
            } else {
                $response['message'] = 'Username not found.';
            }
        } catch (PDOException $e) {
            $response['error'] = 'Database error: ' . $e->getMessage();
        } catch (Exception $e) {
            $response['error'] = $e->getMessage();
        }
        return $response;
    }


    // If no specific username is provided, it just checks if the user is logged in based on the session.
    public function isAuthenticated($username = null) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $response = ['loggedIn' => false, 'userData' => null, 'debug' => []];

        // Check if session variables are set
        if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
            $response['debug'][] = "Session username: " . $_SESSION['username'];
            $response['debug'][] = "Session user ID: " . $_SESSION['user_id'];
            $response['debug'][] = "username_passed_in: " . $username;
            // If a specific username is provided, check it
            if ($username === null || $_SESSION['username'] === $username) {
                $response['loggedIn'] = true;
                $response['userData'] = [
                    'username' => $_SESSION['username'],
                    'user_id' => $_SESSION['user_id']
                ];
            }
        } else {
            $response['debug'][] = "Session variables not set.";
        }

        return $response;
    }






    public function logout() {
        $response = ['success' => false];

        try {

            // Start the session if it's not already started
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // Unset all session variables
            $_SESSION = [];

            session_destroy();

            // Destroy the session
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"], $params["secure"], $params["httponly"]
                );
            }

            $response['success'] = true;
            $response['message'] = 'Logout successful.';
        } catch (Exception $e) {
            $response['error'] = $e->getMessage();
        }

        return $response;
    }

}





?>
