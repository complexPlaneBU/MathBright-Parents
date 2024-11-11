import { getUserAvatarUrl } from '../utils.js';
async function loadScripts() {
    try {
        await import('../learner_dashboard.js');
        await import('../learner_dashboard/rank.js');
        await import('../learner_dashboard/raffle.js');
        await import('../learner_dashboard/gems.js');
        await import('../learner_dashboard/lessons.js');
        console.log('Scripts loaded successfully!');
    } catch (error) {
        console.error('Error loading scripts:', error);
        // Display an error message to the DOM
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error loading scripts. Please try again later.';
        document.body.appendChild(errorMessage);
    }
}

export function renderrewardsHTML() {
    const html = `
            <button id="openLoginModal">Kids Sign In</button>


    <!-- Profile/Dashboard Area -->
    <div class="rewards-profile-dashboard">
        <div class="rewards-user-info">
            <img src="https://via.placeholder.com/50?text=User" alt="User Avatar" class="rewards-avatar">
            <p class="rewards-username">Username</p>
        </div>
        <div class="rewards-claim-info">
            <p>Rewards Available: <span id="rewards-available">0</span></p>
        </div>
        <div class="rewards-cart-info hidden">
            <p>In Cart: <span id="rewards-cart-qty">0</span></p>
        </div>
    </div>

    <!-- Area for General Notes -->
    <div class="reward-instructions">
        <p> You can only claim 1 reward at a time. </p>
    </div>

    <!-- Reward cards -->
    <div class="reward-container">
        <div class="reward-card">
            <img src="https://via.placeholder.com/100?text=Reward+1" alt="Reward 1">
            <div class="reward-details">
                <p>Reward 1</p>
                <button class="add-to-cart" data-reward-id="1">Add to cart</button>
            </div>
        </div>
        <div class="reward-card">
            <img src="https://via.placeholder.com/100?text=Reward+2" alt="Reward 2">
            <div class="reward-details">
                <p>Reward 2</p>
                <button class="add-to-cart" data-reward-id="2">Add to cart</button>
            </div>
        </div>
        <!-- More reward cards as needed -->
    </div>

    <!-- Checkout Button -->
    <button id="checkout-btn" class="hidden">Checkout</button>

    <!-- Cancel Button -->
    <button id="cancelCheckout-btn" class="hidden">Cancel</button>

    <!-- Confirmation Modal -->
    <div id="confirmation-modal" class="modal hidden">
        <img id="reward-image" src="" alt="Reward Image">
        <p>Are you sure you want to claim this reward?</p>
        <button id="confirm-btn">Confirm</button>
        <button id="cancel-btn">Cancel</button>
    </div>

    <!-- Success Modal -->
    <div id="success-modal" class="modal hidden">
        <p>Nice Choice!</p> <p>  We just emailed your Parent for Confirmation.</p>
        <button id="ok-btn">OK</button>
    </div>

    <!-- Message Modal -->
    <div id="reward-modal" class="modal">
      <div class="modal-content">
        <p id="reward-message"></p>
        <button id="close-modal">Close</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div id="error-modal" class="modal hidden">
        <p>Error Placeholder!</p>
        <button id="ok-btn">OK</button>
    </div>

    


    `;
    const screenContainer = document.getElementById('rewards_screen');
    screenContainer.innerHTML = html;


}


class StateMachine {
        constructor(initialRewardsAvailable, rewardClaimID, rewardUsername) {
            this.state = 'idle';
            this.selectedReward = null;
            this.inCart = false; // New property to track if reward is in cart
            this.initialRewardsAvailable = initialRewardsAvailable;
            this.rewardsAvailable = initialRewardsAvailable; // New property to track the current rewards available count
            this.rewardsAvailableMessage = 'Finish some lessons to earn some rewards'; // New property to store the message to display
            this.rewardClaimID = rewardClaimID; 
            this.rewardUsername = rewardUsername; 
            this.errorMessage = "Error placeholder!";
            this.init();
        }

