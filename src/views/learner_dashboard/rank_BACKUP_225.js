// rank.js

import { getUserAvatarUrl } from '../utils.js';

// Global variables to track the state
import appState from '../state.js';

let activeUsername = null;
// Function to load leaderboard data and update the tab content

function updateLeaderboardData(weekType = 'this_week') {
    console.log("in updateLeaderboard");

    try {
        //const data = leaderboardData.data; // Use the cached data
        const data = appState.gLeaderBoardData; // Use the cached data
        //const stats = lastTwoWeeksStatsData.data;
        const leaderboardContent = $('#rank-tab-content');
        const countdown = `
            <div class="countdown">
                <span id="countdown-timer"></span>                
            </div>
        `;
        leaderboardContent.html(countdown);

        // Show countdown or message
        if (weekType === 'this_week') {
            // Start the countdown
            //countdownTimer();
            showCurrentWeeklMessage();
        } else {
            showStatsAreFinalMessage();
        }

        const rankTitle = `
            <div class="rank-container">
                <div class="rank-header">
                <i class="fa fa-trophy    fa-2x" aria-hidden="true"></i>
                <h3>Leaderboard</h3>
            </div>
        `;


        data[weekType].forEach((user, index) => {
            const rank = index + 1;

            let leaderboardItem = `


                ${index < user.Bonus_rewards_available ? '<div class="winner-group">' : ''}
                <div class="leaderboard-item ${index < user.Bonus_rewards_available ? 'winner' : ''} ${user.username === data.this_week.username ? 'active-user' : ''}">
                    <span class="rank">${rank}</span>
                    <img src="${getUserAvatarUrl(user)}" alt="Avatar">
                    <span class="rank-xp">${user.Xp_total} XP</span>
                    <span class="rank-username">${user.username}</span>                    
        <span class="rank-icon-container">
            ${index < user.Bonus_rewards_available ? (weekType === 'last_week' ? `
                <a href="#" class="nav-link" data-icon="trophy" onclick="showRewards(event)">
                    <i class="fas fa-trophy" style="color: green;"></i>
                </a>
            ` : '<span class="winner-notification">in lead</span>') : ''}
            ${user.lessons_completed >= user.Lessons_required ? (weekType === 'last_week' ? `
                <a href="#" class="nav-link" data-icon="gift" onclick="showGift(event)">
                    <i class="fas fa-gift"></i>
                </a>
            ` : '<span class="winner-notification">-</span>') : ''}
        </span>
                </div>
                ${index === user.Bonus_rewards_available - 1 ? '</div>' : ''}
            `;

            if (index === user.Bonus_rewards_available - 1) {
                leaderboardItem = leaderboardItem.replace('<div', '<div style="border-bottom: 6px #CDE7FF solid;"');
            }
            leaderboardContent.append(leaderboardItem);
        });

        // Add user summary
        // TODO: let this code run on document loaded.  then when you click on the tab (after entering a username), i can highlight the row if you are in the top X users on the leaderboard and I can throw up the blue banner at the bottom with the details shown below.

        /*
        let activeUsername = stats[weekType].username;
        let activeUserXp = stats[weekType].Xp_total;
        let activeUserLessons = stats[weekType].lessons_completed;
        let activeUserDays = stats[weekType].days_with_lesson;;
        let activeUserPracticeTime = stats[weekType].practice_minutes;
        const userSummary = `
            <div class="user-summary">
                <span class="username" style="font-size: 24px; font-weight: bold; color: black;">${activeUsername}</span>
                <div class="user-stats">
                    <p><span class="stat-label">XP earned:</span> ${activeUserXp} XP</p>
                    <p><span class="stat-label">Lessons Completed:</span> ${activeUserLessons} lessons</p>
                    <p><span class="stat-label">Completion Days:</span> ${activeUserDays} days</p>
                    <p><span class="stat-label">Practice Time:</span> ${activeUserPracticeTime} minutes</p>
                </div>
            </div>
        `;
        // leaderboardContent.append(userSummary); // remove for now
        */

    } catch (e) {
        console.error('Error updating leaderboard:', e);
    }
}

export function updateLeaderboard(weekType = 'this_week') {

    // always update the top users list
    updateLeaderboardData(weekType);

    // if a search is active, highlight the user if in the top user's list and show the user-profile section at bottom

}

