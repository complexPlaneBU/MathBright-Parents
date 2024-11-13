import { getUserAvatarUrl } from '../utils.js';
import appState from '../state.js';
import { startRewardsBonus } from './rewards/bonus.js';
import { StateMachine as BonusRewardsStateMachine } from './rewards/bonus.js';
import { updateBonusRewardsList } from './rewards/bonus.js';
import { updateBonusRewardUI } from './rewards/bonus.js';
import { StateMachine as ParentRewardsStateMachine } from './rewards/parent.js';
import { startRewardsParent } from './rewards/parent.js';
import { updateParentRewardsList } from './rewards/parent.js';
import { updateParentRewardUI } from './rewards/parent.js';
import { checkUserAuthentication } from '../learner_dashboard.js';

async function loadScripts() {
    try {
        //import { updateHomeScreen } from './screens/home.js'; // from working file in header
        await import('../learner_dashboard/rank.js');
        console.log('rewards.js: Scripts loaded successfully!');
    } catch (error) {
        console.error('Error loading scripts:', error);
        // Display an error message to the DOM
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error loading scripts. Please try again later.';
        document.body.appendChild(errorMessage);
    }
}


export async function initialize() {
    console.log('Starting initialization');

    // Log before rendering HTML
    console.log('Before renderHomeHTML');
    renderrewardsHTML(); // This should run immediately and synchronously
    console.log('After renderHomeHTML');
    startRewardsBonus();
    startRewardsParent();
    addRewardsTabEventListeners();
    // Log before and after loading scripts
    console.log('Before loadScripts');
    //await loadScripts(); // This will pause until scripts are loaded
    console.log('After loadScripts');

    //checkUserAuthentication();

    //getRewardsInfoForUser($username).then(() => {
        //updateUserInfo();
    //});
}





export function renderrewardsHTML() {
    const html = `

            <!---->


    <!-- Profile/Dashboard Area -->
    <div class="rewards-top-section">
        <div class="header">
            <!-- <button class="back-button">← Back</button> -->

            <div class="screen_title">
                <!--<h1 class="text-logo">Claim Rew<span class="logoA-homescreen">∂</span>rds</h1> -->
                <h1 class="text-logo">M<span class="logoA-homescreen">∂</span>thBright</h1>
            </div>

            <div id="openLoginModal">Login</div>
            <div id="logoutButton">Logout</div>


            <!--
            <button id="openLoginModal">Sign In</button>

            <button class="parent-login-btn">Parents Sign In</button>
            -->
        </div>




        <div class="rewards-profile-dashboard">
            <div class="rewards-user-info">
                <img src="https://via.placeholder.com/50?text=User" alt="User Avatar" class="rewards-avatar">
                <p class="rewards-username">MikeMathFake</p>
            </div>

                <div class="rewards-claim-info">
                    <p>Rewards Available: <span id="rewards-available">0</span></p>
                </div>
                <div class="rewards-cart-info hidden">
                    <p>In Cart: <span id="rewards-cart-qty">0</span></p>
                </div>

                <!--
                <div id="rewards_available_info">
                </div>
                -->

            <!--
            <div class="rewards-user-info">

                 add this to the other screens.  for now, all a user really cares about is how many they can claim.
                    <p class="role">Mathling</p>
                    <p class="level">Level 21</p>
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                    <p class="xp">22</p>                
            </div>
            -->



        </div>


        <!-- Tab Switcher -->
        <div class="rewards-tab-switcher">
            <button class="rewards-tab-button" data-tab="parent">Parent Reward</button>
            <button class="rewards-tab-button active" data-tab="bonus">Bonus Reward</button>
        </div>

    </div>

    <!-- Area for General Notes -->
    <div class="reward-instructions">
        <p>You can only claim 1 reward at a time.</p>
    </div>

    <div id="container-rewards-bonus">
    
    </div>

    <!-- Parent Rewards (i.e. Zero Cost Items) -->
    <div id="container-rewards-parent">
        <div class="reward-parent-container" id="reward-parent-container" class="hidden">
            <!-- Parent rewards go here -->
        </div>
    </div>

    `;
    const screenContainer = document.getElementById('rewards_screen');
    screenContainer.innerHTML = html;


}






