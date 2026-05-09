// ================= BLOOD DASHBOARD JAVASCRIPT =================

// DOM Elements
const bloodDonationForm = document.getElementById('bloodDonationForm');
const bloodRequestForm = document.getElementById('bloodRequestForm');
const sidebar = document.getElementById('sidebar');
const darkModeBtn = document.getElementById('darkModeBtn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupFormValidation();
    setupDateConstraints();
    setupHealthQuestions();
    loadSavedData();
});

// ================= INITIALIZATION =================

function initializeDashboard() {
    // Set active sidebar menu
    const currentSection = window.location.hash || '#dashboard';
    setActiveSidebarItem(currentSection);

    // Handle sidebar navigation
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            setActiveSidebarItem(target);
            smoothScrollTo(target);
        });
    });

    // Handle window resize for sidebar
    window.addEventListener('resize', handleSidebarResize);
    handleSidebarResize();
}

// ================= SIDEBAR MANAGEMENT =================

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function setActiveSidebarItem(target) {
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.sidebar-menu a[href="${target}"]`).classList.add('active');
}

function handleSidebarResize() {
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.add('open');
    }
}

// ================= FORM VALIDATION =================

function setupFormValidation() {
    // Blood donation form
    bloodDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateBloodDonationForm()) {
            submitBloodDonation();
        }
    });

    // Blood request form
    bloodRequestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateBloodRequestForm()) {
            submitBloodRequest();
        }
    });

    // Real-time validation
    const forms = [bloodDonationForm, bloodRequestForm];
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateBloodDonationForm() {
    let isValid = true;
    const requiredFields = bloodDonationForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Age validation
    const age = parseInt(document.getElementById('age').value);
    if (age < 18 || age > 65) {
        showError(document.getElementById('age'), 'Age must be between 18 and 65');
        isValid = false;
    }

    // Weight validation
    const weight = parseInt(document.getElementById('weight').value);
    if (weight < 45) {
        showError(document.getElementById('weight'), 'Minimum weight requirement is 45kg');
        isValid = false;
    }

    // Last donation validation
    const lastDonation = document.getElementById('lastDonation').value;
    if (lastDonation) {
        const lastDate = new Date(lastDonation);
        const today = new Date();
        const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysSince < 56) {
            showError(document.getElementById('lastDonation'), 'Must wait 56 days between donations');
            isValid = false;
        }
    }

    return isValid;
}

function validateBloodRequestForm() {
    let isValid = true;
    const requiredFields = bloodRequestForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Units validation
    const units = parseInt(document.getElementById('unitsNeeded').value);
    if (units < 1 || units > 10) {
        showError(document.getElementById('unitsNeeded'), 'Units needed must be between 1 and 10');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Remove existing error messages
    removeError(field);

    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid 10-digit mobile number');
            isValid = false;
        }
    }

    // Number validation
    if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (field.min && numValue < parseFloat(field.min)) {
            showError(field, `Minimum value is ${field.min}`);
            isValid = false;
        }
        if (field.max && numValue > parseFloat(field.max)) {
            showError(field, `Maximum value is ${field.max}`);
            isValid = false;
        }
    }

    return isValid;
}

function showError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 12px;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;

    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc2626';
}

function removeError(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.style.borderColor = field.value ? '#dc2626' : '#e2e8f0';
}

// ================= DATE CONSTRAINTS =================

function setupDateConstraints() {
    // Set minimum date for preferred date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    document.getElementById('preferredDate').min = minDate;
    document.getElementById('requiredBy').min = new Date().toISOString().split('T')[0];
}

// ================= HEALTH QUESTIONS =================

function setupHealthQuestions() {
    const healthQuestions = document.querySelectorAll('.health-questions input[type="checkbox"]');

    healthQuestions.forEach(question => {
        question.addEventListener('change', function() {
            if (this.checked) {
                const questionText = this.parentNode.textContent.trim();
                showToast(`Health concern noted: ${questionText}`, 'warning');
            }
        });
    });
}

// ================= ELIGIBILITY CHECK =================

function checkEligibility() {
    const age = parseInt(document.getElementById('age').value);
    const weight = parseInt(document.getElementById('weight').value);
    const lastDonation = document.getElementById('lastDonation').value;

    let eligible = true;
    let reasons = [];

    if (!age || age < 18 || age > 65) {
        eligible = false;
        reasons.push('Age must be between 18 and 65');
    }

    if (!weight || weight < 45) {
        eligible = false;
        reasons.push('Weight must be at least 45kg');
    }

    if (lastDonation) {
        const lastDate = new Date(lastDonation);
        const today = new Date();
        const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysSince < 56) {
            eligible = false;
            reasons.push(`Must wait ${56 - daysSince} more days before donating`);
        }
    }

    if (eligible) {
        showToast('✅ You are eligible to donate blood!', 'success');
    } else {
        showToast(`❌ Not eligible: ${reasons.join(', ')}`, 'error');
    }
}

// ================= FORM SUBMISSIONS =================

function submitBloodDonation() {
    const formData = new FormData(bloodDonationForm);

    const donationData = {
        donorName: document.getElementById('donorName').value,
        age: document.getElementById('age').value,
        bloodType: document.getElementById('bloodType').value,
        gender: document.getElementById('gender').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        weight: document.getElementById('weight').value,
        lastDonation: document.getElementById('lastDonation').value,
        preferredCenter: document.getElementById('preferredCenter').value,
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value,
        healthConcerns: getHealthConcerns(),
        additionalNotes: document.getElementById('additionalNotes').value,
        timestamp: new Date().toISOString(),
        status: 'scheduled'
    };

    // Save to localStorage
    saveToLocalStorage('bloodDonations', donationData);

    showToast('Blood donation scheduled successfully!', 'success');
    bloodDonationForm.reset();
    showToast('Appointment confirmation sent to your mobile', 'success');
}

function submitBloodRequest() {
    const formData = new FormData(bloodRequestForm);

    const requestData = {
        patientName: document.getElementById('patientName').value,
        relationship: document.getElementById('relationship').value,
        bloodType: document.getElementById('requestBloodType').value,
        unitsNeeded: document.getElementById('unitsNeeded').value,
        requesterName: document.getElementById('requesterName').value,
        requesterMobile: document.getElementById('requesterMobile').value,
        hospitalName: document.getElementById('hospitalName').value,
        urgency: document.getElementById('urgency').value,
        hospitalAddress: document.getElementById('hospitalAddress').value,
        requiredBy: document.getElementById('requiredBy').value,
        requiredByTime: document.getElementById('requiredByTime').value,
        reason: document.getElementById('reason').value,
        timestamp: new Date().toISOString(),
        status: 'active'
    };

    // Save to localStorage
    saveToLocalStorage('bloodRequests', requestData);

    showToast('Blood request submitted successfully!', 'success');
    bloodRequestForm.reset();
    showToast('Searching for compatible donors...', 'success');
}

function getHealthConcerns() {
    const concerns = [];
    const checkboxes = document.querySelectorAll('.health-questions input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        concerns.push(checkbox.parentNode.textContent.trim());
    });

    return concerns;
}

// ================= FIND DONORS =================

function findDonors() {
    const bloodType = document.getElementById('requestBloodType').value;
    const units = document.getElementById('unitsNeeded').value;
    const urgency = document.getElementById('urgency').value;

    if (!bloodType) {
        showToast('Please select blood type first', 'error');
        return;
    }

    // Simulate finding donors
    showToast(`Searching for ${bloodType} donors...`, 'success');

    setTimeout(() => {
        const mockDonors = Math.floor(Math.random() * 10) + 1;
        showToast(`Found ${mockDonors} compatible donors within 10km!`, 'success');
    }, 2000);
}

// ================= EMERGENCY SOS =================

function sendSOS() {
    const bloodType = document.getElementById('sosBloodType').value;
    const location = document.getElementById('sosLocation').value;
    const message = document.getElementById('sosMessage').value;

    if (!bloodType) {
        showToast('Please select blood type for emergency', 'error');
        return;
    }

    // Simulate SOS alert
    showToast('🚨 EMERGENCY ALERT SENT!', 'error');

    setTimeout(() => {
        showToast(`Alert sent to ${bloodType} donors within 10km radius`, 'success');
    }, 1000);

    setTimeout(() => {
        showToast('Emergency hotline activated: 102', 'success');
    }, 2000);

    // Reset SOS form
    document.getElementById('sosBloodType').value = '';
    document.getElementById('sosLocation').value = '';
    document.getElementById('sosMessage').value = '';
}

// ================= MAP FUNCTIONALITY =================

function loadMap() {
    showToast('Loading interactive map...', 'success');

    // In a real implementation, this would load Google Maps or similar
    setTimeout(() => {
        showToast('Map loaded! Showing nearby donors and hospitals', 'success');
    }, 2000);
}

// ================= DATA MANAGEMENT =================

function saveToLocalStorage(key, data) {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    items.push(data);
    localStorage.setItem(key, JSON.stringify(items));
}

function loadSavedData() {
    // Load any saved draft data if needed
    const draft = localStorage.getItem('bloodDonationDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = draftData[key];
            }
        });
        showToast('Draft loaded!', 'success');
    }
}

// ================= ANIMATED COUNTERS =================

function setupCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;

        function updateCounter() {
            const current = +counter.innerText;
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        }

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Initialize counters
setupCounters();

// ================= SMOOTH SCROLLING =================

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ================= DARK MODE =================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    darkModeBtn.innerHTML = isDark ?
        '<i class="fas fa-sun"></i>' :
        '<i class="fas fa-moon"></i>';
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

// ================= NOTIFICATIONS =================

function showNotifications() {
    showToast('You have 5 new notifications!', 'success');
}

// ================= PROFILE MENU =================

function toggleProfileMenu(e) {
    if (e) e.stopPropagation();
    let dropdown = document.getElementById('profileDropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'profileDropdown';
        dropdown.className = 'profile-dropdown';
        
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuth) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            let roleFolder = user.role || 'donor';
            if(roleFolder === 'ngo') roleFolder = 'NGO';
            dropdown.innerHTML = `
                <a href="../${roleFolder}/${roleFolder}-dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="#" onclick="logoutUser(event)"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
        } else {
            dropdown.innerHTML = `
                <a href="../auth/login.html"><i class="fas fa-sign-in-alt"></i> Login</a>
                <a href="../auth/register.html"><i class="fas fa-user-plus"></i> Register</a>
            `;
        }
        document.querySelector('.profile-section').appendChild(dropdown);
    }
    
    dropdown.classList.toggle('show');
}

window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && !e.target.closest('.profile-section')) {
        dropdown.classList.remove('show');
    }
});

function logoutUser(e) {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '../auth/login.html';
}
window.logoutUser = logoutUser;

// ================= TOAST NOTIFICATIONS =================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#dcfce7' : type === 'error' ? '#fecaca' : '#fef3c7'};
        color: ${type === 'success' ? '#166534' : type === 'error' ? '#dc2626' : '#92400e'};
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ================= RESPONSIVE HANDLING =================

window.addEventListener('resize', function() {
    handleSidebarResize();
});

// ================= EXPORT FUNCTIONS =================

window.toggleSidebar = toggleSidebar;
window.showNotifications = showNotifications;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleDarkMode = toggleDarkMode;
window.checkEligibility = checkEligibility;
window.findDonors = findDonors;
window.sendSOS = sendSOS;
window.loadMap = loadMap;