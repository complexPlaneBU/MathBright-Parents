// home.js

import { updateRaffleTickets } from '../learner_dashboard/raffle.js';
import { renderRaffleHTML } from '../learner_dashboard/raffle.js';
import { updateLeaderboard } from '../learner_dashboard/rank.js';
import { updateLeaderboardAfterSearch } from '../learner_dashboard/rank.js';
import { cacheLeaderboardDataLastTwoWeeks } from '../learner_dashboard/rank.js';
import { updateLearningGems } from '../learner_dashboard/gems.js';
import { renderGemsHTML } from '../learner_dashboard/gems.js';
import { updateLessons } from '../learner_dashboard/lessons.js';
import { renderLessonsHTML } from '../learner_dashboard/lessons.js';


// Global variables to track the state
import appState from '../state.js';

let gActiveWeek = 'this_week'; // Default to 'this_week'
let gActiveTab = 'rank-tab'; // Default to 'rank-tab'
let gRankSearchActive = false; // Default to 'rank-tab'
let gSearchedUsername = 'none';

// Get the Home button and Rank tab content
const homeButton = document.querySelector('.bottom-nav button:nth-child(1)');

// Add an event listener to the Home button
homeButton.addEventListener('click', () => {
    const lessonsTabContent = document.getElementById('lessons-tab-content');
    const rankTabContent = document.getElementById('rank-tab-content');

    // Toggle the active class on the tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById('rank-tab').classList.add('active');

    // Toggle the active class on the week tabs
    //document.querySelectorAll('.week-tab').forEach(weekTab => weekTab.classList.remove('active'));
    //document.getElementById('this-week-tab').classList.add('active');

    // Hide all tab content and show the Rank tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    rankTabContent.classList.add('active');
});


export function renderHomeScreenHTML() {
    const html = `
        <div class="leaderboard-container">
            <div id="leaderboard-header">
                <!-- Text Logo -->
                <h1 class="text-logo">M<span class="logoA-homescreen">∂</span>thBright</h1>
            
                <!-- Search Bar -->
                <div class="username-search">
                    <input type="text" id="usernameInput" placeholder="Type Username Here">
                    <button id="searchButton">Go</button>
                </div>


                <!-- Week Tabs -->
                <div class="week-tabs">
                    <button class="week-tab" id="last-week-tab" >Last Week</button>
                    <button class="week-tab active" id="this-week-tab" >This Week</button>
                </div>

                <!-- Tabbed Interface -->
                <div class="tabs">
                    <div class="tab" id="lessons-tab" >Lessons</div>
                    <div class="tab inactive" id="gems-tab" >Gems</div>
                    <div class="tab active" id="rank-tab" >Rank</div>
                    <div class="tab inactive" id="raffle-tab" >Raffle</div>
                </div>
            </div>

            <!-- Tab Content Containers -->
            <div class="tab-content active" id="rank-tab-content">
                <!-- Rank content will be dynamically populated -->
            </div>
            <div class="tab-content" id="lessons-tab-content">
                <!-- Lessons content will be dynamically populated -->
            </div>
            <div class="tab-content" id="gems-tab-content">
                <!-- Gems content will be dynamically populated -->
            </div>
            <div class="tab-content" id="raffle-tab-content">
                <!-- Raffle content will be dynamically populated -->
            </div>
            <div class="user-rank-card">
                <!-- User Card XP info content will be dynamically populated -->
            </div>
        </div>
    `;
    const homeScreen = document.querySelector('#home_screen');
    homeScreen.innerHTML = html;
}



async function searchUsername() {
    console.log("in searchUsername");
    const username = document.getElementById('usernameInput').value;
    appState.gSearchedUsername = username;
    appState.gRankSearchActive = true;

    if (!username) {
        alert('Please enter a username!');
        return;
    }

    try {
        appState.gLeaderBoardStatsForUser = await getPublicUserData(username);
        // If you need to do something with the returned data

        //updateLeaderboard(/*week*/);
        updateTabContent(appState.gActiveWeek);
        //updateLeaderboardAfterSearch(appState.gActiveWeek, username);

        console.log("User data:", appState.gLeaderBoardStatsForUser);

        // Optionally update the UI or handle the response here
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert('Failed to retrieve user data. Please try again.');
    }
}


