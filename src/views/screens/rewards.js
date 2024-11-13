
// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/screens/rewards.css'; // Path to your CSS file

// Append the link to the document's <head> section
document.head.appendChild(link);

/*
import { getUserAvatarUrl } from './utils.js';
*/
//import { renderrLoginHTML } from './screens/login.js';
//import { AuthStateMachine } from './screens/signup.js';
//import { renderSignupHTML } from './screens/signup.js';
//import appState from './state.js';


document.addEventListener('DOMContentLoaded', async function () {
    //initializeApp();
})



function addEventListeners() {
    //document.querySelectorAll('.bottom-nav button').forEach(button => {
    //    button.addEventListener('click', handleMenuIconClick);
    //});
}

export async function renderRewardsScreenHTML() {
    try {
        const html = `
            <div>
               - Rendering renderRewardsScreenHTML HTML 3

                rewards_screen 3
                </br>- show stats of kids
                </br>-- lesson completion data (qty and time completed)
                </br>-- similar to emails that are sent
                2
            </div>
        `;
        const screenContainer = document.getElementById('rewards_screen');
        screenContainer.innerHTML = html;

        return Promise.resolve();
    } catch (error) {
        console.error('Error rendering renderRewardsScreenHTML HTML:', error);
        return Promise.reject(error);
    }
}