async function sendBonusRewardSelectionConfirmationEmail(username, logId, rewardId, status) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'https://api.mathbright.co/reward/sendRewardConfEmail',
            data: JSON.stringify({
                id: logId,
                type: 'bonus'
            }),
            contentType: 'application/json',
            dataType: 'json' // Expecting JSON response from the server
        });

        // Since `dataType: 'json'` is set, `response` should already be a JSON object
        if (response.success) {
            // Reward bonus updated successfully
            console.log('Reward bonus updated:', response);
            return response; // Return response so that the caller can handle it
        } else {
            // Error updating reward bonus
            console.log('Error updating reward bonus (response.success):', response.error);
            return response; // Return response to handle errors
        }
    } catch (error) {
        console.error('Error updating reward bonus in try catch:', error, error.stack, error.message, error.responseText);
        throw error; // Re-throw the error for the caller to handle
    }
}



export async function getRewardsInfoForUser(username) {
    let debugMsg;

    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'RewardsController',
                action: 'GetAvailableRewardsForUser',
                username: username
            }),
            contentType: 'application/json'
        }); // Add closing parenthesis here

        const data = JSON.parse(response);

        // initialize to default value
        appState.gRewardsBonusAvailable = 0;
        appState.gRewardsParentAvailable = 0;

        debugMsg = "NO rewards found";
        if (data.availableBonusRewards.success) {
            console.log('Rewards data:', data.availableBonusRewards);
            appState.gRewardsBonusAvailable = data.availableBonusRewards.data.length;
            appState.gRewardsBonusDataForUser = data.availableBonusRewards;
            debugMsg = "found bonus rewards";
        }
        if (data.availableParentRewards.success) {
            console.log('Rewards data:', data.availableParentRewards);
            appState.gRewardsParentAvailable = data.availableParentRewards.data.length;
            appState.gRewardsParentDataForUser = data.availableParentRewards;
            debugMsg = "found parent rewards";
        }
        console.log(debugMsg);


    } catch (error) {
        console.error('Error getting rewards:', error);
    }
    
}




function addRewardsTabEventListeners() {
    const tabButtons = document.querySelectorAll('.rewards-tab-button');
    const bonusRewardContainer = document.getElementById('container-rewards-bonus');
    const parentRewardContainer = document.getElementById('container-rewards-parent');

    // initialize
    bonusRewardContainer.classList.remove('hidden'); // Show bonus rewards
    parentRewardContainer.classList.add('hidden'); // Hide parent rewards
    appState.gRewardsActiveTab = "bonus";
    console.log("appState.gRewardsActiveTab = " + appState.gRewardsActiveTab);

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');

            // Show or hide the relevant content based on the clicked tab
            if (this.dataset.tab === 'parent') {
                bonusRewardContainer.classList.add('hidden'); // Hide bonus rewards
                parentRewardContainer.classList.remove('hidden'); // Show parent rewards
                appState.gRewardsActiveTab = "parent";
                updateParentRewardUI();
            } else {
                bonusRewardContainer.classList.remove('hidden'); // Show bonus rewards
                parentRewardContainer.classList.add('hidden'); // Hide parent rewards
                appState.gRewardsActiveTab = "bonus";
                updateBonusRewardUI();
            }
            console.log("#rewards.js ...appState.gRewardsActiveTab = " + appState.gRewardsActiveTab);
            console.log("#rewards.js ...Rewards available updated to: " + appState.gRewardsBonusAvailable);

        });
    });
};




