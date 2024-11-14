

document.addEventListener('DOMContentLoaded', async function () {
    initializeApp();
})

async function initializeApp() {

  //  renderVerifyEmailHTML();

    const verifyEmailSection = document.getElementById('verifyEmailSection');
    const tokenToVerify = verifyEmailSection.getAttribute('data-state');

    const ret = verifyEmailToken("79f4b7a46b95e471657e7ce79e062ae7");

}




async function verifyEmailToken(token) {
    try {
        const url = 'https://api.mathbright.co/signup/verifyEmailToken';
        const postData = {
            token: token
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (data.success) {
            return data;  // Return data on success
        } else {
            throw new Error(data.error || 'Error verifying OTP.');
        }
    } catch (error) {
        // Return a failure response for error handling in the frontend
        console.error('Error verifying OTP:', error.message);
        return { success: false, error: error.message };
    }
}