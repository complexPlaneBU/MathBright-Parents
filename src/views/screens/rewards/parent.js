import { getRewardsInfoForUser } from '../rewards.js';
import { updateAvailableParentRewards } from '../rewards.js';

import appState from '../../state.js';


export function startRewardsParent() {
    console.log("in startRewardsParent");

    const html = `
            

    <!-- Parent Rewards (i.e. Gift Cards) -->
    <div class="reward-parent-container" id="reward-parent-container">
        <!-- Parent rewards go here -->
    </div>

    <!-- Checkout Button -->
    <button id="checkout-btn-parent" class="hidden">Checkout</button>

    <!-- Cancel Button -->
    <button id="cancelCheckout-btn-parent" class="hidden">Cancel</button>

    <!-- Confirmation Modal -->
    <div id="confirmation-modal-parent" class="modal hidden">
        <img id="reward-image-parent" src="" alt="Reward Image">
        <p>Are you sure you want to claim this reward?</p>
        <button id="confirm-btn-parent">Confirm</button>
        <button id="cancel-btn-parent">Cancel</button>
    </div>

    <!-- Success Modal -->
    <div id="success-modal-parent" class="modal hidden">
        <p>Nice Choice!</p> <p>  We just emailed your Parent for Confirmation.</p>
        <button id="ok-btn-parent">OK</button>
    </div>

    <!-- Message Modal -->
    <div id="reward-modal-parent" class="modal">
      <div class="modal-content">
        <p id="reward-message-parent"></p>
        <button id="close-modal-parent">Close</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div id="error-modal-parent" class="modal hidden">
        <p>Error Placeholder!</p>
        <button id="ok-btn-parent">OK</button>
    </div>


    `;
    const screenContainer = document.getElementById('container-rewards-parent');
    screenContainer.innerHTML = html;


}




