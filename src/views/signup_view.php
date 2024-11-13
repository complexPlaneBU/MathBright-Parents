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
        echo '  otpData = ' . $otpData ;
        echo '  state = ' . $state ;
     ?>
</div>

<div class="overlay"></div>


<div> Signup View </div>

<div id="loginSection">

    <div class="signup_login_screens" id="signup_login_screens"></div>

</div>



   
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="src/views/signup_view.js"></script> 

</body>
</html>
