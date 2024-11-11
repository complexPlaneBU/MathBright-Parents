


export function renderLessonsHTML() {
    const html = `
    <div id="lessons-container">
        <div class="lessons-header">
          <i class="fa fa-award fa-2x" aria-hidden="true"></i>
          <h3>Lesson Progress</h3>
        </div>
        <div class="lessons-content">
          <p class="lessons-congrats"></p>
          <div class="progress-bar segmented">
              <div class="progress-bar-segment" id="lessons-progress-bar-segment-1"></div>
              <div class="progress-bar-segment" id="lessons-progress-bar-segment-2"></div>
              <div class="progress-bar-segment" id="lessons-progress-bar-segment-3"></div>
              <div class="progress-bar-segment" id="lessons-progress-bar-segment-4"></div>
          </div>
          <p class="lessons-description"></p>
        </div>
  </div>
`;
    const lessonsContainer = document.getElementById('lessons-tab-content');
    lessonsContainer.innerHTML = html;
}





// Function to update the Raffle Tickets tab

export function updateLessons(weekType = 'this_week') {
    console.log("in updateLessons");

    const stats = lastTwoWeeksStatsData.data;
    const contentWeekTextPanel = document.querySelector('.lessons-content');

    if (!appState.gLoggedIn) {
        contentWeekTextPanel.innerHTML = `Login to see lessons completed `;
        return;
    }

    if (!stats[weekType]) {
        if (contentWeekTextPanel) { // Check if contentWeekTextPanel is not null

            contentWeekTextPanel.innerHTML = `<p>Lessons Data is resetting for this week</p> `;
        } else {
            console.error("contentWeekTextPanel not found");
        }
        return;
    } else {
        renderLessonsHTML();
    }

    const lessonsContainer = document.getElementById('lessons-tab-content');

    const lessonsTabCongrats = document.querySelector('#lessons-tab-content .lessons-congrats');
    const lessonsTabDescription = document.querySelector('#lessons-tab-content .lessons-description');

    let d = lastTwoWeeksStatsData.data[weekType];
    console.log(weekType, " week_start_epoch = ", d.week_start_epoch, " lessons completed = ", d.lessons_completed);
    

    updateLessonProgress(d.lessons_completed); // Call the updated function


    const lessonsToGo = d.Lessons_required - d.lessons_completed;
    if (d.lessons_completed === 0) {
        lessonsTabCongrats.textContent = `Let’s Get Started, ${d.username}!`;
        lessonsTabDescription.textContent = `You haven’t completed any lessons this week, but there’s still time! Dive into your first lesson and start earning those Parent Rewards. You can do it!`;

    } else if (d.lessons_completed < 4) {
        lessonsTabCongrats.textContent = `Keep Going ${d.username}!`;
        lessonsTabDescription.textContent = `You’re doing great with ${d.lessons_completed} lessons completed this week. Just ${lessonsToGo} more to earn a Parent Reward! You can do it!`;
    } else { // 4 or greater
        lessonsTabCongrats.textContent = `Congratulations ${d.username}!`;
        lessonsTabDescription.textContent = `You have completed ${d.lessons_completed} lessons and earned ${d.parent_reward_rate} Parent Reward.`;
    }

}






    // Function to handle segmented progress bars for Parent Reward tab
    function updateLessonProgress(lessonsCompleted) {
        const segments = document.querySelectorAll('#lessons-container .progress-bar-segment');
        const totalSegments = segments.length;

        // Calculate how many segments to fill based on lessons completed
        const segmentsToFill = Math.min(totalSegments, lessonsCompleted);

        // Fill in the segments
        segments.forEach((segment, index) => {
            if (index < segmentsToFill) {
                segment.style.width = `${100 / totalSegments}%`;
                segment.style.backgroundColor = '#28A745'; // Set the color to green
            } else {
                segment.style.width = '0';
            }
        });
    }

 