export class StateMachine {

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
        this._inCart = false; // Use a private variable to hold the value
        this._rewardsAvailable = initialRewardsAvailable; // Private property to track the current rewards available count
        this.init();
    }

    get inCart() {
        return this._inCart;
    }

    set inCart(value) {
        this._inCart = value;
        appState.gRewardsParentInCart = value; // Update appState whenever inCart changes
        console.log("..Parent StateMachine InCart = " + value);
    }

    // Getter for rewardsAvailable
    get rewardsAvailable() {
        return this._rewardsAvailable;
    }

    // Setter for rewardsAvailable
    set rewardsAvailable(value) {
        this._rewardsAvailable = value;
        // Update appState or perform other actions here
        appState.gRewardsParentAvailable = value; // Example update
        console.log("...Rewards available updated to: " + value);
    }


    init() {
        // Bind event listeners for reward buttons
        const rewardButtons = document.querySelectorAll('.add-to-cart-parent');
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
        const confirmBtn = document.getElementById('confirm-btn-parent');
        if (confirmBtn) {
            try {
                confirmBtn.addEventListener('click', () => this.confirmReward());
            } catch (error) {
                console.error(`Error attaching event listener to confirm button: ${error}`);
            }
        } else {
            console.error('No confirm button found');
        }

        const cancelBtn = document.getElementById('cancel-btn-parent');
        if (cancelBtn) {
            try {
                cancelBtn.addEventListener('click', () => this.cancelReward());
            } catch (error) {
                console.error(`Error attaching event listener to cancel button: ${error}`);
            }
        } else {
            console.error('No cancel button found');
        }

        const okBtn = document.getElementById('ok-btn-parent');
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
        const checkoutBtn = document.getElementById('checkout-btn-parent');
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
        const cancelCheckoutBtn = document.getElementById('cancelCheckout-btn-parent');
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
        const rewardCards = document.querySelectorAll('.reward-card-parent');
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
            const rewardCards = document.querySelectorAll('.reward-card-parent');
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
        writeParentRewardDataToDatabase(this.rewardUsername, this.rewardClaimID, this.selectedReward, 'claimed')
            .then((data) => {
                if (data.success) {
                    this.setState('completed');
                    // save current data for the email sending ajax call
                    const oldRewardUsername = this.rewardUsername;
                    const oldRewardClaimID = this.rewardClaimID;
                    const oldSelectedReward = this.selectedReward;

                    getRewardsInfoForUser(this.rewardUsername) // Call this function again
                        .then(() => {
                            const { rewardsLength, rewardClaimID } = updateAvailableParentRewards();
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
        document.getElementById('success-modal-parent').classList.add('hidden');
        this.setState('idle');
    }

    handleCheckout() {
        const selectedRewardCard = document.querySelector('.reward-card-parent button.removed').closest('.reward-card-parent');
        //const imageUrl = selectedRewardCard.querySelector('img').src;
        //document.getElementById('confirmation-modal-parent').dataset.image = imageUrl;
        // TODO: add the icon to the confirmation modal later on
       // document.getElementById('reward-image').src = imageUrl;
        this.inCart = true;

        // Only transition to claiming state when user clicks "Confirm"
        if (this.state === 'rewardSelected') {
            this.setState('claiming');
            document.getElementById('confirmation-modal-parent').classList.remove('hidden');
        }
    }


    updateUI() {
        const buttons = document.querySelectorAll('.reward-card-parent button');
        const checkoutButton = document.getElementById('checkout-btn-parent');
        const cancelCheckoutButton = document.getElementById('cancelCheckout-btn-parent');
        const confirmationModal = document.getElementById('confirmation-modal-parent');
        const successModal = document.getElementById('success-modal-parent');
        const errorModal = document.getElementById('error-modal-parent');
        const rewardsCartQty = document.getElementById('rewards-cart-qty');
        const rewardsCartInfo = document.querySelector('.rewards-cart-info');
        //const rewardsAddToCartLabel = document.querySelector('.rewards-add-to-cart-label');
        const rewardsAddToCartLabels = document.querySelectorAll('.rewards-add-to-cart-label-parent');

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
                document.querySelector(`.reward-card-parent button[data-reward-id="${this.selectedReward}"]`).disabled = false;
                document.querySelector(`.reward-card-parent button[data-reward-id="${this.selectedReward}"]`).classList.remove('hidden');
                document.querySelector(`.reward-card-parent button[data-reward-id="${this.selectedReward}"]`).classList.add('show');
                document.querySelector(`.reward-card-parent button[data-reward-id="${this.selectedReward}"]`).textContent = 'Remove from Cart'; // Update button text
                document.querySelector(`.reward-card-parent button[data-reward-id="${this.selectedReward}"]`).classList.add('removed');
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

                const imageUrl = document.getElementById('confirmation-modal-parent').dataset.image;
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


async function writeParentRewardDataToDatabase(username, logId, rewardId, status) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'RewardsController',
                action: 'writeParentRewardDataToDatabase',
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
            // Reward Parent updated successfully
            console.log('Reward Parent updated:', response);
            return response; // Return response so that the caller can handle it
        } else {
            // Error updating reward Parent
            console.log('Error updating reward Parent (response.success):', response.error);
            return response; // Return response to handle errors
        }
    } catch (error) {
        console.error('Error updating reward Parent in try catch:', error, error.stack, error.message, error.responseText);
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
            // Reward Parent updated successfully
            console.log('Reward Parent updated:', response);
            return response; // Return response so that the caller can handle it
        } else {
            // Error updating reward Parent
            console.log('Error updating reward Parent (response.success):', response.error);
            return response; // Return response to handle errors
        }
    } catch (error) {
        console.error('Error updating reward Parent in try catch:', error, error.stack, error.message, error.responseText);
        throw error; // Re-throw the error for the caller to handle
    }
}



function createParentRewardCard(reward) {
    console.log(reward.image_url);
    console.log(reward.title);
    console.log(reward.reward_id);
    console.log(window.location.pathname);
    console.log(window.location.href);

    if (!reward.image_url || reward.image_url.trim() === "") {
        reward.image_url = "fas fa-gift";
    }

    const html = `

           <div class="reward-card-parent" data-reward-id="${reward.reward_id}">

           <!--
                <div class="reward-details">
                    <button class="add-to-cart" data-reward-id="${reward.reward_id}">Add to cart</button>
                    <div class="rewards-add-to-cart-label-parent">
                        <p>Add to Cart</p>
                    </div>
                </div>
                -->
        

            <div class="reward-parent-item">
                <div class="reward-parent-details"> 
                    <i class="${reward.image_url} reward-icon"></i>
                    <div class="reward-parent-title">${reward.title}</div>
               </div>
               <div class="add-to-cart-parent-checkout"> 
                    <button class="add-to-cart-parent" data-reward-id="${reward.reward_id}"> 2</button>               
               </div>
            </div>

        </div>


    `;
    return { html, rewardId: reward.reward_id };
}



export function updateParentRewardsList(rewards) {
    const rewardsContainer = document.querySelector('.reward-parent-container');
    rewardsContainer.innerHTML = ''; // Clear existing rewards

    // Create reward cards and append to container
    rewards.forEach((reward) => {
        const { html, rewardId } = createParentRewardCard(reward);
        rewardsContainer.innerHTML += html;
        // Now you can use rewardId here
        console.log(rewardId);
    });
}

export function updateParentRewardUI() {
    document.getElementById('rewards-available').textContent = appState.gRewardsParentAvailable; // palceholder for now
    document.getElementById('rewards-cart-qty').textContent = appState.gRewardsParentInCart;
}