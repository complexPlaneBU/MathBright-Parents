// rank.js

import { getUserAvatarUrl } from '../utils.js';

let activeUsername = null;
// Function to load leaderboard data and update the tab content
function updateLeaderboard(weekType = 'this_week') {
    return $.ajax({
        url: 'index.php',
        type: 'GET',
        data: {
            controller: 'LearnerDashboardController',
            action: 'GetLeaderboard',
            num_users: 10,
            week_start_epoch: 1724659200,
            week_type: weekType  // Pass "this_week" or "next_week" as a parameter
        }
    }).done(response => {
        try {
            console.log("Response = " + response);
            const data = JSON.parse(response); // Attempt to parse JSON
            console.log(data);
            if (data.success) {
                const leaderboardContent = $('#rank-tab-content');
                const weekEnds = 1725235200; // Sunday at midnight Alaska time
                const countdown = `
                    <div class="countdown">
                        Time remaining: <span id="countdown-timer"></span>
                        The week finishes on Sunday at midnight, Alaska time.
                    </div>
                `;
                leaderboardContent.html(countdown);
                data.data.forEach((user, index) => {
                    console.log(user.username);
                    const rank = index + 1;
                    let leaderboardItem = `
                        ${index < user.Bonus_rewards_available ? '<div class="winner-group">' : ''}
                        <div class="leaderboard-item ${index < user.Bonus_rewards_available ? 'winner' : ''} ${user.username === activeUsername ? 'active-user' : ''}">
                            <span class="rank">${rank}</span>
                            <img src="${getUserAvatarUrl(user)}" alt="Avatar">
                            <span class="rank-xp">${user.xp_total} XP</span>
                            <span class="rank-username">${user.username}</span>
                            ${index < user.Bonus_rewards_available ? (weekType === 'last_week' ? '<span class="winner-notification">Winner!</span>' : '<span class="winner-notification">in lead</span>') : ''}
                        </div>
                        ${index === user.Bonus_rewards_available - 1 ? '</div>' : ''}
                    `;
                    console.log("bonus avail: " + user.Bonus_rewards_available);
                    if (index === user.Bonus_rewards_available - 1) {
                        leaderboardItem = leaderboardItem.replace('<div', '<div style="border-bottom: 6px #CDE7FF solid;"');
                    }
                    leaderboardContent.append(leaderboardItem);
                });

                // Add user summary 
                // TODO: let this code run on document loaded.  then when you click on the tab (after entering a username), i can highlight the row if you are in the top X users on the leaderboard and I can throw up the blue banner at the bottom with the details shown below.

                let activeUserXp = 100;
                let activeUserLessons = 4;
                let activeUserDays = 4;
                let activeUserPracticeTime = 30;
                const userSummary = `
                    <div class="user-summary" style="position: sticky; bottom: 0;">
                        <span class="username" style="font-size: 24px; font-weight: bold; color: black;">${activeUsername}</span>
                        <div class="user-stats">
                            <p><span class="stat-label">XP earned:</span> ${activeUserXp} XP</p>
                            <p><span class="stat-label">Lessons Completed:</span> ${activeUserLessons} lessons</p>
                            <p><span class="stat-label">Completion Days:</span> ${activeUserDays} days</p>
                            <p><span class="stat-label">Practice Time:</span> ${activeUserPracticeTime}</p>
                        </div>
                    </div>
                `;
                leaderboardContent.append(userSummary);
                countdownTimer(weekEnds);
            } else {
                console.error('Server Error for rank:', data.error);
            }
        } catch (e) {
            console.error('JSON Parsing Error:', e);
            console.error('Raw Response:', response);
        }
    }).fail((xhr, status, error) => {
        console.error('AJAX Error:', status, error);
    });
}

function highlightUserShowDetails() {
}

function countdownTimer(weekEnds) {
    const countdownTimerElement = $('#countdown-timer');
    const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const timeRemaining = weekEnds - now;
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




// Call the function when this script is loaded
$(document).ready(function () {
    updateLeaderboard(); 
});