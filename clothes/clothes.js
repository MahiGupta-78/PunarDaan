// ================= CLOTHES DASHBOARD JAVASCRIPT =================

// DOM Elements
const clothesDonationForm = document.getElementById('clothesDonationForm');
const clothesImagesInput = document.getElementById('clothesImages');
const imagePreview = document.getElementById('imagePreview');
const sizeQuantityContainer = document.getElementById('sizeQuantityContainer');
const sidebar = document.getElementById('sidebar');
const darkModeBtn = document.getElementById('darkModeBtn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupFormValidation();
    setupImageUpload();
    setupCounters();
    loadSavedData();
    initializeSizeQuantity();
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

// ================= SIZE & QUANTITY MANAGEMENT =================

function initializeSizeQuantity() {
    // Add initial size-quantity item
    addSizeQuantityItem();
}

function addSizeQuantityItem() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'size-quantity-item';

    itemDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Size *</label>
                <select class="itemSize" required>
                    <option value="">Select Size</option>
                    <option value="XS">XS (Extra Small)</option>
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                    <option value="XXL">XXL</option>
                    <option value="kids">Kids (2-12 years)</option>
                    <option value="infant">Infant (0-2 years)</option>
                    <option value="universal">Universal Size</option>
                </select>
            </div>

            <div class="form-group">
                <label>Gender *</label>
                <select class="itemGender" required>
                    <option value="">Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="unisex">Unisex</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Quantity *</label>
                <input type="number" class="itemQuantity" min="1" required>
            </div>

            <div class="form-group">
                <label>Age Group</label>
                <select class="itemAgeGroup">
                    <option value="">Select Age Group</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-12">6-12 years</option>
                    <option value="13-17">13-17 years (Teen)</option>
                    <option value="18-35">18-35 years (Young Adult)</option>
                    <option value="36-55">36-55 years (Adult)</option>
                    <option value="55+">55+ years (Senior)</option>
                </select>
            </div>
        </div>

        <button type="button" class="btn-secondary remove-item" onclick="removeSizeQuantityItem(this)">
            <i class="fas fa-trash"></i> Remove Item Type
        </button>
    `;

    sizeQuantityContainer.appendChild(itemDiv);
    showToast('Item type added!', 'success');
}

function removeSizeQuantityItem(btn) {
    if (sizeQuantityContainer.children.length > 1) {
        btn.parentNode.remove();
        showToast('Item type removed', 'success');
    } else {
        showToast('At least one item type is required', 'error');
    }
}

// ================= FORM VALIDATION =================

function setupFormValidation() {
    clothesDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateClothesDonationForm()) {
            submitClothesDonation();
        }
    });

    // Real-time validation
    const inputs = clothesDonationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Category validation
    const categoryCheckboxes = clothesDonationForm.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateCategories);
    });
}

function validateClothesDonationForm() {
    let isValid = true;
    const requiredFields = clothesDonationForm.querySelectorAll('[required]');
    const sizeItems = sizeQuantityContainer.querySelectorAll('.size-quantity-item');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate categories
    if (!validateCategories()) {
        isValid = false;
    }

    // Check if at least one size-quantity item exists
    if (sizeItems.length === 0) {
        showToast('Please add at least one item type', 'error');
        isValid = false;
    }

    // Validate each size-quantity item
    sizeItems.forEach(item => {
        const size = item.querySelector('.itemSize');
        const gender = item.querySelector('.itemGender');
        const quantity = item.querySelector('.itemQuantity');

        if (!size.value) {
            showError(size, 'Size is required');
            isValid = false;
        }
        if (!gender.value) {
            showError(gender, 'Gender is required');
            isValid = false;
        }
        if (!quantity.value || quantity.value < 1) {
            showError(quantity, 'Quantity must be at least 1');
            isValid = false;
        }
    });

    return isValid;
}

function validateCategories() {
    const checkedCategories = clothesDonationForm.querySelectorAll('input[type="checkbox"]:checked');
    const categoryGrid = clothesDonationForm.querySelector('.category-grid');

    // Remove existing error
    const existingError = categoryGrid.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    if (checkedCategories.length === 0) {
        showError(categoryGrid, 'Please select at least one clothing category');
        return false;
    }

    return true;
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
    field.style.borderColor = field.value ? '#4f46e5' : '#e2e8f0';
}

// ================= IMAGE UPLOAD =================

function setupImageUpload() {
    clothesImagesInput.addEventListener('change', handleImageUpload);
}

function triggerFileInput() {
    clothesImagesInput.click();
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

// ================= FORM SUBMISSION =================

function submitClothesDonation() {
    const formData = new FormData(clothesDonationForm);

    // Collect selected categories
    const categories = [];
    const checkedBoxes = clothesDonationForm.querySelectorAll('input[type="checkbox"]:checked');
    checkedBoxes.forEach(box => {
        categories.push(box.value);
    });

    // Collect size and quantity details
    const items = [];
    const sizeItems = sizeQuantityContainer.querySelectorAll('.size-quantity-item');
    sizeItems.forEach(item => {
        items.push({
            size: item.querySelector('.itemSize').value,
            gender: item.querySelector('.itemGender').value,
            quantity: item.querySelector('.itemQuantity').value,
            ageGroup: item.querySelector('.itemAgeGroup').value
        });
    });

    const donationData = {
        donorName: document.getElementById('donorName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        clothesCondition: document.getElementById('clothesCondition').value,
        categories: categories,
        items: items,
        pickupAddress: document.getElementById('pickupAddress').value,
        preferredTime: document.getElementById('preferredTime').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString(),
        status: 'pickup-scheduled'
    };

    // Save to localStorage
    saveToLocalStorage('clothesDonations', donationData);

    showToast('Clothes donation scheduled successfully!', 'success');
    clothesDonationForm.reset();
    imagePreview.innerHTML = '';
    sizeQuantityContainer.innerHTML = '';
    initializeSizeQuantity(); // Add back one empty item
    showToast('Pickup confirmation sent to your mobile', 'success');
}

function saveDraft() {
    const formData = new FormData(clothesDonationForm);
    const draftData = {};

    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }

    // Add categories and items
    const categories = [];
    const checkedBoxes = clothesDonationForm.querySelectorAll('input[type="checkbox"]:checked');
    checkedBoxes.forEach(box => {
        categories.push(box.value);
    });
    draftData.categories = categories;

    localStorage.setItem('clothesDonationDraft', JSON.stringify(draftData));
    showToast('Draft saved successfully!', 'success');
}

function loadSavedData() {
    const draft = localStorage.getItem('clothesDonationDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach(key => {
            if (key === 'categories') {
                draftData.categories.forEach(category => {
                    const checkbox = clothesDonationForm.querySelector(`input[value="${category}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                const element = document.getElementById(key);
                if (element) {
                    element.value = draftData[key];
                }
            }
        });
        showToast('Draft loaded!', 'success');
    }
}

