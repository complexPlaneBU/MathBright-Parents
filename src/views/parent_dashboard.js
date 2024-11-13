let DEBUG_DATA = 1;

// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/parents_dashboard_view.css'; // Path to your CSS file

// Append the link to the document's <head> section
document.head.appendChild(link);

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

    const appSection = document.getElementById('appSection');

    /*
    const logoA = document.querySelector('.partial-derivative-logo');
    const textLogo = document.querySelector('.text-logo');
    const splashScreen = document.getElementById('splashScreen');

    // Start bounce-in animation immediately
    logoA.style.animation = 'bounceIn 3s ease-out forwards';

    logoA.addEventListener('animationend', () => {
        textLogo.style.animation = 'throb 4s ease-in-out infinite';
    });

    try {
        await updateApp();
    } catch (error) {
        console.error('Error Initializing App:', error);
    } finally {
        // Stop animations when data loading completes
        textLogo.style.animation = 'none';
        splashScreen.style.display = 'none';
        //appSection.style.display = 'block';
        appSection.style.display = 'none';
    }
    */

    //renderrLoginHTML();
    //renderSignupHTML();


    //const authStateMachine = new AuthStateMachine('login');

    appSection.style.display = 'block';

    renderParentsDashboardViewHTML();

}
 




export async function renderParentsDashboardViewHTML() {
    try {
        const html = `
            <div>
                Rendering renderParentsDashboardViewHTML
            </div>

        `;
        const screenContainer = document.getElementById('home_screen');
        screenContainer.innerHTML = html;

        return Promise.resolve();
    } catch (error) {
        console.error('Error rendering parents_dashboard_view HTML:', error);
        return Promise.reject(error);
    }


}

async function isAuthenticated(username, password) {
    try {
        const response = await $.ajax({
            type: 'POST',
            url: 'index.php',
            data: JSON.stringify({
                controller: 'LoginController',
                action: 'isAuthenticated'
            })
        });
        const data = JSON.parse(response);

        if (data.response.loggedIn) { // Use data.response instead of response
            // User is logged in, update UI accordingly
            console.log('Logged in user:', data.response.userData);

            globalUsername = data.response.userData.username;
            globalUserLoggedIn = data.response.loggedIn;
            getInitialUserData(globalUsername);

            //            $('#formSection').hide();

            // Display the app section
            //          $('#appSection').show();
        } else {
            // User is not logged in, show login button or form
        }
    } catch (error) {
        console.error('Error checking login:', error);
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




