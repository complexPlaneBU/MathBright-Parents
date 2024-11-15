

document.addEventListener('DOMContentLoaded', async function () {
    initializeApp();
})



async function initializeApp() {
    const verifyEmailSection = document.getElementById('verifyEmailSection');
    const tokenToVerify = verifyEmailSection.getAttribute('data-state');

    const verificationStatus = await verifyEmailToken(tokenToVerify);
    updateVerificationStatus(verificationStatus);
}

function updateVerificationStatus({ success, error }) {
    const verificationStatus = document.querySelector('.verification-status');
    const loader = verificationStatus.querySelector('.loader');
    const successMessage = verificationStatus.querySelector('.success-message');
    const errorMessage = verificationStatus.querySelector('.error-message');

    loader.style.display = 'none';

    if (success) {
        successMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'block';
        document.getElementById('error-message').innerText = error;
    }
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