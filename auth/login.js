/**
 * PUNARDAAN LOGIN SYSTEM
 * Powered by Core.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if already authenticated
    if (Core.state.isAuthenticated) {
        Core.auth.redirect();
    }
});

/**
 * Handle Login Form Submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    // Basic Validation
    if (!Core.utils.validateEmail(email)) {
        Core.showToast('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 6) {
        Core.showToast('Password must be at least 6 characters', 'error');
        return;
    }

    // Show Loading
    const stopLoading = Core.showLoading(loginBtn, 'Authenticating...');

    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = Core.auth.login(email, password);

        if (result.success) {
            Core.showToast(`Welcome back, ${result.user.name}!`, 'success');
            setTimeout(() => {
                Core.auth.redirect();
            }, 1000);
        } else {
            Core.showToast(result.error, 'error');
            stopLoading();
        }
    } catch (err) {
        Core.showToast('An unexpected error occurred. Please try again.', 'error');
        stopLoading();
    }
}

/**
 * Switch between Email and Phone login tabs
 */
function switchLoginTab(type) {
    document.querySelectorAll('.login-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${type}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${type}-tab"]`).classList.add('active');
}

/**
 * Toggle Password Visibility
 */
function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    const icon = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Global Event Listeners for Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}