export function updateLeaderboard_orig(weekType = 'this_week') {
    console.log("in updateLeaderboard");

    try {
        //const data = leaderboardData.data; // Use the cached data
        const data = appState.gLeaderBoardData; // Use the cached data
        //const stats = lastTwoWeeksStatsData.data;
        const leaderboardContent = $('#rank-tab-content');
        const countdown = `
            <div class="countdown">
                <span id="countdown-timer"></span>                
            </div>
        `;
        leaderboardContent.html(countdown);

        // Show countdown or message
        if (weekType === 'this_week') {
            // Start the countdown
            //countdownTimer();
            showCurrentWeeklMessage();
        } else {
            showStatsAreFinalMessage();
        }

        const rankTitle = `
            <div class="rank-container">
                <div class="rank-header">
                <i class="fa fa-trophy    fa-2x" aria-hidden="true"></i>
                <h3>Leaderboard</h3>
            </div>
        `;


        data[weekType].forEach((user, index) => {
            const rank = index + 1;

            let leaderboardItem = `


                ${index < user.Bonus_rewards_available ? '<div class="winner-group">' : ''}
                <div class="leaderboard-item ${index < user.Bonus_rewards_available ? 'winner' : ''} ${user.username === data.this_week.username ? 'active-user' : ''}">
                    <span class="rank">${rank}</span>
                    <img src="${getUserAvatarUrl(user)}" alt="Avatar">
                    <span class="rank-xp">${user.Xp_total} XP</span>
                    <span class="rank-username">${user.username}</span>                    
        <span class="rank-icon-container">
            ${index < user.Bonus_rewards_available ? (weekType === 'last_week' ? `
                <a href="#" class="nav-link" data-icon="trophy" onclick="showRewards(event)">
                    <i class="fas fa-trophy" style="color: green;"></i>
                </a>
            ` : '<span class="winner-notification">in lead</span>') : ''}
            ${user.lessons_completed >= user.Lessons_required ? (weekType === 'last_week' ? `
                <a href="#" class="nav-link" data-icon="gift" onclick="showGift(event)">
                    <i class="fas fa-gift"></i>
                </a>
            ` : '<span class="winner-notification">-</span>') : ''}
        </span>
                </div>
                ${index === user.Bonus_rewards_available - 1 ? '</div>' : ''}
            `;

            if (index === user.Bonus_rewards_available - 1) {
                leaderboardItem = leaderboardItem.replace('<div', '<div style="border-bottom: 6px #CDE7FF solid;"');
            }
            leaderboardContent.append(leaderboardItem);
        });

        // Add user summary
        // TODO: let this code run on document loaded.  then when you click on the tab (after entering a username), i can highlight the row if you are in the top X users on the leaderboard and I can throw up the blue banner at the bottom with the details shown below.

        /*
        let activeUsername = stats[weekType].username;
        let activeUserXp = stats[weekType].Xp_total;
        let activeUserLessons = stats[weekType].lessons_completed;
        let activeUserDays = stats[weekType].days_with_lesson;;
        let activeUserPracticeTime = stats[weekType].practice_minutes;
        const userSummary = `
            <div class="user-summary">
                <span class="username" style="font-size: 24px; font-weight: bold; color: black;">${activeUsername}</span>
                <div class="user-stats">
                    <p><span class="stat-label">XP earned:</span> ${activeUserXp} XP</p>
                    <p><span class="stat-label">Lessons Completed:</span> ${activeUserLessons} lessons</p>
                    <p><span class="stat-label">Completion Days:</span> ${activeUserDays} days</p>
                    <p><span class="stat-label">Practice Time:</span> ${activeUserPracticeTime} minutes</p>
                </div>
            </div>
        `;
        // leaderboardContent.append(userSummary); // remove for now
        */

    } catch (e) {
        console.error('Error updating leaderboard:', e);
    }
}

function showRewards(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    document.querySelectorAll(".user-profile").forEach(function (el) {
        el.style.display = "none"; // Hide user profiles
    });
    console.log("Showing rewards screen");
    const screenDiv = document.getElementById("yourScreenDivId"); // Replace with your actual screen div ID
    screenDiv.children[2].style.display = 'block'; // Show rewards screen
    for (let i = 0; i < screenDiv.children.length; i++) {
        if (i !== 2) {
            screenDiv.children[i].style.display = 'none'; // Hide other screens
        }
    }
}




