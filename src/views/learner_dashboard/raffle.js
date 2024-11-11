// raffle.js

import appState from '../state.js';

// Function to render the Raffle HTML
// raffle.js



export function renderRaffleHTML() {
    const html = `
         <div class="raffle-container">
          <div class="raffle-header">
            <i class="fa fa-gift fa-2x" aria-hidden="true"></i>
            <h3>Bonus Rewards</h3>
          </div>
          <div class="raffle-content">
            <p>Not in the top spots on the XP Leaderboard? You can still win a bonus reward through our Raffle!</p>
            <div class="raffle-chance"></div>
            <p>Learn More to Earn More</p>
          </div>
        </div>
  `;
    const raffleContainer = document.getElementById('raffle-tab-content');
    raffleContainer.innerHTML = html;
}

// Function to update the Raffle Tickets tab
// raffle.js

// Function to update the Raffle Tickets tab 
function updateRaffleTickets(weekType = 'this_week') {


    //console.log("lastTwoWeeksStatsData =", lastTwoWeeksStatsData);
    console.log("in updateRaffleTickets");

    //const stats = lastTwoWeeksStatsData.data;
    const stats = appState.gLeaderBoardData;
    const raffleCountElement = document.querySelector('.raffle-content');

    if (!appState.gLoggedIn) {
        raffleCountElement.innerHTML = `Login to see raffle tickets `;
        return;
    }

   // handle week rollover/reset
    if (!stats[weekType]) {
        if (raffleCountElement) { // Check if raffleCountElement is not null
            //raffleCountElement.innerHTML = '<p>Raffle is resetting for this new week</p>`;
            raffleCountElement.innerHTML = `Raffle is resetting for this new week `;

        } else {
            console.error("raffleCountElement not found");
        }
        return;
    } else {
        renderRaffleHTML();
    }

    let d = lastTwoWeeksStatsData;
    let Raffle_percentage = d.data[weekType].Raffle_percentage;
    let username = d.data[weekType].username;


    if (raffleCountElement) { // Check if raffleCountElement is not null

        const current_date = new Date();
        const current_day = current_date.getDay(); // 0 = Sunday, 1 = Monday, ...
        const week_start_date = new Date(current_date.getTime() - (current_day * 24 * 60 * 60 * 1000));
        const my_week_start_epoch = Math.floor(week_start_date.getTime() / 1000);

        
        // Update the UI with the calculated percentage
        if (weekType === 'last_week') {
            if (d.data.last_week.raffle_won) {
                raffleCountElement.innerHTML = `Congrats ${username}! You won a bonus reward this week! ${Math.round(parseFloat(Raffle_percentage))}%`;
            } else {
                raffleCountElement.innerHTML = `Sorry ${username}, you didn't win this week. ${Math.round(parseFloat(Raffle_percentage))}%`;
            }
        } else {
            raffleCountElement.innerHTML = `
                ${username}'s chance of winning:
                <p style="font-size: 2rem; text-align: center; margin:10px">${Math.round(parseFloat(Raffle_percentage))}%</p>
            `;

        }
        
    } else {
        console.error("raffleCountElement not found");
    }
}

export function initializeRaffleTab() {
// Call the render function to generate the HTML
    renderRaffleHTML();
}


// Export the update function to be used in other files
export { updateRaffleTickets };