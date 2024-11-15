<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathBright Leaderboard</title>
    <link rel="stylesheet" href="src/views/verifyEmail.css"> <!-- External CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f7fc;
        }

        .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 400px;
            text-align: center;
        }

        h1 {
            font-size: 24px;
            color: #333;
        }

        .message {
            font-size: 18px;
            margin: 20px 0;
        }

        .success {
            color: green;
        }

        .error {
            color: red;
        }

        .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .hidden {
            display: none;
        }

        /* Custom styles for verification status */
        .verification-status {
            text-align: center;
        }

        .loader {
            display: none;
            font-size: 16px;
            color: #3498db;
        }

        .success-message, .error-message {
            display: none;
        }

        .error-message p {
            color: #e74c3c;
        }
    </style>
</head>
<body>

<div>
    <?php 
        // PHP code to print the token
        echo 'Token: ' . $token;
     ?>
</div>

<div> verifyEmail View </div>

<section id="verifyEmailSection" data-state="<?= $token ?>">

    <!-- Verify Email Section -->
    <div class="container">
        <h1>Email Token Verification</h1>

        <!-- Loading Spinner -->
        <div id="loading" class="spinner"></div>

        <!-- Success and Error Message Containers -->
        <div id="messageContainer" class="message hidden">
            <div id="successMessage" class="message success hidden">
                Your email token has been verified successfully!
                <br>
                <a href="http://localhost/mathbright/MathBright-Parents/index.php?controller=home&action=signup&state=userInfo" class="next-step-link">Click here to continue</a>
                <span id="autoRedirectMessage" class="hidden">Redirecting you in <span id="countdown">5</span> seconds...</span>
            </div>

            <div id="errorMessage" class="message error hidden">
                Sorry, we couldn’t verify the token. Please check your token and try again.
            </div>
        </div>

    </div>
</section>

<script type="module">
    document.addEventListener('DOMContentLoaded', async function () {
        initializeApp();
    });

    async function initializeApp() {
        const verifyEmailSection = document.getElementById('verifyEmailSection');
        const tokenToVerify = verifyEmailSection.getAttribute('data-state');

        // Call the API to verify the email token
        const result = await verifyEmailToken(tokenToVerify);

        // Display the success or error message based on the result
        if (result.success) {
            showSuccessMessage();
        } else {
            showErrorMessage(result.error || 'Error verifying token.');
        }
    }

    // Function to show the success message with a clickable link and auto-redirect
    function showSuccessMessage() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('messageContainer').classList.remove('hidden');

        // Countdown for auto-redirect
        let countdown = 5; // seconds
        const countdownElement = document.getElementById('countdown');
        const autoRedirectMessage = document.getElementById('autoRedirectMessage');

        autoRedirectMessage.classList.remove('hidden');

        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown === 0) {
                clearInterval(interval);
                window.location.href = 'http://localhost/mathbright/MathBright-Parents/index.php?controller=home&action=signup&state=userInfo'; // Redirect to the next page
            }
        }, 1000); // Update every second
    }



    // Function to show the error message
    function showErrorMessage(error) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('messageContainer').classList.remove('hidden');
    }

    // Function to verify the email token
    async function verifyEmailToken(token) {
        try {
            const url = 'https://api.mathbright.co/signup/verifyEmailToken';
            const postData = { token: token };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            if (data.success) {
                return { success: true }; // Return success
            } else {
                return { success: false, error: data.error || 'Error verifying token.' };
            }
        } catch (error) {
            // Catch fetch or network errors
            console.error('Error verifying token:', error.message);
            return { success: false, error: error.message };
        }
    }
</script>

</body>
</html>
