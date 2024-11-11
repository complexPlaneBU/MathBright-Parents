let DEBUG_DATA = 1;
import { getUserAvatarUrl } from './utils.js';
import { updateHomeScreen } from './screens/home.js';
import { initialize as rewardsInitialize } from './screens/rewards.js';
import { getRewardsInfoForUser } from './screens/rewards.js';
import { updateRewardsScreen } from './screens/rewards.js';
import { updateRewardsDashboard } from './screens/rewards.js';
import { initialize as hometInitialize } from './screens/home.js';
import { updateLeaderboard } from './learner_dashboard/rank.js';
import { updateLeaderboardAfterSearch } from './learner_dashboard/rank.js';

import appState from './state.js';

window.lastTwoWeeksStatsData = null; // Make it a global variable
window.leaderboardData = null; // Make it a global variable
window.globalUsername = null; // Make it a global variable
window.globalUserLoggedIn = null; // Make it a global variable
window.globalRewardsData = null; // Make it a global variable

    document.addEventListener('DOMContentLoaded', async function () {
        initializeApp();
    })

async function updateApp() {
    try {
        // Fetch leaderboard data
        await fetchLeaderboardData(appState.gNumUsersForLeaderBoard);

        // Fetch rewards cards
        await fetchRewardsCards();

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

        // Hide splash screen and show leaderboard
        //updateHomeScreen(); // in home.js
        //rewardsInitialize();

        //initializeLoginModalEventListeners();
        //updateRewardsScreen();

        // Load app data
        // const initDataPromise = initializeAppData();




        // Stop animations when data loading completes

    } catch (error) {
        console.error('Error Updating App:', error);
    }
}

async function initializeApp() {

    const logoA = document.querySelector('.partial-derivative-logo');
    const textLogo = document.querySelector('.text-logo');
    const appSection = document.getElementById('appSection');
    const splashScreen = document.getElementById('splashScreen');

    // Start bounce-in animation immediately
    logoA.style.animation = 'bounceIn 3s ease-out forwards';

    logoA.addEventListener('animationend', () => {
        textLogo.style.animation = 'throb 4s ease-in-out infinite';
    });

    try {
        await updateApp();           
    } catch (error) {
        console.error('Error Initializing App:', error);
    } finally {
        // Stop animations when data loading completes
        textLogo.style.animation = 'none';
        splashScreen.style.display = 'none';
        appSection.style.display = 'block';
    }

}

    async function displayPrivateRewardsSection() {
        // Now that we know the user is logged in, update the UI
        $('#loginModal').hide();
        //$('.header').hide();
        $('#logoutButton').show();
        $('#openLoginModal').hide();
        $('.rewards-profile-dashboard').css({
            display: 'flex'
        }).show();
        $('.tabs').css('top', '0').show();
        $('.overlay').hide(); 
    }

    async function fetchLeaderboardData(num_users = 10) {
        try {
            const response = await $.ajax({
                url: 'index.php',
                type: 'GET',
                data: {
                    controller: 'LearnerDashboardController',
                    action: 'GetLastTwoWeeksLeaderboard',
                    num_users: num_users,
                },
            });
            const data = JSON.parse(response);
            if (data.success) {
                appState.gLeaderBoardData = data.data;
            } else {
                // do nothing so it uses the cached leaderboard data
            }
            console.log('fetchLeaderboardData:', data.success);
        } catch (error) {
            console.error('Leaderboard data fetch error:', error.message);
        }
    }


    async function fetchRewardsCards() {
        try {
            const response = await $.ajax({
                url: 'index.php',
                type: 'GET',
                data: {
                    controller: 'RewardsController',
                    action: 'getRewardCards'
                },
            });
            const data = JSON.parse(response);
            if (data.success) {
                appState.gRewardsCards = data.rewardCards;
            } else {
                // do nothing so it uses the cached rewardcards data
            }
            console.log('fetchLeaderboardData:', data.success);
        } catch (error) {
            console.error('Leaderboard data fetch error:', error.message);
        }
    }

    async function fetchUserStats(username) {
        try {
            const response = await $.ajax({
                url: 'index.php',
                type: 'GET',
                data: {
                    controller: 'LearnerDashboardController',
                    action: 'GetLastTwoWeeksUserStats',
                    username: username
                },
            });
            const data = JSON.parse(response);
            if (data.success) {
                return { data: data.data, error: null };
            } else {
                return { data: null, error: 'Failed to fetch user stats' };
            }
        } catch (error) {
            console.error('Leaderboard data fetch error:', error.message);
            return { data: null, error: error.message };
        }
    }


    async function isAnyoneLoggedIn() {
        try {
            const response = await $.ajax({
                type: 'POST',
                url: 'index.php',
                data: JSON.stringify({  // Convert data to JSON string
                    controller: 'LoginController',
                    action: 'isAuthenticated'
                }),
                contentType: 'application/json'  // Set content type
            });

            const data = JSON.parse(response);
            if (data.response.loggedIn) {
                appState.gLoggedIn = 1;
                appState.gLoggedInUsername = data.response.userData.username;
                return data.response;
            }
            console.log('isAnyoneLoggedIn:', data.success);
        } catch (error) {
            console.error('Login check error:', error.message);
        }

        return false; // default return value
    }

    async function renderHomeScreen() {
        hometInitialize();
    }

    async function renderRewardsScreen() {
        rewardsInitialize();
        updateRewardsScreen();

    }

