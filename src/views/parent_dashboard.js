let DEBUG_DATA = 1;

renderRewardsScreenHTML

// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/parents_dashboard_view.css'; // Path to your CSS file

// Append the link to the document's <head> section
document.head.appendChild(link);

/*
import { getUserAvatarUrl } from './utils.js';
*/
import { renderHomeScreenHTML } from './screens/home.js';
import { renderRewardsScreenHTML } from './screens/rewards.js';
import { renderAccountScreenHTML } from './screens/account.js';
import { AuthStateMachine } from './screens/signup.js';
import { renderSignupHTML } from './screens/signup.js';
import appState from './state.js';


document.addEventListener('DOMContentLoaded', async function () {
    initializeApp();
})



async function updateApp() {
    try {

        /* // Need to update for Parent Specific Dashbaord

        // Check login status
        const ret = await isAnyoneLoggedIn();

        if (ret.loggedIn) {
            const username = ret.userData.username;
            console.log(ret.userData.username);
            // Load user-specific data if user is logged in (private)
            // Load bonus rewards available data for user (private)
            // Load custom parent rewards for user (private)
            await getRewardsInfoForUser(username);

            // get XP and other stats for specific user; they may not be on the leaderboard so need to always pull
            appState.gLoggedInUserStats = await fetchUserStats(username);
        }


        // Render screens
        await renderHomeScreen();
        await renderRewardsScreen();
        //updateLeaderboard();
        await updateLeaderboardAfterSearch();
        initializeLoginModalEventListeners();


        // Load sections of the screens that show private data for logged in users
        if (ret.loggedIn) {
            await updateRewardsDashboard();
            await displayPrivateRewardsSection();
        }
        */
      

    } catch (error) {
        console.error('Error Updating App:', error);
    }
}


async function initializeApp() {

    const logoA = document.querySelector('.partial-derivative-logo');
    const textLogo = document.querySelector('.text-logo');
    const splashScreen = document.getElementById('splashScreen');
    const appSection = document.getElementById('appSection');    

    // Start bounce-in animation immediately
    logoA.style.animation = 'bounceIn 3s ease-out forwards';

    logoA.addEventListener('animationend', () => {
        textLogo.style.animation = 'throb 4s ease-in-out infinite';
    });

    try {
        await updateApp();
        addEventListeners();
    } catch (error) {
        console.error('Error Initializing App:', error);
    } finally {
        // Stop animations when data loading completes
        renderHomeScreenHTML();
        renderRewardsScreenHTML();
        renderAccountScreenHTML();
        textLogo.style.animation = 'none';
        splashScreen.style.display = 'none';
        appSection.style.display = 'block';

    }
}
 


function addEventListeners() {
    document.querySelectorAll('.bottom-nav button').forEach(button => {
        button.addEventListener('click', handleMenuIconClick);
    });
}




function handleMenuIconClick(event) {
    const iconName = event.currentTarget.dataset.icon;
    const screenDiv = document.getElementById('screens');

    document.querySelectorAll(".user-profile").forEach(function (el) {
        el.style.display = "none";
    });

    switch (iconName) {
        case 'home':
            console.log("in home case statement");
            screenDiv.children[0].style.display = 'block'; // Show home screen
            for (let i = 1; i < screenDiv.children.length; i++) {
                screenDiv.children[i].style.display = 'none'; // Hide other screens
            }
            break;
        case 'activities':
            console.log("in activities case statement");
            screenDiv.children[1].style.display = 'block'; // Show activities screen
            for (let i = 0; i < screenDiv.children.length; i++) {
                if (i !== 1) {
                    screenDiv.children[i].style.display = 'none'; // Hide other screens
                }
            }
            break;
        case 'rewards':
            document.querySelectorAll(".user-profile").forEach(function (el) {
                el.style.display = "none";
            });
            console.log("in rewards case statement");
            screenDiv.children[2].style.display = 'block'; // Show rewards screen
            for (let i = 0; i < screenDiv.children.length; i++) {
                if (i !== 2) {
                    screenDiv.children[i].style.display = 'none'; // Hide other screens
                }
            }
            break;
        case 'shop':
            console.log("in shop case statement");
            screenDiv.children[3].style.display = 'block'; // Show shop screen
            for (let i = 0; i < screenDiv.children.length; i++) {
                if (i !== 3) {
                    screenDiv.children[i].style.display = 'none'; // Hide other screens
                }
            }
            break;
        case 'account':
            console.log("in account case statement");
            screenDiv.children[4].style.display = 'block'; // Show account screen
            for (let i = 0; i < screenDiv.children.length; i++) {
                if (i !== 4) {
                    screenDiv.children[i].style.display = 'none'; // Hide other screens
                }
            }
            break;
        default:
            console.warn('Unknown icon name:', iconName);
    }
}


async function isAuthenticated(username, password) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'isAuthenticated'
            })
        });
        const data = JSON.parse(response);

        if (data.response.loggedIn) { // Use data.response instead of response
            // User is logged in, update UI accordingly
            console.log('Logged in user:', data.response.userData);

            globalUsername = data.response.userData.username;
            globalUserLoggedIn = data.response.loggedIn;
            getInitialUserData(globalUsername);

            //            $('#formSection').hide();

            // Display the app section
            //          $('#appSection').show();
        } else {
            // User is not logged in, show login button or form
        }
    } catch (error) {
        console.error('Error checking login:', error);
    }
}


function initializeLoginModalEventListeners() {

    // Login Form submission handling
    $('#loginForm1').off('submit').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        console.log("in #loginForm submit button event handler");

        // Get the form data
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        // Make an AJAX request to the server
        $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'login',
                username: username,
                password: password
            }),
            contentType: 'application/json',
            success: function (response) {
                const data = JSON.parse(response);
                console.log("login data", data);
                if (data.response.success) {
                    // Get user reward data and wait for it to finish
                    initializeApp().then(() => {
                        
                    }).catch(error => {
                        console.error('Error fetching rewards:', error);
                        $('#loginResponse').html('<p>Failed to load rewards data.</p>');
                    });
                    initializeApp();
                } else {
                    $('#loginResponse').html('<p>' + data.error + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#loginResponse').html('<p>An error occurred while processing your request.</p>');
            }
        });
    });

    // Logout button click handling

    $('#logoutButton').off('click').on('click', function (event) {
        event.preventDefault(); // Prevent the default button behavior

        console.log("in #logoutButton click event handler");

        // Make an AJAX request to the server
        $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'logout'
            }),
            contentType: 'application/json',
            success: function (response) {
                const data = JSON.parse(response);
                console.log("logout data", data);
                if (data.success) {
                    $('#logoutResponse').html('<p>Logout successful!</p>');

                    // Hide/show buttons and elements
                    document.getElementById('openLoginModal').style.display = 'block';
                    document.getElementById('logoutButton').style.display = 'none';

                    // Optionally show modal or redirect
                    $('.header').show();
                    $('#logoutButton').hide();
                    $('.user-profile').hide();
                    $('.rewards-profile-dashboard').hide();
                    $('.tabs').hide();
                } else {
                    $('#logoutResponse').html('<p>' + data.error + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#logoutResponse').html('<p>An error occurred while processing your request.</p>');
            }
        });
    });


}