    init() {
        // Bind event listeners for reward buttons
        const rewardButtons = document.querySelectorAll('.add-to-cart');
        if (rewardButtons) {
            rewardButtons.forEach(button => {
                try {
                    button.addEventListener('click', (e) => {
                        if (this.inCart) {
                            this.removeFromCart(e.target.dataset.rewardId);
                        } else {
                            this.selectReward(e.target.dataset.rewardId);
                        }
                    });
                } catch (error) {
                    console.error(`Error attaching event listener to reward button: ${error}`);
                }
            });
        } else {
            console.error('No reward buttons found');
        }

        // Bind event listeners for modals
        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) {
            try {
                confirmBtn.addEventListener('click', () => this.confirmReward());
            } catch (error) {
                console.error(`Error attaching event listener to confirm button: ${error}`);
            }
        } else {
            console.error('No confirm button found');
        }

        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            try {
                cancelBtn.addEventListener('click', () => this.cancelReward());
            } catch (error) {
                console.error(`Error attaching event listener to cancel button: ${error}`);
            }
        } else {
            console.error('No cancel button found');
        }

        const okBtn = document.getElementById('ok-btn');
        if (okBtn) {
            try {
                okBtn.addEventListener('click', () => this.closeSuccessModal());
            } catch (error) {
                console.error(`Error attaching event listener to ok button: ${error}`);
            }
        } else {
            console.error('No ok button found');
        }

        // Bind event listener for checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            try {
                checkoutBtn.addEventListener('click', () => this.handleCheckout());
            } catch (error) {
                console.error(`Error attaching event listener to checkout button: ${error}`);
            }
        } else {
            console.error('No checkout button found');
        }

        // Bind event listener for cancelCheckoutBtn button
        const cancelCheckoutBtn = document.getElementById('cancelCheckout-btn');
        if (cancelCheckoutBtn) {
            try {
                cancelCheckoutBtn.addEventListener('click', (e) => {
                    if (this.inCart) {
                        this.removeFromCart(e.target.dataset.rewardId);
                    } 
                });
            } catch (error) {
                console.error(`Error attaching event listener to checkout button: ${error}`);
            }
        } else {
            console.error('No checkout button found');
        }

        // Add an event listener to close the modal
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('reward-modal').style.display = 'none';
        });


        // Initialize UI
        this.updateUI();
    }


    setState(newState) {
        this.state = newState;
        this.updateUI();
    }

    removeDisabledClassFromRewardCards() {
        const rewardCards = document.querySelectorAll('.reward-card');
        rewardCards.forEach(card => {
            card.classList.remove('disabled');
        });
    }

    selectReward(rewardId) {
        if (this.rewardsAvailable > 0) {
            this.selectedReward = rewardId;
            this.inCart = true; // Set inCart to true
            this.setState('rewardSelected');

            // Decrement the rewards-available count
            this.rewardsAvailable -= 1;
            document.getElementById('rewards-available').textContent = this.rewardsAvailable;

            // Add disabled class to non-selected reward cards
            const rewardCards = document.querySelectorAll('.reward-card');
            rewardCards.forEach(card => {
                if (card.dataset.rewardId !== rewardId) {
                    card.classList.add('disabled');
                }
            });
        } else {
            //document.getElementById('reward-message').textContent = 'Sorry, you have no rewards to claim';
            document.getElementById('reward-message').textContent = 'Sorry, no rewards to claim yet! 😕 ';
            document.getElementById('reward-modal').style.display = 'block';
            document.getElementById('rewards-available').classList.add('no-rewards');

        }
    }

    removeFromCart(rewardId) {
        this.selectedReward = null;
        this.inCart = false; // Set inCart to false
        this.setState('idle');

        // Increment the rewards-available count
        this.rewardsAvailable += 1;
        document.getElementById('rewards-available').textContent = this.rewardsAvailable;
        document.getElementById('rewards-available').classList.remove('no-rewards');
    }

    confirmReward() {
        this.setState('claiming');
        this.inCart = true;
        //SendEmailConfAndLogBonusReward(this.rewardUsername, this.rewardClaimID, this.selectedReward, 'claimed')

        console.log("Reward Details for Database write:");
        console.log("Username:", this.rewardUsername);
        console.log("Claim ID:", this.rewardClaimID);
        console.log("Selected Reward:", this.selectedReward);

        // First AJAX call to write to database
        //SendEmailConfAndLogBonusReward(this.rewardUsername, this.rewardClaimID, this.selectedReward, 'claimed')
        writeBonusRewardDataToDatabase(this.rewardUsername, this.rewardClaimID, this.selectedReward, 'claimed')
            .then((data) => {
                if (data.success) {
                    this.setState('completed');
                    // save current data for the email sending ajax call
                    const oldRewardUsername = this.rewardUsername;
                    const oldRewardClaimID = this.rewardClaimID;
                    const oldSelectedReward = this.selectedReward;

                    getRewardsInfoForUser(this.rewardUsername) // Call this function again
                        .then(() => {
                            const { rewardsLength, rewardClaimID } = updateAvailableBonusRewards();
                            this.rewardsAvailable = rewardsLength;
                            this.rewardClaimID = rewardClaimID;
                        });

                    console.log("Reward Details for Email sending:");
                    console.log("Username:", this.rewardUsername);
                    console.log("Claim ID:", this.rewardClaimID);
                    console.log("Selected Reward:", this.selectedReward);
                    // Second AJAX call to send email
                    
                    sendBonusRewardSelectionConfirmationEmail(oldRewardUsername, oldRewardClaimID, oldSelectedReward, 'email_sent')
                        .then((emailData) => {
                            // Handle email sending response
                        })
                        .catch((error) => {
                            // Handle email sending error
                        });
                        
                } else {
                    console.error('Error claiming reward: database write error', data.error);
                    this.setState('error');
                    this.rewardsAvailable += 1;
                    document.getElementById('rewards-available').textContent = this.rewardsAvailable;
                }
            })
            .catch((error) => {
                console.error('Error claiming reward:', error);
                this.errorMessage = error;
                this.setState('error');
                this.rewardsAvailable += 1;
            });
    }

    cancelReward() {
        this.selectedReward = null;
        this.inCart = false; // Reset inCart to false
        this.setState('idle');
        this.rewardsAvailable += 1;
        document.getElementById('rewards-available').textContent = this.rewardsAvailable;
    }

    closeSuccessModal() {
        this.inCart = false; // Reset inCart to false
        document.getElementById('success-modal').classList.add('hidden');
        this.setState('idle');
    }

    handleCheckout() {
        const selectedRewardCard = document.querySelector('.reward-card button.removed').closest('.reward-card');
        const imageUrl = selectedRewardCard.querySelector('img').src;
        document.getElementById('confirmation-modal').dataset.image = imageUrl;
        document.getElementById('reward-image').src = imageUrl;
        this.inCart = true; 

        // Only transition to claiming state when user clicks "Confirm"
        if (this.state === 'rewardSelected') {
            this.setState('claiming');
            document.getElementById('confirmation-modal').classList.remove('hidden');
        }
    }


    updateUI() {
        const buttons = document.querySelectorAll('.reward-card button');
        const checkoutButton = document.getElementById('checkout-btn');
        const cancelCheckoutButton = document.getElementById('cancelCheckout-btn');
        const confirmationModal = document.getElementById('confirmation-modal');
        const successModal = document.getElementById('success-modal');
        const errorModal = document.getElementById('error-modal');
        const rewardsCartQty = document.getElementById('rewards-cart-qty');
        const rewardsCartInfo = document.querySelector('.rewards-cart-info');
        //const rewardsAddToCartLabel = document.querySelector('.rewards-add-to-cart-label');
        const rewardsAddToCartLabels = document.querySelectorAll('.rewards-add-to-cart-label');

        switch (this.state) {
            case 'idle':
                this.removeDisabledClassFromRewardCards();
                // Hide the checkout button and modals, show all reward buttons
                checkoutButton.classList.add('hidden');
                checkoutButton.classList.remove('show');
                cancelCheckoutButton.classList.add('hidden');
                cancelCheckoutButton.classList.remove('show');
                confirmationModal.classList.add('hidden');
                confirmationModal.classList.remove('show');
                successModal.classList.add('hidden');
                successModal.classList.remove('show');
                buttons.forEach(button => {
                    button.disabled = false;
                    button.classList.remove('hidden');
                    button.classList.add('show');
                    button.textContent = 'Add to Cart'; // Reset button text
                    button.classList.remove('removed');
                });
                rewardsCartInfo.classList.add('hidden');
                rewardsAddToCartLabels.forEach(label => {
                    label.classList.remove('hidden');
                    label.classList.add('show');
                });
                rewardsCartQty.textContent = '0';
                break;
            case 'rewardSelected':
                // Show the checkout button, hide modals, disable all buttons but selected
                checkoutButton.classList.remove('hidden');
                checkoutButton.classList.add('show');
                cancelCheckoutButton.classList.add('show');
                cancelCheckoutButton.classList.remove('hidden');
                confirmationModal.classList.add('hidden');
                confirmationModal.classList.remove('show');
                successModal.classList.add('hidden');
                successModal.classList.remove('show');
                buttons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('hidden');
                    button.classList.remove('show');
                });
                document.querySelector(`.reward-card button[data-reward-id="${this.selectedReward}"]`).disabled = false;
                document.querySelector(`.reward-card button[data-reward-id="${this.selectedReward}"]`).classList.remove('hidden');
                document.querySelector(`.reward-card button[data-reward-id="${this.selectedReward}"]`).classList.add('show');
                document.querySelector(`.reward-card button[data-reward-id="${this.selectedReward}"]`).textContent = 'Remove from Cart'; // Update button text
                document.querySelector(`.reward-card button[data-reward-id="${this.selectedReward}"]`).classList.add('removed');
                rewardsCartInfo.classList.remove('hidden');
                rewardsAddToCartLabels.forEach(label => {
                    label.classList.remove('show');
                    label.classList.add('hidden');
                });
                rewardsCartQty.textContent = '1';
                break;
            case 'claiming':
                // Show the confirmation modal, hide other modals and buttons
                checkoutButton.classList.add('hidden');
                checkoutButton.classList.remove('show');
                cancelCheckoutButton.classList.add('hidden');
                cancelCheckoutButton.classList.remove('show');
                confirmationModal.classList.remove('hidden');
                confirmationModal.classList.add('show');
                successModal.classList.add('hidden');
                successModal.classList.remove('show');
                buttons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('hidden');
                    button.classList.remove('show');
                });
                rewardsCartInfo.classList.remove('hidden');
                rewardsAddToCartLabels.forEach(label => {
                    label.classList.remove('show');
                    label.classList.add('hidden');
                });
                rewardsCartQty.textContent = '1';

                const imageUrl = document.getElementById('confirmation-modal').dataset.image;
                document.getElementById('reward-image').src = imageUrl;

                break;
            case 'completed':
                this.removeDisabledClassFromRewardCards();
                // Show the success modal, hide other modals and buttons
                checkoutButton.classList.add('hidden');
                checkoutButton.classList.remove('show');
                cancelCheckoutButton.classList.add('hidden');
                cancelCheckoutButton.classList.remove('show');
                confirmationModal.classList.add('hidden');
                confirmationModal.classList.remove('show');
                successModal.classList.remove('hidden');
                successModal.classList.add('show');
                buttons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('hidden');
                    button.classList.remove('show');
                });
                rewardsCartInfo.classList.remove('hidden');
                rewardsAddToCartLabels.forEach(label => {
                    label.classList.remove('show');
                    label.classList.add('hidden');
                });
                rewardsCartQty.textContent = '0';
                break;

            case 'error':
                this.removeDisabledClassFromRewardCards();
                // Show the error modal, hide other modals and buttons
                checkoutButton.classList.add('hidden');
                checkoutButton.classList.remove('show');
                cancelCheckoutButton.classList.add('hidden');
                cancelCheckoutButton.classList.remove('show');
                confirmationModal.classList.add('hidden');
                confirmationModal.classList.remove('show');
                successModal.classList.add('hidden');
                successModal.classList.remove('show');
                errorModal.classList.remove('hidden');
                errorModal.classList.add('show');
                errorModal.textContent = this.errorMessage; // Display error message
                buttons.forEach(button => {
                    button.disabled = true;
                    button.classList.add('hidden');
                    button.classList.remove('show');
                });
                rewardsCartInfo.classList.remove('hidden');
                rewardsAddToCartLabels.forEach(label => {
                    label.classList.remove('show');
                    label.classList.add('hidden');
                });
                rewardsCartQty.textContent = '0';
                break;
        }
    }

    // end
}