export async function checkUserAuthentication_modelingafter(username) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'isAuthenticated', // Action for checking authentication
                username: username // Include the username to check against
            }),
            contentType: 'application/json',
            dataType: 'json' // Expecting JSON response from the server
        });

        // Check the response to see if the user is authenticated
        if (response.response.loggedIn) {
            // User is authenticated
            console.log('User is authenticated:', response);
            updateUserDataIfLoggedIn();
            return response; // Return response for further handling
        } else {
            // User is not authenticated
            console.log('User is not authenticated:', response.error);
            return response; // Return response to handle any errors
        }
    } catch (error) {
        console.error('Error checking user authentication:', error, error.stack, error.message, error.responseText);
        throw error; // Re-throw the error for the caller to handle
    }
}

function initializeAppData() {
    return new Promise((resolve, reject) => {
        console.log('Before getting username:', $('#username').val());

        let username = "t2";
        if (globalUserLoggedIn) {
            //username = globalUsername;
        } 
        console.log('Username:', username);
        console.log("From Form Submission, username = ", username);

        // Chain the Promises and resolve when all are complete
        getInitialUserData(username)
            .then(() => getRewardsInfoForUser(username))
            .then(() => {
                rewardsInitialize(username);
                initializeLoginModalEventListeners();
                updateRewardsScreen();
                resolve(); // Resolve the Promise when everything is done
            })
            .catch(error => {
                console.error('Error initializing app data:', error);
                reject(error); // Reject the Promise if any error occurs
            });
    });
}


function updateUserDataIfLoggedIn_old() {
    $('#loginModal').hide();
    //$('.header').hide();
    $('#logoutButton').show();
    $('#openLoginModal').hide();
    $('.rewards-profile-dashboard').css({
        display: 'flex'
    }).show();
    $('.tabs').css('top', '0').show();
    $('.overlay').hide(); // Show the overlay
}


function updateUserDataIfLoggedIn(username) {
    getInitialUserData(username)
        .then(() => {
            // Call the function to update the rewards screen
            updateRewardsScreen();

            // Now that we know the user is logged in, update the UI
            $('#loginModal').hide();
            //$('.header').hide();
            $('#logoutButton').show();
            $('#openLoginModal').hide();
            $('.rewards-profile-dashboard').css({
                display: 'flex'
            }).show();
            $('.tabs').css('top', '0').show();
            $('.overlay').hide(); // Show the overlay
        })
        .catch(error => {
            console.error('Error updating user data:', error);
            // Optionally handle errors here
        });
}



// Utility function for delaying execution
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }





async function getInitialUserData(username) {
    return $.ajax({
        url: 'index.php',
        type: 'GET',
        data: {
            controller: 'LearnerDashboardController',
            action: 'GetLastTwoWeeksStatsByUsername',
            username: username,
        },
    })
        .then(function (response) {
            // Hide the form section
            $('#formSection').hide();

            // Display the app section
            $('#appSection').show();

            // Update the DOM with the server response
            const data = JSON.parse(response);
            if (data.success) {
                lastTwoWeeksStatsData = data;

                // update all the tabs and header section
                //updateHeaderSection();
                updateHomeScreen(); // in home.js
                //updateRewardsScreen();

                if (typeof DEBUG_DATA !== 'undefined') {
                    // Display additional data if available
                    const testDataDiv = document.getElementById('profile_screen'); // for debug, for now
                    if (testDataDiv) {
                        testDataDiv.innerHTML = '';
                        Object.keys(data.data.last_week).forEach(key => {
                            const value = data.data.last_week[key];
                            const paragraph = document.createElement('p');
                            paragraph.textContent = `${key}: ${value}`;
                            testDataDiv.appendChild(paragraph);
                        });
                    }
                }
                if (typeof DEBUG_DATA !== 'undefined') {
                    $('#results').html('<p> this is the results section </p>');
                }
            } else {
                console.error(data.error);
                if (typeof DEBUG_DATA !== 'undefined') {
                    $('#results').html('<p>' + data.error + '</p>');
                }
            }
        })
        .catch(function (xhr, status, error) {
            console.error('AJAX Error: ', status, error);
            $('#results').html('<p>An error occurred while processing your request.</p>');
        });
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

<<<<<<< HEAD
        // Remove active class from all tabs, tab contents, and week-tabs
        $('.tab').removeClass('active');
        $('.tab-content').removeClass('active');
        //$('.week-tab').removeClass('active');
=======
            globalUsername = data.response.userData.username;
            globalUserLoggedIn = data.response.loggedIn;
            getInitialUserData(globalUsername);
>>>>>>> app-dev/006-new-overall-state-machine

//            $('#formSection').hide();

            // Display the app section
  //          $('#appSection').show();
        } else {
<<<<<<< HEAD
            $('.week-tabs').hide();
        }
        */
    });

    // Add event listener to week-tabs
    $('.week-tab').on('click', function () {
        // Remove active class from all week-tabs
        $('.week-tab').removeClass('active');
        // Add active class to the clicked week-tab
        $(this).addClass('active');
    });

    // Add event listener to rank-sub-tabs
    $('.rank-sub-tab').on('click', function () {
        // Remove active class from all rank-sub-tabs
        $('.rank-sub-tab').removeClass('active');
        // Add active class to the clicked rank-sub-tab
        $(this).addClass('active');
    });

 
    // Add event listeners to sub-tabs
    $('#this-week-tab').click(function () {
        $(this).addClass('active');
        $('#last-week-tab').removeClass('active');
        updateLeaderboard(); // Call updateLeaderboard with this week's data
    });

    $('#last-week-tab').click(function () {
        $(this).addClass('active');
        $('#this-week-tab').removeClass('active');
        updateLeaderboard('last_week'); // Call updateLeaderboard with last week's data
    });

    // Add active class to the clicked week-tab
    $('.week-tab').removeClass('active');
    $(this).addClass('active');

    // Initialize "This Week" tab as active
    $('#this-week-tab').addClass('active');

    // Initialize default tab content
    const defaultTab = document.querySelector('.tab.active');
    if (defaultTab) {
        const defaultContentId = `#${defaultTab.id}-tab-content`;
        const defaultContentElement = document.querySelector(defaultContentId);
        if (defaultContentElement) {
            defaultContentElement.classList.add('active');
=======
            // User is not logged in, show login button or form
>>>>>>> app-dev/006-new-overall-state-machine
        }
    } catch (error) {
        console.error('Error checking login:', error);
    }
}

