

// Create a <link> element
const link = document.createElement('link');

// Set the attributes for the link element
link.rel = 'stylesheet';
link.href = 'src/views/screens/signup.css'; // Path to your CSS file

// Append the link to the document's <head> section
document.head.appendChild(link);


export async function renderSignupHTML() {
    try {
        const html = `
            <div id="login-screen" class="screen">
                <h1>Login</h1>
                <form id="login-form">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" required />
                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password" required />
                    <button type="submit">Submit</button>
                    <a href="#">Forgot Password?</a>
                    <a href="#" id="signup-link">Sign Up</a>

                </form>
            </div>

            <div id="signup-screen" class="screen hidden">
                <h1>Signup</h1>
                <form id="signup-form">
                    <label for="signup-email">Email:</label> <!-- Changed id to avoid conflict -->
                    <input type="email" id="signup-email" required />
                    <button type="submit">Submit</button>
                    <a href="#" id="login-link">Already have an account? Login</a>
                </form>
            </div>

            <div id="otp-screen" class="screen hidden">
                <h1>Enter OTP</h1>
                <form id="otp-form">
                    <input type="text" id="otp" required />
                    <button type="submit">Verify OTP</button>
                </form>
                <button class="back-button">Back</button>
            </div>

            <div id="user-info-screen" class="screen hidden">
                <h1>Enter Your Info</h1>
                <form id="signup-form">
                    <input type="text" id="user-name" placeholder="Your Name" required />
                    <input type="password" id="user-password" placeholder="Create Password" required />
                    <button type="submit">Next</button>
                </form>
                <button class="back-button">Back</button>
            </div>

            <div id="kids-registration-screen" class="screen hidden">
                <h1>Register Your Kids</h1>
                <form id="child-form">
                    <input type="text" id="child-first-name" placeholder="Child's First Name" required />
                    <input type="text" id="child-last-name" placeholder="Child's Last Name" required />
                    <input type="number" id="child-age" placeholder="Child's Age" required />
                    <input type="text" id="child-grade" placeholder="Grade" required />
                    <input type="text" id="child-school" placeholder="School Name" required />
                    <button type="submit">Next</button>
                </form>
                <button class="back-button">Back</button>
            </div>

            <div id="subscription-screen" class="screen hidden">
                <h1>Select Subscription Plan</h1>
                <form id="subscription-form">
                    <label><input type="radio" name="subscription" value="monthly" /> Monthly</label>
                    <label><input type="radio" name="subscription" value="annual" /> Annual</label>
                    <button type="submit">Next</button>
                </form>
                <button class="back-button">Back</button>
            </div>

            <div id="payment-screen" class="screen hidden">
                <h1>Payment</h1>
                <form id="payment-form">
                    <button type="submit">Proceed to Payment</button>
                </form>
                <button class="back-button">Back</button>
            </div>

            <div id="confirmation-screen" class="screen hidden">
                <h1>Confirmation</h1>
                <p>Your account is set up successfully!</p>
            </div>

        `;
        const screenContainer = document.getElementById('signup_login_screens');
        screenContainer.innerHTML = html;

        return Promise.resolve();
    } catch (error) {
        console.error('Error rendering signup HTML:', error);
        return Promise.reject(error);
    }


}

export class AuthStateMachine {
    constructor(initialState = 'login') {
        this.state = initialState;  
        this.email = '';
        this.password = '';
        this.otp = '';
        this.userName = '';
        this.kids = [];
        this.plan = '';
        this.paymentStatus = '';
        this.init();
    }

    init() {
        // Bind event listeners for the login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Bind event listeners for the signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e)); // Make sure this points to handleSignup
        }

