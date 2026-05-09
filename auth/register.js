/**
 * PUNARDAAN REGISTRATION SYSTEM
 * Powered by Core.js
 */

let selectedRole = null;

document.addEventListener('DOMContentLoaded', () => {
    if (Core.state.isAuthenticated) {
        Core.auth.redirect();
    }
});

/**
 * Select user role and move to next step
 */
function selectRole(role) {
    selectedRole = role;
    
    // UI Feedback
    document.querySelectorAll('.role-card').forEach(card => card.classList.remove('selected'));
    const selectedCard = document.querySelector(`[data-role="${role}"]`);
    if (selectedCard) selectedCard.classList.add('selected');

    // Smooth transition
    setTimeout(() => {
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        
        const roleInfo = getRoleInfo(role);
        document.getElementById('roleTitle').textContent = `Register as ${roleInfo.title}`;
        document.getElementById('roleDescription').textContent = roleInfo.description;
        
        loadRoleForm(role);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
}

/**
 * Go back to role selection
 */
function goBackToRoles() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    selectedRole = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get role details for display
 */
function getRoleInfo(role) {
    const roles = {
        donor: { title: 'Donor', description: 'Share resources and save lives' },
        ngo: { title: 'NGO', description: 'Register your organization' },
        volunteer: { title: 'Volunteer', description: 'Dedicate your time' },
        student: { title: 'Student', description: 'Access educational support' },
        blood_donor: { title: 'Blood Donor', description: 'Emergency support' },
        animal_shelter: { title: 'Animal Shelter', description: 'Care for animals' },
        receiver: { title: 'Receiver', description: 'Request community help' },
        restaurant: { title: 'Restaurant', description: 'Donate surplus food' },
        school: { title: 'School/Library', description: 'Education network' },
        hospital: { title: 'Hospital', description: 'Blood bank partner' }
    };
    return roles[role] || { title: 'User', description: 'Join Punardaan' };
}

/**
 * Dynamic form loading based on role
 */
function loadRoleForm(role) {
    const container = document.getElementById('formContainer');
    let formHtml = `
        <div class="form-section">
            <h3><i class="fas fa-user-circle"></i> Account Details</h3>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" required placeholder="Enter full name">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="email@example.com">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" required placeholder="10-digit number">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required placeholder="Min 6 characters">
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" required placeholder="Repeat password">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
            <div class="form-group">
                <label>Address</label>
                <input type="text" name="address" required placeholder="Street address, City">
            </div>
        </div>
    `;

    // Add role-specific fields
    if (role === 'ngo' || role === 'hospital' || role === 'school') {
        formHtml += `
            <div class="form-section">
                <h3><i class="fas fa-building"></i> Organization Details</h3>
                <div class="form-group">
                    <label>Registration Number</label>
                    <input type="text" name="regNo" required placeholder="Govt Reg No">
                </div>
            </div>
        `;
    }

    if (role === 'blood_donor') {
        formHtml += `
            <div class="form-section">
                <h3><i class="fas fa-tint"></i> Medical Info</h3>
                <div class="form-group">
                    <label>Blood Group</label>
                    <select name="bloodGroup">
                        <option>O+</option><option>O-</option><option>A+</option>
                        <option>A-</option><option>B+</option><option>B-</option>
                        <option>AB+</option><option>AB-</option>
                    </select>
                </div>
            </div>
        `;
    }

    container.innerHTML = formHtml;
}

/**
 * Handle Registration
 */
async function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    if (data.password !== data.confirmPassword) {
        Core.showToast('Passwords do not match', 'error');
        return;
    }

    if (!Core.utils.validateEmail(data.email)) {
        Core.showToast('Invalid email address', 'error');
        return;
    }

    if (!Core.utils.validatePhone(data.phone)) {
        Core.showToast('Invalid phone number', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const stopLoading = Core.showLoading(submitBtn, 'Creating Account...');

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = Core.auth.register({
            ...data,
            role: selectedRole
        });

        if (result.success) {
            Core.showToast('Account created successfully! Redirecting...', 'success');
            Core.auth.saveSession(result.user);
            setTimeout(() => Core.auth.redirect(), 1500);
        } else {
            Core.showToast(result.error, 'error');
            stopLoading();
        }
    } catch (err) {
        Core.showToast('Registration failed. Please try again.', 'error');
        stopLoading();
    }
}

// Global Event Listeners
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

// Attach to window for HTML calls
window.selectRole = selectRole;
window.goBackToRoles = goBackToRoles;
window.handleRegister = handleRegister;