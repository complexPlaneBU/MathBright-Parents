<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathBright Leaderboard</title>
    <link rel="stylesheet" href="src/views/common_styles.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->

    
</head>
<body>
    

<div>
    <?php 
        echo '  state = ' . $state ;
     ?>
</div>

<div class="overlay"></div>


<div> Signup View </div>

<div id="loginSection" data-state="<?= $state ?>">

    <div class="signup_login_screens" id="signup_login_screens"></div>

</div>



   
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="src/views/signup_view.js"></script> 

</body>
</html>


<?php
/*
    <div id="login-screen" class="screen">
        <h1>Login</h1>
        <form id="login-form">
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" required />
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" required />
            <button type="submit">Submit</button>
            <a href="#">Forgot Password?</a>
            <a href="#" onclick="authStateMachine.state = 'signup'; authStateMachine.updateUI();">Sign Up</a>
        </form>
    </div>

    <div id="otp-screen" class="screen hidden">
        <h1>Enter OTP</h1>
        <form id="otp-form">
            <input type="text" id="otp" required />
            <button type="submit">Verify OTP</button>
        </form>
        <button class="back-button">Back</button>
    </div>

    <div id="user-info-screen" class="screen hidden">
        <h1>Enter Your Info</h1>
        <form id="signup-form">
            <input type="text" id="user-name" placeholder="Your Name" required />
            <input type="password" id="user-password" placeholder="Create Password" required />
            <button type="submit">Next</button>
        </form>
        <button class="back-button">Back</button>
    </div>

    <div id="kids-registration-screen" class="screen hidden">
        <h1>Register Your Kids</h1>
        <form id="child-form">
            <input type="text" id="child-first-name" placeholder="Child's First Name" required />
            <input type="text" id="child-last-name" placeholder="Child's Last Name" required />
            <input type="number" id="child-age" placeholder="Child's Age" required />
            <input type="text" id="child-grade" placeholder="Grade" required />
            <input type="text" id="child-school" placeholder="School Name" required />
            <button type="submit">Next</button>
        </form>
        <button class="back-button">Back</button>
    </div>

    <div id="subscription-screen" class="screen hidden">
        <h1>Select Subscription Plan</h1>
        <form id="subscription-form">
            <label><input type="radio" name="subscription" value="monthly" /> Monthly</label>
            <label><input type="radio" name="subscription" value="annual" /> Annual</label>
            <button type="submit">Next</button>
        </form>
        <button class="back-button">Back</button>
    </div>

    <div id="payment-screen" class="screen hidden">
        <h1>Payment</h1>
        <form id="payment-form">
            <button type="submit">Proceed to Payment</button>
        </form>
        <button class="back-button">Back</button>
    </div>

    <div id="confirmation-screen" class="screen hidden">
        <h1>Confirmation</h1>
        <p>Your account is set up successfully!</p>
    </div>

*/