async function getPublicUserData(username) {
    try {
        const response = await $.ajax({
            url: 'index.php',
            type: 'GET',
            data: {
                controller: 'LearnerDashboardController',
                action: 'GetLastTwoWeeksStatsByUsername',
                username: username,
            },
        });

        const data = JSON.parse(response);

        if (data.success) {
            return data; // Return the data if successful
        } else {
            console.error(data.error);
            throw new Error(data.error); // Throw an error if not successful
        }
    } catch (error) {
        console.error('AJAX Error: ', error);
        throw error; // Rethrow the error to be caught in searchUsername
    }
}





//==============================
// From Original learner_dashboard.js being moved to home.js (this is now called a screen)



function updateTabContent(week) {
    //let d = lastTwoWeeksStatsData.data[week];
    let d = appState.gLeaderBoardData[week];

    console.log("...APP STATE =", JSON.stringify(appState, null, 2));


    // this is my simple way of making sure the user-rank-card is udpated without creating
    // an overall statemachine.  this is tech debt.
    /*
    if (appState.gRankSearchActive) {
        updateLeaderboardAfterSearch(week, appState.gSearchedUsername)
    }
    */

    if ($('#rank-tab').hasClass('active')) {
        updateLeaderboardAfterSearch(week, appState.gSearchedUsername)
        /*
        if (appState.gRankSearchActive) {
            updateLeaderboardAfterSearch(week, appState.gSearchedUsername)
        } else {
            updateLeaderboard(week);
        }
        */
    }
    if ($('#raffle-tab').hasClass('active')) {
        updateRaffleTickets(week);
    }
    if ($('#gems-tab').hasClass('active')) {
        updateLearningGems(week);
    }
    if ($('#lessons-tab').hasClass('active')) {
        updateLessons(week);
    }
}
export function createTabEventListiners() {



    // Week-tab click event listener
    $('.week-tab').on('click', function () {
        // Remove active class from all week-tabs
        $('.week-tab').removeClass('active');
        // Add active class to the clicked week-tab
        $(this).addClass('active');


        // Update active week variable
        appState.gActiveWeek = $(this).attr('id') === 'this-week-tab' ? 'this_week' : 'last_week';
        updateTabContent(appState.gActiveWeek);
    });




    // Main tab click event listener
    $('.tab').on('click', function () {
        const tabId = $(this).attr('id');
        const tabContentId = `#${tabId}-content`;

        // Remove active class from all tabs, tab contents, and week-tabs
        $('.tab').removeClass('active');
        $('.tab-content').removeClass('active');

        // Add active class to the clicked tab, the corresponding tab content, and week-tabs
        $(this).addClass('active');
        $(tabContentId).addClass('active');

        // Update active tab variable
        gActiveTab = tabId;

        // Update content based on active week
        updateTabContent(appState.gActiveWeek);
    });

    initializeDefaultTab();

}


function initializeDefaultTab() {
    // Initialize default tab content
    const defaultTab = document.querySelector('.tab.active');
    if (defaultTab) {
        const defaultContentId = `#${defaultTab.id}-tab-content`;
        const defaultContentElement = document.querySelector(defaultContentId);
        if (defaultContentElement) {
            defaultContentElement.classList.add('active');
        }
    }
}


// everytime a user clicks submit, we need to update all of the tabs.
export async function updateHomeScreen() {
    console.log("in updateHomeScreen");
    renderHomeScreenHTML(); // has to be first.
    renderRaffleHTML();
    renderLessonsHTML();
    renderGemsHTML();
    console.log("lastTwoWeeksStatsData =", lastTwoWeeksStatsData);
    //await cacheLeaderboardDataLastTwoWeeks(); // Wait for the promise to resolve
    //updateLeaderboard('this_week'); // Now it's safe to update the tabs
    //updateLeaderboardAfterSearch('this_week','none'); // Now it's safe to update the tabs
    updateRaffleTickets('this_week');
    updateLearningGems('this_week');
    updateLessons('this_week');
    //updateLearningGems()
    $('#this-week-tab').addClass('active');
    $('#last-week-tab').removeClass('active');
    createTabEventListiners();
    document.getElementById('searchButton').addEventListener('click', searchUsername);

}

export async function initialize() {
    renderHomeScreenHTML(); // has to be first.
    renderRaffleHTML();
    renderLessonsHTML();
    renderGemsHTML();
    $('#this-week-tab').addClass('active');
    $('#last-week-tab').removeClass('active');
    createTabEventListiners();
    document.getElementById('searchButton').addEventListener('click', searchUsername);

}