export async function updateLeaderboardAfterSearch(weekType = 'this_week', _searchedUsername = 'nobody') {
    console.log("in updateLeaderboard");

    
    let searchedUserData = appState.gLeaderBoardStatsForUser;
/*
    try {
        searchedUserData = await fetchUserStats(_searchedUsername);
        appState.gLoggedInUserStats = searchedUserData;
    } catch (error) {
        console.error('Error in fetchUserStats :', error);
    }
    */

    // Initialize searchedUsername with the provided username
    let searchedUsername = _searchedUsername;

    // If rank search is active, reset searchedUsername to "none"
    if (appState.gRankSearchActive) {
        searchedUsername = "none";
    }

    try {
        //const data = leaderboardData.data; // Use the cached data
        const data = appState.gLeaderBoardData; // Use the cached data
        //const stats = lastTwoWeeksStatsData.data;
        const stats = appState.gLeaderBoardData;
        const leaderboardContent = $('#rank-tab-content');
        //const weekEnds = 1725235200; // Sunday at midnight Alaska time
        let searchedUserRank = 0;
        const countdown = `
            <div class="countdown">
                <span id="countdown-timer"></span>                
            </div>
        `;
        leaderboardContent.html(countdown);

        // Show countdown or message
        if (weekType === 'this_week') {
            // Start the countdown
            //countdownTimer();
            showCurrentWeeklMessage();
        } else {
            showStatsAreFinalMessage();
        }

        //if (!stats[weekType]) {
        //    leaderboardContent.html('<p>Leaderboard is resetting for this week</p>');
        //    return;
        //}


        // Normalize the searched username to lowercase
        const normalizedSearchedUsername = searchedUsername.toLowerCase();

        // Check if the searched username is in the top 10
        let foundUser = false;
        //const topTenUsers = data[weekType].slice(0, 10);
        const topTenUsers = data[weekType].slice(0, appState.gNumUsersForLeaderBoard);

        topTenUsers.forEach((user, index) => {
            // Normalize the username from the database to lowercase
            const normalizedUsername = user.username.toLowerCase();
            const rank = index + 1;

            let leaderboardItem = `


                ${index < user.Bonus_rewards_available ? '<div class="winner-group">' : ''}
                <div class="leaderboard-item ${index < user.Bonus_rewards_available ? 'winner' : ''} ${user.username === stats.this_week.username ? 'active-user' : ''}">
                    <span class="rank">${rank}</span>
                    <img src="${getUserAvatarUrl(user)}" alt="Avatar">
                    <span class="rank-xp">${user.Xp_total} XP</span>
                    <span class="rank-username">${user.username}</span>                    
                    <span class="rank-icon-container">
                        ${index < user.Bonus_rewards_available ? (weekType === 'last_week' ? `
                            <span class="nav-link show-rewards" data-icon="trophy">
                                <i class="fas fa-trophy" style="color: green;"></i>
                            </span>
                        ` : '<span class="winner-notification">in lead</span>') : ''}
                        ${user.lessons_completed >= user.Lessons_required ? (weekType === 'last_week' ? `
                            <span class="nav-link show-gift" data-icon="gift">
                                <i class="fas fa-gift"></i>
                            </span>
                        ` : '<span class="winner-notification"></span>') : ''}
                    </span>

                </div>
                ${index === user.Bonus_rewards_available - 1 ? '</div>' : ''}
            `;

            if (index === user.Bonus_rewards_available - 1) {
                leaderboardItem = leaderboardItem.replace('<div', '<div style="border-bottom: 6px #CDE7FF solid;"');
            }
            leaderboardContent.append(leaderboardItem);

            if (normalizedUsername === normalizedSearchedUsername) {
                foundUser = true; // User is in top 10
                searchedUserRank = rank;
            }

            if (foundUser) {
                // Update the existing row with the username
                const leaderboardItem = document.querySelector(`.leaderboard-item[data-username="${searchedUsername}"]`);
                if (leaderboardItem) {
                    leaderboardItem.classList.add('active-user', 'yellow-halo');
                    // Center the row if it's found
                    centerRowInViewport(leaderboardItem);
                }
            }

        });

        // for now, always show the searched user in the user-rank-card
        // even if the searched used is in the top 10
        //foundUser = 0; // for testing BUDEBUG

        // If the searched username is not found, create a sticky row
        //if (!foundUser) {
        if (appState.gRankSearchActive) {
            let activeUsername = searchedUserData.data[weekType].username;
            let activeUserXp = searchedUserData.data[weekType].Xp_total;
            let activeUserLessons = searchedUserData.data[weekType].lessons_completed;
            let activeUserDays = searchedUserData.data[weekType].days_with_lesson;;
            let activeUserPracticeTime = searchedUserData.data[weekType].practice_minutes;
            let user = searchedUserData.data[weekType].practice_minutes;
            const userSummary = `
                <div class="user-summary">
                    <img src="${getUserAvatarUrl(stats[weekType])}" alt="Avatar" class="sticky-avatar"> 
                    <span class="username" style="font-size: 24px; font-weight: bold; color: black;">${activeUsername}</span>
                    <span class="winner-notification">10+</span> <!-- Notification -->
                    <div class="user-stats">
                        <p><span class="stat-label">XP earned:</span> ${activeUserXp} XP</p>
                        <p><span class="stat-label">Lessons Completed:</span> ${activeUserLessons} lessons</p>
                        <p><span class="stat-label">Completion Days:</span> ${activeUserDays} days</p>
                        <p><span class="stat-label">Practice Time:</span> ${activeUserPracticeTime} minutes</p>
                    </div>

                </div>
            `;
            //leaderboardContent.append(userSummary);

            // If the searched username is not found, create a sticky row
            if (!foundUser) {
                const stickyRow = `
                    <div class="leaderboard-item sticky-row">
                        <span class="rank">--</span>
                        <img src="${getUserAvatarUrl(searchedUserData.data[weekType])}" alt="Avatar" class="sticky-avatar"> 
                        <span class="rank-xp">0 XP</span> <!-- Default XP value -->
                        <span class="rank-username">${searchedUsername}</span>
                        <span class="winner-notification">Not in top 10</span> <!-- Notification -->
                    </div>
                `;
                //leaderboardContent.append(stickyRow); // highlights blue the row that is pinned to the bottom as 11th row
            }

            const userRankCardContainer = $('.user-rank-card'); // Select the existing user-rank-card div

            let rankText;
            const weekLabel = weekType === "this_week" ? "This Week" : "Last Week";
            if (foundUser) {
                //rankText = "Currently Rank " + searchedUserRank; 
                rankText = `${weekLabel}: Rank ${searchedUserRank}`;
            } else {
                //rankText = "Currently Rank 10+";
                rankText = `${weekLabel}:    Rank 10+`;
            }

            const stickyRow = `
                    <div id="userAvatar">
                    <img src="${getUserAvatarUrl(searchedUserData.data[weekType])}" alt="Avatar" class="sticky-avatar"> 

                    </div>
                    <div class="user-details">
                        <div>
                            <div>
                                <div class="username">${activeUsername}</div>
                                <div class="rankText">${rankText}</div> <!-- Change this line -->
                                <!--<p>Level 30</p>-->
                            </div>
                            <!--<div class="xp-bar">
                                <div class="xp-progress"></div>
                            </div>-->
                        </div>
                        <div>
                            <div class="xp-score">
                                <span class="xp-value">${activeUserXp}</span> 
                                <span class="xp-label">XP</span>
                            </div>
                        </div>
                    </div>

            `;

            if (appState.gRankSearchActive) {
                //leaderboardContent.append(stickyRow);
                userRankCardContainer.html(stickyRow);
                $('.user-rank-card').css('display', 'flex');
            }


            //} // if (!foundUser)

            const activeUserSummary = `
            <div class="user-summary">
                <span class="username" style="font-size: 24px; font-weight: bold; color: black;">${activeUsername}</span>
                <div class="user-stats">
                    <p><span class="stat-label">XP earned:</span> ${activeUserXp} XP</p>
                    <p><span class="stat-label">Lessons Completed:</span> ${activeUserLessons} lessons</p>
                    <p><span class="stat-label">Completion Days:</span> ${activeUserDays} days</p>
                    <p><span class="stat-label">Practice Time:</span> ${activeUserPracticeTime} minutes</p>
                </div>
            </div>
            `;
            //leaderboardContent.append(activeUserSummary);
        }

    } catch (e) {
        console.error('Error updating leaderboard:', e);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for showRewards
    document.querySelectorAll('.show-rewards').forEach(item => {
        item.addEventListener('click', (event) => {
            showRewards(event); // Call your function
        });
    });

    // Add event listener for showGift (if needed)
    document.querySelectorAll('.show-gift').forEach(item => {
        item.addEventListener('click', (event) => {
            showGift(event); // Call your function
        });
    });
});


