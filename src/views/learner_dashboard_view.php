<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathBright Leaderboard</title>
    <link rel="stylesheet" href="src/views/learnerdashboard_styles.css"> <!-- Link to your CSS file -->
    <link rel="stylesheet" href="src/views/learner_dashboard/raffle.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/gems.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/lessons.css"> 
    <link rel="stylesheet" href="src/views/learner_dashboard/rank.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards/bonus.css"> 
    <link rel="stylesheet" href="src/views/screens/rewards/parent.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->
</head>
<body>
    

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

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Login</h2>
            <form id="loginForm">
                <label for="username">Username:</label>
                <input type="text" id="login-username" name="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="login-password" name="password" required>
                <br>
                <button type="submit">Login</button>
            </form>
            <div id="loginResponse"></div>
        </div>
    </div>

    <!-- User Profile -->
    <!--
    <div class="user-profile">
        <div id="userAvatar">
            <img src="https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelBlue&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Black&eyeType=WinkWacky&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light" alt="Default Avatar" class="avatar">
        </div>
        <div class="user-details">
            <div>
                <div>
                    <h2 class="username"></h2>
                    <p>Mathling</p>
                    <p>Level 30</p>
                </div>
                <div class="xp-bar">
                    <div class="xp-progress"></div>
                </div>
            </div>
            <div>
                <p class="xp-score">
                   <span class="xp-value">XP</span>
                   <span class="xp-label">XP</span>
                </p>
                
                <button id="logoutButton">Logout</button>

            </div>
        </div>
        
    </div>
    -->

    <div id="screens">

        <!-- HOME Screen -->
        <div id="home_screen">        

        </div>

        <!-- Activities Screen -->
        <div id="activities_screen">        
            activities_screen
        </div>

        <!-- rewards Screen -->
        <div id="rewards_screen">      
            <div id="bonus-rewards" class="tab-content">
                <!-- Bonus rewards content goes here -->
            </div>
        </div>

        <!-- Shop Screen -->
        <div id="shop_screen">        
            shop screen
        </div>

        <!-- Profile Screen -->
        <div id="profile_screen">        
            profile_screen
        </div>

    </div>


    <!-- Bottom Navigation -->
    <div class="bottom-nav">
        <button class="nav-button" data-icon="home"><i class="fas fa-home"></i><br><span>Home</span></button>
        <button class="nav-button" data-icon="activities"><i class="fas fa-tasks"></i><br><span>Activities</span></button>
        <button class="nav-button" data-icon="rewards"><i class="fas fa-gem"></i><br><span>rewards</span></button>
        <button class="nav-button" data-icon="shop"><i class="fas fa-store"></i><br><span>Shop</span></button>
        <button class="nav-button" data-icon="profile"><i class="fas fa-user"></i><br><span>Profile</span></button>
    </div>

</div>
   
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="module" src="src/views/learner_dashboard.js"></script> 


<!--    <script type="module" src="src/views/menuManager.js"></script>

    <script type="module" src="src/views/screens/home.js"></script>

    <script type="module" src="src/views/learner_dashboard/rank.js"></script> 
    <script type="module" src="src/views/learner_dashboard/raffle.js"></script>
    <script type="module" src="src/views/learner_dashboard/gems.js"></script>
    <script type="module" src="src/views/learner_dashboard/lessons.js"></script>

-->
</body>
</html>