export async function updateRewardsDashboard(data) {

    //gRewardsActiveTab

    document.querySelector('.rewards-username').textContent = appState.gLoggedInUsername;

    // Update rewards available
    document.getElementById('rewards-available').textContent = appState.gRewardsBonusAvailable;

    // Update avatar after forming URL
    // note: getUserAvatarUrl will provide a default avatar if needed
    const avatarUrl = getUserAvatarUrl(appState.gLoggedInUserStats.data["this_week"]);
    document.querySelector('.rewards-avatar').src = avatarUrl;

}


function updateDashboard(data) {

    /*
    let rewards;
    let rewardsLength = 0;

  
    // Check if data and globalRewardsData exist and are not null
    if (data && globalRewardsData) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (globalRewardsData.data && Array.isArray(globalRewardsData.data)) {
            rewards = globalRewardsData.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLength = rewards.length;
            }
        }
    }
    */

    // Update username
    //if (data && data.username) {
    //    document.querySelector('.rewards-username').textContent = data.username;
    //} else {
    //    document.querySelector('.rewards-username').textContent = 'Guest';
    //}
    document.querySelector('.rewards-username').textContent = appState.gLoggedInUsername;

    // Update rewards available
    //document.getElementById('rewards-available').textContent = rewardsLength;
    document.getElementById('rewards-available').textContent = appState.gRewardsBonusAvailable;

    // Update avatar after forming URL
    // note: getUserAvatarUrl will provide a default avatar if needed
   //const avatarUrl = getUserAvatarUrl(data);
    const avatarUrl = getUserAvatarUrl(appState.gLoggedInUserStats.data["this_week"]);
    document.querySelector('.rewards-avatar').src = avatarUrl;
 
    //the globalRewardsData object looks like this for a given user
                /*
                the globalRewardsData object looks like this for a given user
                {
                    "success": true,
                        "data": [
                            {
                                "log_id": 1,
                                "user_id": 95,
                                "week_start_epoch": 1723449600,
                                "slot": 1,
                                "reward_id": null,
                                "token": "",
                                "date_awarded": "2024-09-01 15:05:26",
                                "date_claimed": null,
                                "date_confirmed": null,
                                "date_finalized": null,
                                "status": "new",
                                "created_at": "2024-09-01 15:05:26",
                                "updated_at": "2024-09-01 15:05:26"
                            },
                            {
                                "log_id": 3,
                                "user_id": 95,
                                "week_start_epoch": 1723449600,
                                "slot": 2,
                                "reward_id": null,
                                "token": "",
                                "date_awarded": "2024-09-01 17:02:35",
                                "date_claimed": null,
                                "date_confirmed": null,
                                "date_finalized": null,
                                "status": "new",
                                "created_at": "2024-09-01 17:02:35",
                                "updated_at": "2024-09-01 17:02:35"
                            }
                        ]
    }
                */

}




export function updateAvailableBonusRewards(weekType = 'this_week') {

    console.log("in updateAvailableBonusRewards");

    let rewards;

    let rewardsLength = 0;
    let rewardClaimID = 0;

    // Check if data and globalRewardsData exist and are not null
    if (appState.gRewardsBonusDataForUser) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (appState.gRewardsBonusDataForUser.data && Array.isArray(appState.gRewardsBonusDataForUser.data)) {
            rewards = appState.gRewardsBonusDataForUser.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLength = rewards.length;
                rewardClaimID = rewards[0].log_id;
                console.log("rewards claim id is ", rewardClaimID, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
            }
        }
    }

    return {
        rewardsLength,
        rewardClaimID
    };
}


/*
/////////////////////////
if (appState.gRewardsBonusDataForUser) {
    // Check if globalRewardsData has a 'data' property and it's an array
    if (appState.gRewardsBonusDataForUser.data && Array.isArray(appState.gRewardsBonusDataForUser.data)) {
        rewards = appState.gRewardsBonusDataForUser.data;
        // Check if rewards array is not empty
        if (rewards.length > 0) {
            rewardsLength = rewards.length;
            rewardClaimID = rewards[0].log_id;
            console.log("rewards claim id is ", rewardClaimID, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
        }
    }
}

if (appState.gRewardsBonusDataForUser) {
    // Check if globalRewardsData has a 'data' property and it's an array
    if (appState.gRewardsParentDataForUser.data && Array.isArray(appState.gRewardsParentDataForUser.data)) {
        rewards = appState.gRewardsParentDataForUser.data;
        // Check if rewards array is not empty
        if (rewards.length > 0) {
            rewardsLengthParent = rewards.length;
            rewardClaimIDParent = rewards[0].log_id;
            console.log("rewards claim id is ", rewardClaimIDParent, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
        }
    }
}
///////////////////////
*/

