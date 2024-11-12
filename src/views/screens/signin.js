

// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/screens/signup.css'; // Path to your CSS file

// Append the link to the document's <head> section
document.head.appendChild(link);


export function renderSignupHTML() {
    const html = `
            <div class="login-container">
              <!-- Logo -->
              <div class="login-logo"><a href="#">M<span style="color:#71AFFF">∂</span>thBright</a></div>

              <!-- Signup Form -->
              <form id="signupForm">
                <!-- Email Field -->
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>

                <!-- First and Last Name Fields -->
                <div class="form-group">
                  <div style="display:flex; justify-content:space-between;">
                    <div style="width:49%;">
                      <label for="firstName">First Name</label>
                      <input type="text" id="firstName" name="firstName" required placeholder="Enter your first name">
                    </div>
                    <div style="width:49%;">
                      <label for="lastName">Last Name</label>
                      <input type="text" id="lastName" name="lastName" required placeholder="Enter your last name">
                    </div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <p>By signing up, you agree to our <a href="#" style="text-decoration:none;">Terms of Use</a> and <a href="#" style="text-decoration:none;">Privacy Policy</a>.</p>

                <!-- Continue Button -->
                <button type="submit" class="btn">Continue with Email</button>

                <!-- Sign In Link -->
                <div class="link-container">
                  <p>Already have an account? <a href="#">Sign in</a></p>
                </div>
              </form>
            </div>
        `;
    const screenContainer = document.getElementById('login-screen');
    screenContainer.innerHTML = html;


}

