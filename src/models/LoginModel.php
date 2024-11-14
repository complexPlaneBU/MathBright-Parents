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

    
    public function saveEmail($email, $otp) {
        // Ensure the session is started if it's not already
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $expirationTime = date('Y-m-d H:i:s', time() + 300); // 5 minutes


        // Make sure we have a valid email
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return null;  // Invalid email, return null (you might want to handle this differently)
        }

        // Insert the email, OTP, and expiration time into the signup_temp table
        $query = "INSERT INTO signup_temp (email, otp, otp_expiration_time) VALUES (:email, :otp, :expirationTime)";
        try {
            // Get the database connection (assuming a PDO instance is available via $this->db)
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':otp', $otp, PDO::PARAM_STR);
            $stmt->bindParam(':expirationTime', $expirationTime, PDO::PARAM_STR);
    
            // Execute the query
            if ($stmt->execute()) {
                // Return success, you can also return the ID of the inserted row
                return ['success' => true];
            } else {
                // If query execution fails
                return ['success' => false];
            }
        } catch (PDOException $e) {
            // Log error and return failure
            error_log('Database error: ' . $e->getMessage());
            return ['success' => false];
        }
    }



    public function verifyOTP($email, $otp) {
        // Make sure we have a valid email
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return null;  // Invalid email, return null
        }

        // Query to retrieve OTP and expiration time from database
        $query = "SELECT otp, otp_expiration_time FROM signup_temp WHERE email = :email";
        try {
            // Prepare query
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        
            // Execute query
            $stmt->execute();
        
            // Fetch result
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
            // Check if OTP exists and matches
            if ($result && $result['otp'] === $otp) {
                // Check expiration time
                $expirationTime = strtotime($result['otp_expiration_time']);
                if ($expirationTime > time()) {
                    // OTP is valid and not expired
                    return ['success' => true];
                } else {
                    // OTP has expired
                    return ['success' => false, 'error' => 'OTP has expired'];
                }
            } else {
                // Invalid OTP
                return ['success' => false, 'error' => 'Invalid OTP'];
            }
        } catch (PDOException $e) {
            // Log error and return failure
            error_log('Database error: ' . $e->getMessage());
            return ['success' => false];
        }
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
