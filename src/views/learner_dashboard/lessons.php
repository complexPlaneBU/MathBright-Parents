<!-- lessons content goes here -->

<!-- lessons content goes here -->
<style>
    .progress-bar {
        display: flex;
        width: 100%;
        height: 20px;
        border-radius: 10px;
        background-color: #f0f0f0;
    }

    .progress-bar-segment {
        width: 0%;
        height: 100%;
        background-color: green;
        transition: width 0.5s ease-in-out;
    }

    .indicator {
        position: relative;
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        background-color: #fff;
        border-radius: 50%;
        border: 2px solid green;
    }
</style>

<div class="lessons" id="lessons">
    <h3>Parent Reward</h3>
    <div class="progress-bar segmented">
        <div class="progress-bar-segment" id="progress-bar-segment-1"></div>
        <div class="progress-bar-segment" id="progress-bar-segment-2"></div>
        <div class="progress-bar-segment" id="progress-bar-segment-3"></div>
        <div class="progress-bar-segment" id="progress-bar-segment-4"></div>
        <div class="indicator"></div>
    </div>
    <p class="tab-congrats">Description about Parent Reward tab goes here...</p>
    <p class="tab-description">Description about Parent Reward tab goes here...</p>
    <table>
        <!-- Table rows for Parent Reward tab -->
    </table>

    <?php
    echo "lessons content goes here";
    ?>
</div>

<script>
    // Function to handle segmented progress bars for Parent Reward tab
    function updateParentRewardProgress(lessonsCompleted) {
        const segments = document.querySelectorAll('.progress-bar-segment');
        const totalSegments = segments.length;

        // Calculate how many segments to fill based on lessons completed
        const segmentsToFill = Math.min(totalSegments, lessonsCompleted);

        // Fill in the segments
        segments.forEach((segment, index) => {
            if (index < segmentsToFill) {
                segment.style.width = `${100 / totalSegments}%`;
                segment.style.backgroundColor = 'green'; // Add this line to set the color
            } else {
                segment.style.width = '0';
            }
        });
    }

    // Call the function when the document is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        updateParentRewardProgress(2);
    });
</script>