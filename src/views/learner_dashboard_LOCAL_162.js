

    import { getUserAvatarUrl } from './utils.js';
import { updateRaffleTickets } from './learner_dashboard/raffle.js';


    $(document).ready(function() {

        /*
    // Function to get the user avatar URL
    function getUserAvatarUrl(user) {
        const avatarConfig = JSON.parse(user.avatar_config);
        if (avatarConfig) {
            let avatarUrl = 'https://avataaars.io/?';
            Object.keys(avatarConfig).forEach(key => {
                avatarUrl += `${key}=${avatarConfig[key]}&`;
            });
            return avatarUrl;
        } else {
            return 'https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Blank&hatColor=PastelBlue&facialHairType=BeardMajestic&facialHairColor=Black&clotheType=ShirtVNeck&clotheColor=Black&eyeType=WinkWacky&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Light';
        }
    }
    */

        let weeklyStatsData = null;

    // Form submission handling
    $('#usernameForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the username value
        const username = $('#username').val();
        console.log(username);

        // Make an AJAX request to the server
        $.ajax({
            url: 'index.php',
            type: 'GET',
            data: {
                controller: 'LearnerDashboardController',
                action: 'GetThisWeekStatsByUsername', // default action
                username: username,
                num_users: 10,
                week_start_epoch: 1724659200,
            },
            success: function(response) {
                // Hide the form section
                $('#formSection').hide();

                // Display the app section
                $('#appSection').show();

                // Update the DOM with the server response
                console.log(response);

                const data = JSON.parse(response);
                if (data.success) {
                    weeklyStatsData = data;

                    // update Raffle Tab
                    updateRaffleTickets(data.data.Raffle_percentage, data.data.week_start_epoch, data.data.username);

                    const xpTotal = data.data.Xp_total; // Remove the [0] index
                    $('.xp-value').text(xpTotal);
                    console.log('XP Total:', xpTotal);

                    // Display user information
                    $('.username').text(data.data.username);

                    // Get and display the user avatar
                    const avatarUrl = getUserAvatarUrl(data.data);
                    $('#userAvatar img').attr('src', avatarUrl);

                    // Display additional data if available
                    const testDataDiv = document.querySelector('#gems-tab-content');

                    if (testDataDiv) {
                        testDataDiv.innerHTML = '';
                        Object.keys(data.data).forEach(key => {
                            const value = data.data[key];
                            const paragraph = document.createElement('p');
                            paragraph.textContent = `${key}: ${value}`;
                            testDataDiv.appendChild(paragraph);
                        });
                    }
                    $('#results').html('<p> this is the results section </p>');

                } else {
                    console.error(data.error);
                    $('#results').html('<p>' + data.error + '</p>');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error: ', status, error);
                $('#results').html('<p>An error occurred while processing your request.</p>');
            }
        });
    });



    // Tab switching logic
    $('.tab').on('click', function () {
        const tabId = $(this).attr('id');
        const tabContentId = `#${tabId}-content`;

        // Remove active class from all tabs, tab contents, and week-tabs
        $('.tab').removeClass('active');
        $('.tab-content').removeClass('active');
        //$('.week-tab').removeClass('active');

        // Add active class to the clicked tab, the corresponding tab content, and week-tabs
        $(this).addClass('active');
        $(tabContentId).addClass('active');

        /*
        // Show/hide week-tabs based on the active tab
        if (tabId === 'rank-tab') {
            $('.week-tabs').show();
            // Add active class to the first week-tab by default
            $('.week-tab:first-child').addClass('active');
        } else {
            $('.week-tabs').hide();
        }
        */
    });

    // Add event listener to week-tabs
    $('.week-tab').on('click', function () {
        // Remove active class from all week-tabs
        $('.week-tab').removeClass('active');
        // Add active class to the clicked week-tab
        $(this).addClass('active');
    });

    // Add event listener to rank-sub-tabs
    $('.rank-sub-tab').on('click', function () {
        // Remove active class from all rank-sub-tabs
        $('.rank-sub-tab').removeClass('active');
        // Add active class to the clicked rank-sub-tab
        $(this).addClass('active');
    });

 
    // Add event listeners to sub-tabs
    $('#this-week-tab').click(function () {
        $(this).addClass('active');
        $('#last-week-tab').removeClass('active');
        updateLeaderboard(); // Call updateLeaderboard with this week's data
    });

    $('#last-week-tab').click(function () {
        $(this).addClass('active');
        $('#this-week-tab').removeClass('active');
        updateLeaderboard('last_week'); // Call updateLeaderboard with last week's data
    });

    // Add active class to the clicked week-tab
    $('.week-tab').removeClass('active');
    $(this).addClass('active');

    // Initialize "This Week" tab as active
    $('#this-week-tab').addClass('active');

    // Initialize default tab content
    const defaultTab = document.querySelector('.tab.active');
    if (defaultTab) {
        const defaultContentId = `#${defaultTab.id}-tab-content`;
        const defaultContentElement = document.querySelector(defaultContentId);
        if (defaultContentElement) {
            defaultContentElement.classList.add('active');
        }
    }

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (hamburgerMenu && dropdownMenu) {
        hamburgerMenu.addEventListener('click', () => {
            dropdownMenu.classList.toggle('active');
        });

        dropdownMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-item')) {
                // Handle menu item click
                console.log(e.target.textContent);
            }
        });
    } else {
        console.error('Hamburger menu or dropdown menu not found.');
    }
});


// back button functionality
document.querySelector('.back-button').addEventListener('click', () => {
    document.getElementById('appSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
});