// above ends statemachine
//========================================================

function attachEventListeners() {
    var tabButtons = document.getElementsByClassName("rewards-tab");

    Array.prototype.forEach.call(tabButtons, function (tabButton) {
        tabButton.addEventListener("click", function () {
            var tabName = tabButton.getAttribute("data-tab-name");
            openTab(tabName);
        });
    });
}

async function SendEmailConfAndLogBonusReward(username, logId, rewardId, status) {

    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'RewardsController',
                action: 'SendEmailConfAndLogBonusReward',
                username: username,
                logId: logId,
                rewardId: rewardId,
                status: status
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


async function writeBonusRewardDataToDatabase(username, logId, rewardId, status) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'RewardsController',
                action: 'writeBonusRewardDataToDatabase',
                username: username,
                logId: logId,
                rewardId: rewardId,
                status: status
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

        if (data) {
            // User has rewards, update UI accordingly
            console.log('Rewards data:', data);
            globalRewardsData = data;
            // Update UI with rewards data
        } else {
            // User has no rewards, show message
            console.log('NO Rewards data:');
        }
    } catch (error) {
        console.error('Error getting rewards:', error);
    }
    
}


function updateUserInfo_x() {
    
    //document.querySelector('.loggedin-username').textContent = globalUsername.charAt(0).toUpperCase() + globalUsername.slice(1).toLowerCase();
    //document.querySelector('.loggedin-bonus-rewards-available').textContent = globalRewardsData.data.length;
    //document.querySelector('.loggedin-username').textContent = data.username;
    //document.querySelector('.profile-info-levelname').textContent = data.levelName;
    //document.querySelector('.loggedin-bonus-rewards-available').textContent = data.bonusRewardsAvailable;

}

