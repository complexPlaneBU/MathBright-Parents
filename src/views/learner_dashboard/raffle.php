<!--Raffle content goes here -->
<div class="raffle" id="raffle">

    <h3>Bonus Raffle</h3>
    <div class="bonus-raffle-description">
        <div class="raffle-usage">
            <span style="font-size: 16px; color: #333333; font-weight: normal; text-align: center; display: block; "> This week's raffle:</span>
            <p>Roblox Gift Card</p>
        </div>
        <div class="raffle-container">
            <div class="raffle-info">
                <div class="raffle-image-container">
                    <img src="./images/gem.png" alt="Raffle Image" class="raffle-image">
                </div>
                <div class="ref-count">
                    <?= a($Raffle_percentage); ?> %
                </div>
            </div>
            <div class="ref-usage">
            </div>
        </div>
        <div class="raffle-encouragement">
            <p>Want to increase your chance for this week?  Learn more to earn more!</p>
        </div>
    </div>
    <table>
        <!-- Table rows for Learning Gems tab -->
    </table>

    <?php
    echo "Raffle content goes here";
    ?>
</div>

<script>

// Function to update the Raffle Tickets tab 
function updateRaffleTickets(user, learners) {

    const tabContent = document.getElementById('raffle');
    const raffleCountElement = tabContent.querySelector('.ref-count');

    // Calculate total raffle tickets across all learners
    const totalRaffleTickets = learners.reduce((total, learner) => total + learner.raffleTickets, 0);

    // Calculate user's percentage chance of winning the raffle
    const userPercentageChance = (user.raffleTickets / totalRaffleTickets) * 100;


    // Update the UI with the calculated percentage
    //raffleCountElement.textContent = `Your chance of winning: ${userPercentageChance.toFixed(0)}%`;
    if (weekNumber < WEEK_IN_PROGRESS) {
        raffleCountElement.textContent = `Sorry, you didn't win.`;
    } else {
        raffleCountElement.textContent = `Your chance of winning: ${Math.round(userPercentageChance)}%`;
    }

   

}
</script>

