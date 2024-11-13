
/*
import { getUserAvatarUrl } from './utils.js';

*/
import { renderrLoginHTML } from './screens/login.js';
import { AuthStateMachine } from './screens/signup.js';
import { renderSignupHTML } from './screens/signup.js';
import appState from './state.js';

document.addEventListener('DOMContentLoaded', async function () {
    initializeApp();
})

async function initializeApp() {

    renderSignupHTML();
    //renderrLoginHTML();
    //renderSignupHTML();

    const loginSection = document.getElementById('loginSection');
    const initialState = loginSection.getAttribute('data-state');

    const authStateMachine = new AuthStateMachine(initialState);

}



export async function checkUserAuthentication(username) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'isAuthenticated', // Action for checking authentication
                username: username // Include the username to check against
            }),
            contentType: 'application/json',
            dataType: 'json' // Expecting JSON response from the server
        });

        // Check the response to see if the user is authenticated
        if (response.response.loggedIn) {
            // User is authenticated
            console.log('User is authenticated:', response);
            updateUserDataIfLoggedIn();
            return response; // Return response for further handling
        } else {
            // User is not authenticated
            console.log('User is not authenticated:', response.error);
            return response; // Return response to handle any errors
        }
    } catch (error) {
        console.error('Error checking user authentication:', error, error.stack, error.message, error.responseText);
        throw error; // Re-throw the error for the caller to handle
    }
}


function initializeLoginModalEventListeners() {
   
    // Login Form submission handling
    $('#loginForm1').off('submit').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        console.log("in #loginForm submit button event handler");

        // Get the form data
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        // Make an AJAX request to the server
        $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'login',
                username: username,
                password: password
            }),
            contentType: 'application/json',
            success: function (response) {
                const data = JSON.parse(response);
                console.log("login data", data);
                if (data.response.success) {
                    // Get user reward data and wait for it to finish
                    initializeApp().then(() => {

                      

                    }).catch(error => {
                        console.error('Error fetching rewards:', error);
                        $('#loginResponse').html('<p>Failed to load rewards data.</p>');
                    });
                    initializeApp();
                } else {
                    $('#loginResponse').html('<p>' + data.error + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#loginResponse').html('<p>An error occurred while processing your request.</p>');
            }
        });
    });

    // Logout button click handling

    $('#logoutButton').off('click').on('click', function (event) {
        event.preventDefault(); // Prevent the default button behavior

        console.log("in #logoutButton click event handler");

        // Make an AJAX request to the server
        $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'logout'
            }),
            contentType: 'application/json',
            success: function (response) {
                const data = JSON.parse(response);
                console.log("logout data", data);
                if (data.success) {
                    $('#logoutResponse').html('<p>Logout successful!</p>');

                    // Hide/show buttons and elements
                    document.getElementById('openLoginModal').style.display = 'block';
                    document.getElementById('logoutButton').style.display = 'none';

                    // Optionally show modal or redirect
                    $('.header').show();
                    $('#logoutButton').hide();
                    $('.user-profile').hide();
                    $('.rewards-profile-dashboard').hide();
                    $('.tabs').hide();
                } else {
                    $('#logoutResponse').html('<p>' + data.error + '</p>');
                }
            },
            error: function (xhr, status, error) {
                $('#logoutResponse').html('<p>An error occurred while processing your request.</p>');
            }
        });
    });


}