function updateUserInfo() {
    $.ajax({
        url: 'index.php',
        type: 'GET',
        data: {
            controller: 'RewardsController',
            action: 'GetAvailableBonusRewardsForUserAction',
        },
        success: function (response) {
            const data = JSON.parse(response);
            console.log(data);
            if (data.status === 'success') {
                console.log("GetAvailableBonusRewardsForUserAction SUCCESS"); // Handle errors
            } else {
                console.error(data.message); // Handle errors
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error); // Handle AJAX errors
        }
    });
}



export async function initialize($username) {
    console.log('Starting initialization');

    // Log before rendering HTML
    console.log('Before renderHomeHTML');
    renderrewardsHTML(); // This should run immediately and synchronously
    console.log('After renderHomeHTML');

    // Log before and after loading scripts
    console.log('Before loadScripts');
    //await loadScripts(); // This will pause until scripts are loaded
    console.log('After loadScripts');

    getRewardsInfoForUser($username).then(() => {
        //updateUserInfo();
    });
}

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("rewards-tab-content");
    var tabs = document.getElementsByClassName("rewards-tab");

    for (i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }

    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    document.querySelector(`.rewards-tab[onclick="openTab('${tabName}')"]`).classList.add("active");
}


function updateDashboard(data) {
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

    // Update username
    if (data && data.username) {
        document.querySelector('.rewards-username').textContent = data.username;
    } else {
        document.querySelector('.rewards-username').textContent = 'Guest';
    }

    // Update rewards available
    document.getElementById('rewards-available').textContent = rewardsLength;

    // Update avatar after forming URL
    // note: getUserAvatarUrl will provide a default avatar if needed
   const avatarUrl = getUserAvatarUrl(data);
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
    if (globalRewardsData) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (globalRewardsData.data && Array.isArray(globalRewardsData.data)) {
            rewards = globalRewardsData.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLength = rewards.length;
                rewardClaimID = rewards[0].log_id;
                console.log("rewards claim id is ", rewardClaimID, " for user ", rewards[0].user_id, " with status ", rewards[0].status);

                // Update rewards available
                document.getElementById('rewards-available').textContent = rewardsLength;
            }
        }
    }

    return {
        rewardsLength,
        rewardClaimID
    };
}