export async function checkUserAuthentication(username) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'isAuthenticated', // Action for checking authentication
                username: username // Include the username to check against
            }),
            contentType: 'application/json',
            dataType: 'json' // Expecting JSON response from the server
        });

        // Check the response to see if the user is authenticated
        if (response.response.loggedIn) {
            // User is authenticated
            console.log('User is authenticated:', response);
            updateUserDataIfLoggedIn();
            return response; // Return response for further handling
        } else {
            // User is not authenticated
            console.log('User is not authenticated:', response.error);
            return response; // Return response to handle any errors
        }
    } catch (error) {
        console.error('Error checking user authentication:', error, error.stack, error.message, error.responseText);
        throw error; // Re-throw the error for the caller to handle
    }
}


function initializeLoginModalEventListeners() {
    // Open modal
    $('#openLoginModal').on('click', function () {
        $('#loginModal').show();
        $('.overlay').show(); // Show the overlay
    });

    // Close modal
    $('.modal-close').on('click', function () {
        $('#loginModal').hide();
        $('.overlay').hide(); // Hide the overlay
    });

    // Close modal when clicking outside of it
    $(window).on('click', function (event) {
        if ($(event.target).is('.overlay')) {
            $('#loginModal').hide();
            $('.overlay').hide(); // Hide the overlay
        }
    });



    // Login Form submission handling
    $('#loginForm').off('submit').on('submit', function (event) {
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

                    /*
                    getRewardsInfoForUser(username).then(() => {
                        
                        // Update rewards screen with user rewards data
                        updateUserDataIfLoggedIn(username);


                        $('#loginResponse').html('<p>Login successful!</p>');
                        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                            // Hide the login message after 1 second
                            $('#loginResponse').html('');

                            // Hide the login button
                            document.getElementById('openLoginModal').style.display = 'none';
                            // Optionally, show a logout button
                            document.getElementById('logoutButton').style.display = 'block';

                            // Original stuff to hide/show
                            $('#loginModal').hide();
                            $('#logoutButton').show();
                            $('.rewards-profile-dashboard').css({
                                display: 'flex'
                            }).show();
                            $('.tabs').css('top', '0').show();
                            $('.overlay').hide(); // Show the overlay
                        });
                        */
                        
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





function updateHeaderSection() {
    console.log("in updateHeaderSection");

    const thisWeekData = lastTwoWeeksStatsData.data.this_week;
    const lastWeekData = lastTwoWeeksStatsData.data.last_week;

    let data = thisWeekData ? thisWeekData : lastWeekData;

    if (data) {
        const xpTotal = data.Xp_total;
        $('.xp-value').text(xpTotal);

        // Display user information
        $('.username').text(data.username);

        // Get and display the user avatar
        const avatarUrl = getUserAvatarUrl(data);
        $('#userAvatar img').attr('src', avatarUrl);
    } else {
        console.log('No weekly data available');
    }
}


document.querySelectorAll('.bottom-nav button').forEach(button => {
    button.addEventListener('click', handleMenuIconClick);
});



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
        case 'profile':
            console.log("in profile case statement");
            screenDiv.children[4].style.display = 'block'; // Show profile screen
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
