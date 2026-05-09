// ================= FOOD DASHBOARD JAVASCRIPT =================

// DOM Elements
const foodDonationForm = document.getElementById('foodDonationForm');
const foodImagesInput = document.getElementById('foodImages');
const imagePreview = document.getElementById('imagePreview');
const sidebar = document.getElementById('sidebar');
const darkModeBtn = document.getElementById('darkModeBtn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupFormValidation();
    setupImageUpload();
    setupCounters();
    setupSmoothScrolling();
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
    foodDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            submitDonation();
        }
    });

    // Real-time validation
    const inputs = foodDonationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = foodDonationForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

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
    field.style.borderColor = field.value ? '#16a34a' : '#e2e8f0';
}

// ================= IMAGE UPLOAD =================

function setupImageUpload() {
    foodImagesInput.addEventListener('change', handleImageUpload);
}

function triggerFileInput() {
    foodImagesInput.click();
}

function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    // Validate files
    const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showToast('File size should be less than 5MB', 'error');
            return false;
        }
        if (!file.type.startsWith('image/')) {
            showToast('Please upload only image files', 'error');
            return false;
        }
        return true;
    });

    // Display previews
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            createImagePreview(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    });
}

function createImagePreview(src, filename) {
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';

    previewItem.innerHTML = `
        <img src="${src}" alt="${filename}">
        <button class="remove-btn" onclick="removeImage(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    imagePreview.appendChild(previewItem);
    showToast('Image uploaded successfully!', 'success');
}

function removeImage(btn) {
    btn.parentNode.remove();
    showToast('Image removed', 'success');
}

// ================= GPS LOCATION =================

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // You can integrate with Google Maps API here
                document.getElementById('pickupAddress').value +=
                    `\nGPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

                showToast('Location captured successfully!', 'success');
            },
            function(error) {
                showToast('Unable to get location. Please enter address manually.', 'error');
            }
        );
    } else {
        showToast('Geolocation is not supported by this browser.', 'error');
    }
}

// ================= FORM SUBMISSION =================

function submitDonation() {
    const formData = new FormData(foodDonationForm);

    // Collect form data
    const donationData = {
        donorName: document.getElementById('donorName').value,
        restaurantName: document.getElementById('restaurantName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        foodType: document.getElementById('foodType').value,
        foodCategory: document.getElementById('foodCategory').value,
        quantity: document.getElementById('quantity').value,
        peopleServed: document.getElementById('peopleServed').value,
        cookingTime: document.getElementById('cookingTime').value,
        expiryEstimate: document.getElementById('expiryEstimate').value,
        pickupAddress: document.getElementById('pickupAddress').value,
        pickupTiming: document.getElementById('pickupTiming').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString(),
        status: 'submitted'
    };

    // Save to localStorage (for demo purposes)
    saveToLocalStorage(donationData);

    // Show success message
    showToast('Donation submitted successfully! NGO will be matched soon.', 'success');

    // Reset form
    foodDonationForm.reset();
    imagePreview.innerHTML = '';

    // Simulate AI matching
    setTimeout(() => {
        showToast('AI matched with Hope Foundation! Pickup in 15 minutes.', 'success');
    }, 3000);
}

function saveDraft() {
    const formData = new FormData(foodDonationForm);
    const draftData = {};

    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }

    localStorage.setItem('foodDonationDraft', JSON.stringify(draftData));
    showToast('Draft saved successfully!', 'success');
}

function loadSavedData() {
    const draft = localStorage.getItem('foodDonationDraft');
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

function saveToLocalStorage(data) {
    const donations = JSON.parse(localStorage.getItem('foodDonations') || '[]');
    donations.push(data);
    localStorage.setItem('foodDonations', JSON.stringify(donations));
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

// ================= SMOOTH SCROLLING =================

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

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
    showToast('You have 3 new notifications!', 'success');
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

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ================= UTILITY FUNCTIONS =================

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ================= RESPONSIVE HANDLING =================

window.addEventListener('resize', function() {
    handleSidebarResize();
});

// ================= EXPORT FUNCTIONS FOR GLOBAL ACCESS =================

window.toggleSidebar = toggleSidebar;
window.showNotifications = showNotifications;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleDarkMode = toggleDarkMode;
window.triggerFileInput = triggerFileInput;
window.removeImage = removeImage;
window.getCurrentLocation = getCurrentLocation;