export function updateRewardsScreen(weekType = 'this_week') {

    console.log("in updateRewardsScreen");

    let rewards = lastTwoWeeksStatsData.data.rewards;
    let userData = lastTwoWeeksStatsData.data['last_week'];
    let username = userData.username;
    let gemsWeekText = null;

    updateBonusRewardsList(rewards.bonus);
    updateDashboard(userData);


    let rewardsLength = 0;
    let rewardClaimID = 0;

    // Check if data and globalRewardsData exist and are not null
    if (globalRewardsData) {
        // Check if globalRewardsData has a 'data' property and it's an array
        if (globalRewardsData.data && Array.isArray(globalRewardsData.data)) {
            rewards = globalRewardsData.data;
            // Check if rewards array is not empty
            if (rewards.length > 0) {
                rewardsLength = rewards.length;
                rewardClaimID = rewards[0].log_id; 
                console.log("rewards claim id is ", rewardClaimID, " for user ", rewards[0].user_id, " with status ", rewards[0].status); 
            }
        }
    }



    // Initialize the state machine
    const stateMachine = new StateMachine(rewardsLength, rewardClaimID, globalUsername);

    //runRewardsAdScreen();
    //addEventListinerToModalCloseButton();

    if (weekType === 'this_week') {
        gemsWeekText = "So far this week, ";
    } else {
        gemsWeekText = "Last week, ";
    }
}