        // Bind event listeners for OTP verification
        const otpForm = document.getElementById('otp-form');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.verifyOtp(e));
        }

        // Bind event listeners for child registration
        const childForm = document.getElementById('child-form');
        if (childForm) {
            childForm.addEventListener('submit', (e) => this.registerChild(e));
        }

        // Bind event listeners for subscription plan selection
        const subscriptionForm = document.getElementById('subscription-form');
        if (subscriptionForm) {
            subscriptionForm.addEventListener('submit', (e) => this.selectSubscription(e));
        }

        // Bind event listener for payment
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.processPayment(e));
        }

        // Bind event listener for the "back" buttons on different forms
        const backButtons = document.querySelectorAll('.back-button');
        backButtons.forEach(button => {
            button.addEventListener('click', () => this.goBack());
        });

        // Bind event listener for the "Sign Up" link (triggering signup screen)
        const signupLink = document.getElementById('signup-link');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.state = 'signup'; // Change state to 'signup'
                this.updateUI();
            });
        }

        // Bind event listener for the "Login" link (triggering login screen)
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.state = 'login'; // Change state to 'login'
                this.updateUI();
            });
        }

        this.updateUI();
    }

    // Handle login form submission
    handleLogin(event) {
        event.preventDefault();
        this.email = document.getElementById('login-email').value;
        this.password = document.getElementById('login-password').value;

        // Perform login validation (simulated for now)
        if (this.email && this.password) {
            this.state = 'otp';  // Transition to OTP screen
            this.updateUI();
        } else {
            alert('Please enter valid credentials.');
        }
    }

    // Handle signup form submission
    handleSignup(event) {
        event.preventDefault();
        this.email = document.getElementById('signup-email').value;

        // Send OTP (simulated)
        this.state = 'otp';  // Transition to OTP screen
        this.updateUI();
    }

    // Verify OTP form submission
    verifyOtp(event) {
        event.preventDefault();
        this.otp = document.getElementById('otp').value;

        // Simulate OTP verification
        if (this.otp === '123456') {
            this.state = 'userInfo';  // Transition to user info (name and password)
            this.updateUI();
        } else {
            alert('Invalid OTP');
        }
    }

    // Handle user info (name and password) form submission
    handleUserInfo(event) {
        event.preventDefault();
        this.userName = document.getElementById('user-name').value;
        this.password = document.getElementById('user-password').value;

        // Proceed to kids registration
        this.state = 'kidsRegistration';
        this.updateUI();
    }

    // Register kids
    registerChild(event) {
        event.preventDefault();
        const childFirstName = document.getElementById('child-first-name').value;
        const childLastName = document.getElementById('child-last-name').value;
        const childAge = document.getElementById('child-age').value;
        const childGrade = document.getElementById('child-grade').value;
        const childSchool = document.getElementById('child-school').value;

        this.kids.push({ firstName: childFirstName, lastName: childLastName, age: childAge, grade: childGrade, school: childSchool });

        if (this.kids.length < 3) {
            // Ask for additional child if needed
            this.state = 'kidsRegistration';
        } else {
            // Move to subscription plan selection after 3 kids
            this.state = 'subscription';
        }
        this.updateUI();
    }

    // Select subscription plan (annual or monthly)
    selectSubscription(event) {
        event.preventDefault();
        this.plan = document.querySelector('input[name="subscription"]:checked').value;

        // Move to payment screen
        this.state = 'payment';
        this.updateUI();
    }

    // Process payment (simulate Stripe payment gateway)
    processPayment(event) {
        event.preventDefault();

        // Simulate payment success
        this.paymentStatus = 'success';

        // Move to confirmation screen
        this.state = 'confirmation';
        this.updateUI();
    }

    // Handle going back to previous screen
    goBack() {
        switch (this.state) {
            case 'otp':
                this.state = 'login';
                break;
            case 'userInfo':
                this.state = 'otp';
                break;
            case 'kidsRegistration':
                this.state = 'userInfo';
                break;
            case 'subscription':
                this.state = 'kidsRegistration';
                break;
            case 'payment':
                this.state = 'subscription';
                break;
            case 'signup':
                this.state = 'login'; // Allow going back from signup to login
                break;
            default:
                break;
        }
        this.updateUI();
    }

    // Update UI based on current state
    updateUI() {
        // First, hide all screens by adding the 'hidden' class to all elements with the 'screen' class
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));

        // Use requestAnimationFrame to ensure the browser has time to hide the previous screen
        requestAnimationFrame(() => {
            // Now, show the current screen based on the current state
            switch (this.state) {
                case 'login':
                    document.getElementById('login-screen').classList.remove('hidden');
                    break;
                case 'signup':
                    document.getElementById('signup-screen').classList.remove('hidden');
                    break;
                case 'otp':
                    document.getElementById('otp-screen').classList.remove('hidden');
                    break;
                case 'userInfo':
                    document.getElementById('user-info-screen').classList.remove('hidden');
                    break;
                case 'kidsRegistration':
                    document.getElementById('kids-registration-screen').classList.remove('hidden');
                    break;
                case 'subscription':
                    document.getElementById('subscription-screen').classList.remove('hidden');
                    break;
                case 'payment':
                    document.getElementById('payment-screen').classList.remove('hidden');
                    break;
                case 'confirmation':
                    document.getElementById('confirmation-screen').classList.remove('hidden');
                    break;
                default:
                    console.log('Unknown state:', this.state);
                    break;
            }
        });
    }

}



export async function renderSignupHTML_old() {
    try {
        const html = `
            <div class="signup-container">
              <!-- Logo -->
              <div class="signup-logo"><a href="#">M<span style="color:#71AFFF">∂</span>thBright</a></div>
              <div class="signup-headline">Parent's Let's get started</div>

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
                <button type="submit" class="btn">Signup</button>

                <!-- Sign In Link -->
                <div class="link-container">
                  <p>Already have an account? <a href="#">Login here</a></p>
                </div>
              </form>
            </div>
        `;
        const screenContainer = document.getElementById('signup_login_screens');
        screenContainer.innerHTML = html;

        return Promise.resolve();
    } catch (error) {
        console.error('Error rendering signup HTML:', error);
        return Promise.reject(error);
    }


}