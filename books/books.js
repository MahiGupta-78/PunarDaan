// ================= BOOKS DASHBOARD JAVASCRIPT =================

// DOM Elements
const bookDonationForm = document.getElementById('bookDonationForm');
const bookImagesInput = document.getElementById('bookImages');
const imagePreview = document.getElementById('imagePreview');
const bookList = document.getElementById('bookList');
const sidebar = document.getElementById('sidebar');
const darkModeBtn = document.getElementById('darkModeBtn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupFormValidation();
    setupImageUpload();
    setupCounters();
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
    bookDonationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateBookDonationForm()) {
            submitBookDonation();
        }
    });

    // Real-time validation
    const inputs = bookDonationForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateBookDonationForm() {
    let isValid = true;
    const requiredFields = bookDonationForm.querySelectorAll('[required]');
    const bookTitles = bookList.querySelectorAll('.bookTitle');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Check if at least one book is added
    if (bookTitles.length === 0) {
        showToast('Please add at least one book', 'error');
        isValid = false;
    }

    // Validate each book entry
    bookTitles.forEach(title => {
        if (!title.value.trim()) {
            showError(title, 'Book title is required');
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

// ================= BOOK MANAGEMENT =================

function addAnotherBook() {
    const bookEntry = document.createElement('div');
    bookEntry.className = 'book-entry';

    bookEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Book Title *</label>
                <input type="text" class="bookTitle" required>
            </div>

            <div class="form-group">
                <label>Author</label>
                <input type="text" class="bookAuthor">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Subject/Category *</label>
                <select class="bookSubject" required>
                    <option value="">Select Subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="computer">Computer Science</option>
                    <option value="literature">Literature</option>
                    <option value="story">Story Books</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label>Class/Grade</label>
                <select class="bookGrade">
                    <option value="">Select Grade</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="college">College</option>
                    <option value="general">General</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="bookQuantity" min="1" value="1">
            </div>

            <div class="form-group">
                <label>ISBN (Optional)</label>
                <input type="text" class="bookISBN" placeholder="ISBN number">
            </div>
        </div>

        <button type="button" class="btn-secondary remove-book" onclick="removeBook(this)">
            <i class="fas fa-trash"></i> Remove Book
        </button>
    `;

    bookList.appendChild(bookEntry);
    showToast('Book added successfully!', 'success');
}

function removeBook(btn) {
    btn.parentNode.remove();
    showToast('Book removed', 'success');
}

// ================= IMAGE UPLOAD =================

function setupImageUpload() {
    bookImagesInput.addEventListener('change', handleImageUpload);
}

function triggerFileInput() {
    bookImagesInput.click();
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

function submitBookDonation() {
    const formData = new FormData(bookDonationForm);

    // Collect book details
    const books = [];
    const bookEntries = bookList.querySelectorAll('.book-entry');

    bookEntries.forEach(entry => {
        books.push({
            title: entry.querySelector('.bookTitle').value,
            author: entry.querySelector('.bookAuthor').value,
            subject: entry.querySelector('.bookSubject').value,
            grade: entry.querySelector('.bookGrade').value,
            quantity: entry.querySelector('.bookQuantity').value,
            isbn: entry.querySelector('.bookISBN').value
        });
    });

    const donationData = {
        donorName: document.getElementById('donorName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        bookCondition: document.getElementById('bookCondition').value,
        books: books,
        pickupAddress: document.getElementById('pickupAddress').value,
        preferredTime: document.getElementById('preferredTime').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString(),
        status: 'pickup-scheduled'
    };

    // Save to localStorage
    saveToLocalStorage('bookDonations', donationData);

    showToast('Book donation scheduled successfully!', 'success');
    bookDonationForm.reset();
    imagePreview.innerHTML = '';
    bookList.innerHTML = ''; // Clear book list
    showToast('Pickup confirmation sent to your mobile', 'success');
}

function saveDraft() {
    const formData = new FormData(bookDonationForm);
    const draftData = {};

    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }

    localStorage.setItem('bookDonationDraft', JSON.stringify(draftData));
    showToast('Draft saved successfully!', 'success');
}

function loadSavedData() {
    const draft = localStorage.getItem('bookDonationDraft');
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

function saveToLocalStorage(key, data) {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    items.push(data);
    localStorage.setItem(key, JSON.stringify(items));
}

// ================= BOOK EXCHANGE =================

function searchExchangePartners() {
    const subject = document.getElementById('exchangeSubject').value;
    const grade = document.getElementById('exchangeGrade').value;

    if (!subject && !grade) {
        showToast('Please select at least one filter', 'error');
        return;
    }

    showToast('Searching for exchange partners...', 'success');

    setTimeout(() => {
        const mockPartners = Math.floor(Math.random() * 5) + 1;
        const resultsDiv = document.getElementById('exchangeResults');

        if (mockPartners > 0) {
            resultsDiv.innerHTML = `
                <div style="text-align: left;">
                    <h4>Found ${mockPartners} exchange partners!</h4>
                    <div style="margin-top: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <div style="width: 40px; height: 40px; background: #4f46e5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">JD</div>
                            <div>
                                <div style="font-weight: 600;">John Doe</div>
                                <div style="font-size: 12px; color: #64748b;">2.3 km away</div>
                            </div>
                            <button class="btn-primary" style="margin-left: auto; padding: 6px 12px; font-size: 12px;">Contact</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = '<p>No exchange partners found. Try different filters.</p>';
        }
    }, 2000);
}

// ================= LIBRARY TABS =================

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName + '-books').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// ================= WISHLIST =================

function addToWishlist() {
    const bookInput = document.getElementById('wishlistBook');
    const bookTitle = bookInput.value.trim();

    if (!bookTitle) {
        showToast('Please enter a book title', 'error');
        return;
    }

    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'wishlist-item';

    wishlistItem.innerHTML = `
        <div class="book-info">
            <h4>${bookTitle}</h4>
            <p>Added to wishlist</p>
        </div>
        <div class="wishlist-actions">
            <span class="availability unavailable">Checking availability...</span>
            <button class="btn-secondary">Set Alert</button>
        </div>
    `;

    document.querySelector('.wishlist-items').appendChild(wishlistItem);
    bookInput.value = '';
    showToast('Book added to wishlist!', 'success');

    // Simulate availability check
    setTimeout(() => {
        const availability = wishlistItem.querySelector('.availability');
        const random = Math.random();
        if (random > 0.5) {
            availability.textContent = 'Available for exchange';
            availability.className = 'availability available';
        } else {
            availability.textContent = 'Not available';
            availability.className = 'availability unavailable';
        }
    }, 2000);
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
    showToast('You have 7 new notifications!', 'success');
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
window.addAnotherBook = addAnotherBook;
window.removeBook = removeBook;
window.searchExchangePartners = searchExchangePartners;
window.switchTab = switchTab;
window.addToWishlist = addToWishlist;