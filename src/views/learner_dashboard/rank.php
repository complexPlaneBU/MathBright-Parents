<div class="leaderboard" id="leaderboard"> <!-- Add margin to make space for user details -->
    <?php

if (isset($leaderboardData) && !empty($leaderboardData)) {
    // Display the leaderboard data

    // Assuming $leaderboardData is the response from the getTopUsers function
    $users = $leaderboardData['data'];

    // Function to create leaderboard items
    function createLeaderboardItem($user, $rank) {
        $avatarConfig = json_decode($user['avatar_config'], true);
        $avatarUrl = 'https://avataaars.io/?';

        if ($avatarConfig) {
            foreach ($avatarConfig as $key => $value) {
                $avatarUrl .= $key . '=' . $value . '&';
            }
        } else {
            $avatarUrl .= 'avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelBlue&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Black&eyeType=WinkWacky&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light';
        }

        echo '<div class="leaderboard-item">';
        echo '<span class="rank">' . $rank . '</span>';
        echo '<img src="' . $avatarUrl . '" alt="Avatar">';
        echo '<span class="username">' . $user['username'] . '</span>';
        echo '<span class="xp">' . $user['Xp_total'] . ' XP</span>';
        echo '</div>';
    }

    // Load top users
    $rank = 1;
    foreach ($users as $user) {
        createLeaderboardItem($user, $rank);
        $rank++;
    }
    ?>
</div>

<!-- User Details -->
<div id="user-summary" style="position: sticky; bottom: 0;">
    <span class="username" style="font-size: 24px; font-weight: bold; color: black;">NezukoGojo</span>
    <div class="user-stats">
        <p><span class="stat-label xp-score">XP earned:</span> 118.4 XP</p>
        <p><span class="stat-label">Lessons Completed:</span> 4 lessons</p>
        <p><span class="stat-label">Completion Days:</span> 4 days</p>
        <p><span class="stat-label">Practice Time:</span> 2h 31m</p>
    </div>
</div>

<?php
} else {
    echo '<p>No leaderboard data available.</p>';
}
?>