function saveToLocalStorage(key, data) {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    items.push(data);
    localStorage.setItem(key, JSON.stringify(items));
}

// ================= AI CLASSIFICATION =================

function triggerAIClassification() {
    const input = document.getElementById('aiImageInput');
    input.click();
}

document.getElementById('aiImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        showToast('Analyzing image with AI...', 'success');

        setTimeout(() => {
            const results = simulateAIClassification(file);
            displayAIResult(results);
        }, 2000);
    }
});

function simulateAIClassification(file) {
    // Simulate AI classification results
    const conditions = ['excellent', 'good', 'fair'];
    const sizes = ['S', 'M', 'L', 'XL'];
    const categories = ['shirt', 'pants', 'jacket', 'dress'];

    return {
        category: categories[Math.floor(Math.random() * categories.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        gender: Math.random() > 0.5 ? 'unisex' : (Math.random() > 0.5 ? 'men' : 'women'),
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        suitability: Math.floor(Math.random() * 5) + 1 // 1-5 people
    };
}

function displayAIResult(results) {
    const resultDiv = document.getElementById('aiResult');

    resultDiv.innerHTML = `
        <h4>🤖 AI Analysis Complete</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
                <strong>Category:</strong> ${results.category.charAt(0).toUpperCase() + results.category.slice(1)}
            </div>
            <div>
                <strong>Size:</strong> ${results.size}
            </div>
            <div>
                <strong>Condition:</strong> <span class="condition ${results.condition}">${results.condition.charAt(0).toUpperCase() + results.condition.slice(1)}</span>
            </div>
            <div>
                <strong>Gender:</strong> ${results.gender.charAt(0).toUpperCase() + results.gender.slice(1)}
            </div>
            <div>
                <strong>Confidence:</strong> ${results.confidence}%
            </div>
            <div>
                <strong>Can Help:</strong> ${results.suitability} people
            </div>
        </div>
        <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
            <strong>Recommendation:</strong> This item is suitable for donation and can help ${results.suitability} people in need.
        </div>
    `;

    showToast('AI classification completed!', 'success');
}

// ================= DISTRIBUTION MAP =================

function loadDistributionMap() {
    showToast('Loading distribution network map...', 'success');

    setTimeout(() => {
        showToast('Map loaded! Tracking 12 active routes', 'success');
    }, 1500);
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
    showToast('You have 4 new notifications!', 'success');
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
window.triggerFileInput = triggerFileInput;
window.removeImage = removeImage;
window.addSizeQuantityItem = addSizeQuantityItem;
window.removeSizeQuantityItem = removeSizeQuantityItem;
window.triggerAIClassification = triggerAIClassification;
window.loadDistributionMap = loadDistributionMap;