// Function to create reward card HTML
    function createRewardCard(reward) {
        console.log(reward.image_url);
        console.log(reward.bonus_reward_name);
        console.log(reward.bonus_reward_id);
        console.log(window.location.pathname);
        console.log(window.location.href);
        const html = `
            <div class="reward-card" data-reward-id="${reward.bonus_reward_id}">

                <img src="./src/views/${reward.image_url}" alt="${reward.bonus_reward_name}">

                <div class="reward-details">
                    <p>${reward.bonus_reward_name}</p>
                    <button class="add-to-cart" data-reward-id="${reward.bonus_reward_id}">Add to cart</button>
                    <div class="rewards-add-to-cart-label">
                        <p>Add to Cart</p>
                    </div>
                </div>
            </div>
        `;
        return { html, rewardId: reward.bonus_reward_id };
    }


    // Function to update rewards list
    function updateBonusRewardsList(rewards) {
        const rewardsContainer = document.querySelector('.reward-container');
        rewardsContainer.innerHTML = ''; // Clear existing rewards

        // Create reward cards and append to container
        rewards.forEach((reward) => {
            const { html, rewardId } = createRewardCard(reward);
            rewardsContainer.innerHTML += html;
            // Now you can use rewardId here
            console.log(rewardId);
        });
    }

