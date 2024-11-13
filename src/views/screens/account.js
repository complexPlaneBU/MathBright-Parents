
// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/screens/account.css'; // Path to your CSS file

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

export async function renderAccountScreenHTML() {
    try {
        const html = `
            <div>
                Rendering renderAccountScreenHTML HTML

                account_screen 
                </br>- see subscription info
                </br>- logout button
                </br>- get help link (FAQ, Blog, Contact Us)
                </br>- cancel subscription (send email)
                2
            </div>
        `;
        const screenContainer = document.getElementById('account_screen');
        screenContainer.innerHTML = html;

        return Promise.resolve();
    } catch (error) {
        console.error('Error rendering renderAccountScreenHTML HTML:', error);
        return Promise.reject(error);
    }
}




