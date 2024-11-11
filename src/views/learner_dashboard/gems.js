

export function renderGemsHTML() {
    const html = `
      <div class="gems-container">
        <div class="gems-header">
          <i class="fa fa-gem fa-2x" aria-hidden="true"></i>
          <h3>Learning Gems </h3>
        </div>
        <div class="gems-content">
          <p><span class="gems-week-text">So far this week,</span> you've earned <br><span class="gems-count">X</span> gems!</p>
          <div class="gems-actions">
            <button class="spend-gems-btn">Spend Gems</button>
          </div>
          <div class="gems-usage">
            <p>Use your gems for:</p>
            <ul>
              <li>Customizing your avatar</li>
              <li>Entering quests</li>
              <li>Redeeming for digital items in the MathBright Rewards Vault</li>
            </ul>
            <p>Sign in to start spending your gems!</p>
          </div>
        </div>
      </div>
    `;

    const gemsContainer = document.getElementById('gems-tab-content');
    gemsContainer.innerHTML = html;
}


export function updateLearningGems(weekType = 'this_week') {

    console.log("in updateLearningGems");

    const stats = lastTwoWeeksStatsData.data;
    
    const gemsWeekTextPanel = document.querySelector('.gems-content');

    if (!appState.gLoggedIn) {
        gemsWeekTextPanel.innerHTML = `Login to see gems for this week `;
        return;
    }

    if (!stats[weekType]) {
        if (gemsWeekTextPanel) { // Check if raffleCountElement is not null

            gemsWeekTextPanel.innerHTML = `<p>Leaderboard is resetting for this week</p> `;
        } else {
            console.error("gemsWeekTextPanel not found");
        }
        return;
    } else {
        renderGemsHTML();
    }

    let d = lastTwoWeeksStatsData.data[weekType];
    let username = d.username;
    let gemsWeekText = null;

    if (weekType === 'this_week') {
        gemsWeekText = "So far this week, ";
    } else {
        gemsWeekText = "Last week, ";
    }

    const gemsWeekTextElement = document.querySelector('.gems-week-text');
    if (gemsWeekTextElement) { // Check if gemsWeekTextElement is not null
        gemsWeekTextElement.textContent = gemsWeekText;
    } else {
        console.error("gemsWeekTextElement not found");
    }

    const gemsCountElement = document.querySelector('.gems-count');
    if (gemsCountElement) { // Check if gemsCountElement is not null
        gemsCountElement.textContent = d.Gems_total;        
    } else {
        console.error("gemsCountElement not found");
    }
}




