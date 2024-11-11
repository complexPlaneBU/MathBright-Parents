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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->

    <style>
        #splashScreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo {
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }

        .loader {
          border: 10px solid #f3f3f3;
          border-top: 10px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
    </style>
</head>
<body>
    

 <?php
     function a($string) {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
?>

<div class="overlay"></div>


<!-- Splash screen with logo -->
<div id="splashScreen">
  <img src="logo.png" alt="Logo" class="logo">
  <div class="loader"></div>
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

    <!-- Back Button and Parent Login Button -->
    <div class="header">
        <button class="back-button">← Back</button>
        <button id="openLoginModal">Kids Sign In</button>
        <button class="parent-login-btn">Parents Sign In</button>
    </div>

    <!-- User Profile -->
    <div class="user-profile">
        <div id="userAvatar">
            <img src="https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelBlue&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Black&eyeType=WinkWacky&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light" alt="Default Avatar" class="avatar">
        </div>
        <div class="user-details">
            <div>
                <div>
                    <h2 class="username"></h2>
                    <p>Mathling</p>
                    <!--<p>Level 30</p>-->
                </div>
                <!--<div class="xp-bar">
                    <div class="xp-progress"></div>
                </div>-->
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

    <div id="results"></div>

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
        <!--
            <h1>Rewards rewards</h1>
            <div class="bonus-rewards">
                <p>Bonus Rewards Left: <span>1</span></p>
            </div>
            <div class="tab-menu">
                <button class="tab active" onclick="openTab('parent-rewards')">Parent Rewards</button>
                <button class="tab" onclick="openTab('bonus-rewards')">Bonus Rewards</button>
            </div>
            <div id="parent-rewards" class="tab-content active">
                <div class="reward-card">
                    <img src="https://cdn.pixabay.com/photo/2015/08/11/08/21/coupon-883640_1280.png" alt="Roblox Gift Card" class="reward-image">
                    <div class="reward-info">
                        <p>$10 Roblox Gift Card</p>
                        <button class="add-to-cart">Add to cart</button>
                    </div>
                </div>
                <div class="reward-card">
                    <img src="https://cdn.pixabay.com/photo/2015/08/11/08/21/coupon-883640_1280.png" alt="Five Below Gift Card" class="reward-image">
                    <div class="reward-info">
                        <p>$10 Five Below Gift Card</p>
                        <button class="add-to-cart">Add to cart</button>
                    </div>
                </div>
                <div class="reward-card">
                    <img src="https://cdn.pixabay.com/photo/2015/08/11/08/21/coupon-883640_1280.png" alt="Apple Gift Card" class="reward-image">
                    <div class="reward-info">
                        <p>$10 Five Below Gift Card</p>
                        <button class="add-to-cart">Add to cart</button>
                    </div>
                </div>
            </div>
            -->
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

    <script>
     /*
        // Preload leaderboard data
        fetch('leaderboard-data.json')
          .then(response => response.json())
          .then(data => {
            // Hide splash screen and show app section
            document.getElementById('splashScreen').style.display = 'none';
            document.getElementById('appSection').style.display = 'block';
            // Render leaderboard data
            renderLeaderboard(data);
          })
          .catch(error => console.error('Error loading leaderboard data:', error));

        // Render leaderboard function
        function renderLeaderboard(data) {
          // Create leaderboard HTML elements
          const leaderboardHtml = '';
          // Append to app section
          document.getElementById('appSection').innerHTML = leaderboardHtml;
        }
        */

        // script.js
        document.addEventListener("DOMContentLoaded", function () {
            // Simulate loading data for the leaderboard
            setTimeout(() => {
                // Hide the splash screen and show the app section
                document.getElementById("splashScreen").style.display = "none";
                document.getElementById("appSection").style.display = "block";

                // Load the leaderboard data
                loadLeaderboard();
            }, 3000); // Simulates a 3-second loading time (adjust as needed)
        });

        function loadLeaderboard() {
            // Mockup function to load leaderboard data
            const leaderboardDiv = document.getElementById("leaderboard");
            leaderboardDiv.innerHTML = "<h2>Leaderboard</h2><ul><li>Player 1: 100</li><li>Player 2: 90</li></ul>";
        }

    </script>

</body>
</html>
