<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathBright Leaderboard</title>
    <link rel="stylesheet" href="src/views/common_styles.css"> 
    <!--
    <link rel="stylesheet" href="src/views/login.css"> 
    
    <link rel="stylesheet" href="src/views/learner_dashboard/raffle.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/gems.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/lessons.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/rank.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards/bonus.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards/parent.css"> 
    -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->

    
</head>
<body>
    
<div> Parent's Dashboard View </div>


 <?php
     function a($string) {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
?>

<div>
    <?php if ($verbose == 123) { 
        echo $username . ' with userid = ' . $user_id . ' logged in = ' . $loggedIn;
    } ?>

</div>

<div class="overlay"></div>


<div id="splashScreen">
    <div id="logo">
        <img src="./src/views/textLogo.png" alt="M_thBright" title="MathBright Logo" class="text-logo">
        <img src="./src/views/logoA.png" alt="∂" title="∂ Logo" class="partial-derivative-logo"> 
    </div>
</div>



<!-- Main App Content -->
<div id="appSection">

    <div id="screens">

        <!-- HOME Screen -->
        <div id="home_screen">        
            home_screen  - DEFAULT CONTENT
            </br>- show stats of kids
            </br>-- lesson completion data (qty and time completed)
            </br>-- similar to emails that are sent
        </div>

        <!-- Activities Screen -->
        <div id="activities_screen">        
            activities_screen  - DEFAULT CONTENT
        </div>

        <!-- rewards Screen -->
        <div id="rewards_screen">      
            <div id="bonus-rewards" class="tab-content">
                <!-- Bonus rewards content goes here -->
            </div>
            rewards_screen - DEFAULT CONTENT
            </br>-let parent's view Parent rewards
            </br>-let Parent's update the Parent Rewards'
        </div>

        <!-- Shop Screen -->
        <div id="shop_screen">        
            shop screen  - DEFAULT CONTENT
        </div>

        <!-- Account Screen -->
        <div id="account_screen">        
            account_screen  - DEFAULT CONTENT
            </br>- see subscription info
            </br>- logout button
            </br>- get help link (FAQ, Blog, Contact Us)
            </br>- cancel subscription (send email)
        </div>

    </div>


    <!-- Bottom Navigation -->
    <div class="bottom-nav">
        <button class="nav-button" data-icon="home"><i class="fas fa-home"></i><br><span>Home</span></button>
        <!-- <button class="nav-button" data-icon="activities"><i class="fas fa-tasks"></i><br><span>Activities</span></button> -->
        <button class="nav-button" data-icon="rewards"><i class="fas fa-gem"></i><br><span>Rewards</span></button>
        <!-- <button class="nav-button" data-icon="shop"><i class="fas fa-store"></i><br><span>Shop</span></button> -->
        <button class="nav-button" data-icon="account"><i class="fas fa-user"></i><br><span>Account</span></button>
    </div>

</div>
   
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="src/views/parent_dashboard.js"></script> 

</body>
</html>