function centerRowInViewport_orig(rowElement) {
    const rect = rowElement.getBoundingClientRect();
    const rowHeight = rect.height;

    // Calculate the offset to center it in the viewport
    const centerOffset = window.innerHeight / 2 - rowHeight / 2;

    // Scroll the sticky row into view
    window.scrollTo({
        top: window.scrollY + rect.top + centerOffset,
        behavior: 'smooth' // Smooth scrolling
    });
}

function centerRowInViewport(searchedUsername) {
    const leaderboardItem = document.querySelector(`.leaderboard-item[data-username="${searchedUsername}"]`);

    if (leaderboardItem) {
        leaderboardItem.classList.add('active-user', 'yellow-halo');

        // Center the row
        const rowHeight = leaderboardItem.clientHeight;
        const centerOffset = (window.innerHeight / 2) - (rowHeight / 2);

        // Scroll to center
        window.scrollTo({
            top: leaderboardItem.offsetTop + centerOffset,
            behavior: 'smooth'
        });
    } else {
        console.error("Leaderboard item not found.");
    }
}

export function cacheLeaderboardDataLastTwoWeeks(num_users = 10) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'index.php',
            type: 'GET',
            data: {
                controller: 'LearnerDashboardController',
                action: 'GetLastTwoWeeksLeaderboard',
                num_users: num_users
            }
        })
            .done(response => {
                try {
                    const data = JSON.parse(response);
                    if (data.success) {
                        leaderboardData = data;
                        resolve(); // Resolve the promise on success
                    } else {
                        reject(new Error(data.error)); // Reject the promise on server error
                    }
                } catch (e) {
                    reject(e); // Reject the promise on JSON parsing error
                }
            })
            .fail((xhr, status, error) => {
                reject(new Error(`AJAX Error: ${status} ${error}`)); // Reject the promise on AJAX error
            });
    });
}