export function updateAvailableParentRewards(weekType = 'this_week') {

    console.log("in updateAvailableParentRewards");

    let rewards;

    let rewardsLengthParent = 0;
    let rewardClaimIDParent = 0;

    // Check if data and globalRewardsData exist and are not null
    if (appState.gRewardsBonusDataForUser) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (appState.gRewardsParentDataForUser.data && Array.isArray(appState.gRewardsParentDataForUser.data)) {
            rewards = appState.gRewardsParentDataForUser.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLengthParent = rewards.length;
                rewardClaimIDParent = rewards[0].log_id;
                console.log("rewards claim id is ", rewardClaimIDParent, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
            }
        }
    }

    return {
        rewardsLengthParent,
        rewardClaimIDParent
    };
}

export function updateRewardsScreen(weekType = 'this_week') {

    console.log("in updateRewardsScreen");



    //let rewards = lastTwoWeeksStatsData.data.rewards;
    //let parentRewards = lastTwoWeeksStatsData.data.rewards;
    //let userData = lastTwoWeeksStatsData.data['last_week'];
    //let username = userData.username;
    //let gemsWeekText = null;

    let rewards = appState.gRewardsCards;
    let parentRewards = appState.gRewardsCards;
    let userData = appState.gLeaderBoardData;
    let username = userData.username;
    let gemsWeekText = null;

    updateBonusRewardsList(rewards.bonus);
    updateParentRewardsList(rewards.standard);
    if (appState.gLoggedIn) {
        updateDashboard(userData);
    }


    let rewardsLength = 0;
    let rewardClaimID = 0;

    let rewardsLengthParent = 0;
    let rewardClaimIDParent = 0;

    // Check if data and appState.gRewardsBonusDataForUser exist and are not null
    if (appState.gRewardsBonusDataForUser) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (appState.gRewardsBonusDataForUser.data && Array.isArray(appState.gRewardsBonusDataForUser.data)) {
            rewards = appState.gRewardsBonusDataForUser.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLength = rewards.length;
                rewardClaimID = rewards[0].log_id;
                console.log("rewards claim id is ", rewardClaimID, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
            }
        }
    }

    if (appState.gRewardsParentDataForUser) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (appState.gRewardsParentDataForUser.data && Array.isArray(appState.gRewardsParentDataForUser.data)) {
            rewards = appState.gRewardsParentDataForUser.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLengthParent = rewards.length;
                rewardClaimIDParent = rewards[0].log_id;
                console.log("rewards claim id is ", rewardClaimIDParent, " for user ", rewards[0].user_id, " with status ", rewards[0].status);
            }
        }
    }

    
    // Initialize the state machine
    const stateMachine = new BonusRewardsStateMachine(rewardsLength, rewardClaimID, appState.gLoggedInUsername);
    const stateMachineParent = new ParentRewardsStateMachine(rewardsLengthParent, rewardClaimIDParent, appState.gLoggedInUsername);
    //const parentRewardsMachine = new ParentRewardStateMachine(parentsRewardsLength, parentsRewardClaimID, globalUsername);
    //const parentRewardsMachine = new ParentRewardStateMachine(5, 1, globalUsername);

    //runRewardsAdScreen();
    //addEventListinerToModalCloseButton();

    if (weekType === 'this_week') {
        gemsWeekText = "So far this week, ";
    } else {
        gemsWeekText = "Last week, ";
    }
}






