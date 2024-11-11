

    // Create a <link> element
    const link = document.createElement('link');

    // Set the attributes for the link element
    link.rel = 'stylesheet';
    link.href = 'src/views/screens/login.css'; // Path to your CSS file

    // Append the link to the document's <head> section
    document.head.appendChild(link);


    export function renderrLoginHTML() {
        const html = `
            <div class="login-container">
            <!-- Logo -->
            <div class="login-logo"><a href="#">M<span style="color:#71AFFF">∂</span>thBright</a></div>


            <!-- Login Form -->
            <form id="loginForm">
                <!-- Email Field -->
                <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>

                <!-- Password Field -->
                <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>

                <!-- Sign In Button -->
                <button type="submit" class="btn">Sign In</button>

                <!-- Forgot Password Link -->
                <div class="link-container">
                <a href="#">I forgot my password</a>
                </div>

                <!-- Sign Up Link -->
                <div class="link-container">
                <p>Don't have an account? </p><p><a href="#">Sign up now</a></p>
                </div>
            </form>
            </div>
        `;
        const screenContainer = document.getElementById('login-screen');
        screenContainer.innerHTML = html;


}