function highlightUserShowDetails() {
}

/**
 * This function calculates the Unix timestamp for the next Monday at 7:59:59 AM GMT.
 * It ensures the countdown timer is accurate regardless of the user's local time zone.
 * 
 * Steps:
 * 1. Get the current date and time.
 * 2. Calculate the number of days until the next Monday.
 * 3. Set the time to 7:59:59 AM GMT on that Monday.
 * 4. Convert this date and time to a Unix timestamp in seconds.
 * 
 * The countdownTimer function:
 * 1. Gets the current time in seconds since the Unix epoch.
 * 2. Retrieves the user's local time offset from GMT in seconds.
 * 3. Adjusts the time remaining calculation to account for the user's local time zone.
 * 4. Updates the countdown timer element every second with the remaining time.
 * 5. Clears the interval and displays "Time's up!" when the countdown reaches zero.
 */

function getNextMondayTimestamp_old() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const daysUntilNextMonday = (8 - dayOfWeek) % 7; // Calculate days until next Monday
    const nextMonday = new Date(now.getTime() + daysUntilNextMonday * 86400000); // Add days to current date
    nextMonday.setUTCHours(7, 59, 59, 0); // Set time to 7:59:59 AM GMT
    return Math.floor(nextMonday.getTime() / 1000); // Convert to Unix timestamp in seconds
}


// this is the Meta version, using a solution that works in the Controller for calculating the week epochs
function getNextMondayTimestamp() {
    const now = new Date();
    const gmtDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 8, 0, 0); // 8am GMT
    const day = gmtDate.getUTCDay();
    if (day !== 1) { // If not Monday, move to next Monday
        gmtDate.setUTCDate(gmtDate.getUTCDate() + (8 - day));
    }
    return gmtDate.getTime() / 1000; // Return timestamp in seconds
}


function countdownTimer() {
    const countdownTimerElement = $('#countdown-timer');
    const weekEndsGMT = getNextMondayTimestamp();
    const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const localOffset = new Date().getTimezoneOffset() * 60; // Get local time offset in seconds
        const timeRemaining = weekEndsGMT - (now + localOffset); // Adjust for local time
        const days = Math.floor(timeRemaining / 86400);
        const hours = Math.floor((timeRemaining % 86400) / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        countdownTimerElement.text(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        if (timeRemaining <= 0) {
            clearInterval(interval);
            countdownTimerElement.text('Time\'s up!');
        }
    }, 1000);
}


<<<<<<< HEAD
=======
function showCurrentWeeklMessage() {
    const countdownTimerElement = $('#countdown-timer');
    countdownTimerElement.text('Week ends Sunday at 11:59pm PST');

    // Apply CSS styles
    countdownTimerElement.css({
        'color': '#71AFFF',
        'font-weight': 'normal'
    });
}

function showStatsAreFinalMessage() {
    const countdownTimerElement = $('#countdown-timer');
    countdownTimerElement.text('These Stats are Final');

    // Apply CSS styles
    countdownTimerElement.css({
        'color': '#28A745',
        'font-weight': 'bold'
    });
}




// Example usage: Set weekEnds to the desired Unix timestamp
// For 7:59:59 AM GMT on Monday, convert the date to Unix timestamp
// E.g., const weekEnds = new Date('2024-09-02T07:59:59Z').getTime() / 1000; // Adjust date as needed



>>>>>>> app-dev/006-new-overall-state-machine


// Call the function when this script is loaded
$(document).ready(function () {
    //updateLeaderboard(); 
    cacheLeaderboardDataLastTwoWeeks();
});