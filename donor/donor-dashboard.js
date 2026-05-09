// ================= DONOR DASHBOARD JAVASCRIPT =================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    loadDashboardData();

    // Hide loader after initialization
    setTimeout(() => {
        document.getElementById('pageLoader').classList.add('hide');
    }, 1000);
});

// ================= INITIALIZATION =================
function initializeDashboard() {
    // Load user preferences
    loadUserPreferences();

    // Initialize language
    updateLanguageDisplay();

    // Initialize map if on map page
    if (document.getElementById('map')) {
        initializeMap();
    }

    // Initialize counters
    initializeCounters();

    // Load AI recommendations
    loadAIRecommendations();
}

function loadUserPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const language = localStorage.getItem('language') || 'en';

    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').querySelector('i').className = 'fas fa-sun';
    }

    // Apply language
    window.currentLanguage = language;
    updateLanguageDisplay();
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Language toggle
    document.getElementById('languageToggle').addEventListener('click', toggleLanguage);

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Quick actions
    document.getElementById('newDonationBtn').addEventListener('click', () => showPage('donations'));
    document.getElementById('browseRequestsBtn').addEventListener('click', () => showPage('requests'));
    document.getElementById('findNearbyBtn').addEventListener('click', () => showPage('map'));

    // Create donation
    document.getElementById('createDonationBtn').addEventListener('click', showCreateDonationModal);

    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Settings
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('deleteAccountBtn').addEventListener('click', confirmDeleteAccount);

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', handleFilterChange);
    });

    // Map controls
    document.getElementById('locateMeBtn').addEventListener('click', locateUser);
    document.getElementById('filterNGOsBtn').addEventListener('click', () => filterMap('ngos'));
    document.getElementById('filterRestaurantsBtn').addEventListener('click', () => filterMap('restaurants'));
}

// ================= NAVIGATION =================
function handleNavigation(e) {
    const page = e.currentTarget.dataset.page;
    showPage(page);
}

function showPage(pageId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageId}Page`).classList.add('active');

    // Update header
    updatePageHeader(pageId);

    // Load page-specific data
    loadPageData(pageId);
}

function updatePageHeader(pageId) {
    const titles = {
        dashboard: translations[window.currentLanguage].dashboard,
        donations: translations[window.currentLanguage].myDonations,
        requests: translations[window.currentLanguage].availableRequests,
        map: translations[window.currentLanguage].nearbyResources,
        profile: translations[window.currentLanguage].profile,
        settings: translations[window.currentLanguage].settings
    };

    document.getElementById('pageTitle').textContent = titles[pageId] || titles.dashboard;
}

// ================= LANGUAGE SYSTEM =================
function toggleLanguage() {
    window.currentLanguage = window.currentLanguage === 'en' ? 'hi' : 'en';
    localStorage.setItem('language', window.currentLanguage);
    updateLanguageDisplay();
    updateAllText();
}

function updateLanguageDisplay() {
    const langText = document.getElementById('langText');
    langText.textContent = window.currentLanguage === 'en' ? 'EN' : 'हिं';
}

function updateAllText() {
    const t = translations[window.currentLanguage];

    // Update all translatable elements
    Object.keys(t).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        });
    });
}

// ================= DARK MODE =================
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');
    const icon = toggle.querySelector('i');

    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('darkMode', isDark);

    // Update map if exists
    if (window.map) {
        updateMapTheme(isDark);
    }
}

// ================= SEARCH =================
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    // Implement search logic based on current page
    const activePage = document.querySelector('.page.active').id;

    switch(activePage) {
        case 'requestsPage':
            filterRequests(query);
            break;
        case 'donationsPage':
            filterDonations(query);
            break;
        default:
            // Global search
            break;
    }
}

// ================= DASHBOARD DATA =================
function loadDashboardData() {
    // Load user info
    loadUserInfo();

    // Load stats
    loadStats();

    // Load recent activity
    loadRecentActivity();

    // Load AI recommendations
    loadAIRecommendations();
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '../images/default-avatar.png'
    };

    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 'Donor';
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileImage').src = user.avatar;
    document.getElementById('profileAvatar').src = user.avatar;
}

function loadStats() {
    // Simulate loading stats with animation
    const stats = {
        totalDonations: 47,
        fulfilled: 42,
        pending: 5,
        helpedPeople: 156
    };

    animateCounters(stats);
}

function animateCounters(targets) {
    Object.keys(targets).forEach(key => {
        const element = document.querySelector(`[data-target="${targets[key]}"]`);
        if (element) {
            animateCounter(element, 0, targets[key], 1000);
        }
    });
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function loadRecentActivity() {
    const activities = [
        {
            icon: 'fas fa-gift',
            title: 'Donation completed',
            description: 'Food package delivered to needy family',
            time: '2 hours ago',
            type: 'success'
        },
        {
            icon: 'fas fa-hand-holding-heart',
            title: 'New donation posted',
            description: 'Winter clothes available for pickup',
            time: '1 day ago',
            type: 'success'
        },
        {
            icon: 'fas fa-clock',
            title: 'Request matched',
            description: 'Your donation matched with local NGO',
            time: '3 days ago',
            type: 'info'
        }
    ];

    const activityList = document.getElementById('recentActivityList');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const card = createActivityCard(activity);
        activityList.appendChild(card);
    });
}

function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
        <div class="activity-icon ${activity.type}">
            <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
            <small>${activity.time}</small>
        </div>
    `;
    return card;
}

// ================= AI RECOMMENDATIONS =================
function loadAIRecommendations() {
    const recommendations = [
        {
            title: 'Urgent Food Request',
            description: 'Family of 5 needs rice and vegetables urgently',
            matchScore: 98,
            category: 'food',
            urgency: 'high'
        },
        {
            title: 'Educational Materials',
            description: 'School supplies needed for underprivileged children',
            matchScore: 92,
            category: 'books',
            urgency: 'medium'
        },
        {
            title: 'Medical Supplies',
            description: 'First aid kits and medicines for rural clinic',
            matchScore: 89,
            category: 'medical',
            urgency: 'high'
        }
    ];

    const grid = document.getElementById('aiRecommendationsGrid');
    grid.innerHTML = '';

    recommendations.forEach(rec => {
        const card = createRecommendationCard(rec);
        grid.appendChild(card);
    });
}

function createRecommendationCard(rec) {
    const card = document.createElement('div');
    card.className = 'ai-recommendation-card';
    card.innerHTML = `
        <div class="card-header">
            <h4>${rec.title}</h4>
            <div class="card-badges">
                <span class="category-tag category-${rec.category}">${rec.category}</span>
                <span class="urgency-badge urgency-${rec.urgency}">${rec.urgency}</span>
            </div>
        </div>
        <p>${rec.description}</p>
        <div class="match-score">
            <div class="score-bar" style="width: ${rec.matchScore}%"></div>
            <span>${rec.matchScore}% match</span>
        </div>
        <button class="btn btn-primary btn-sm">Donate Now</button>
    `;
    return card;
}

// ================= PAGE DATA LOADING =================
function loadPageData(pageId) {
    switch(pageId) {
        case 'donations':
            loadDonations();
            break;
        case 'requests':
            loadRequests();
            break;
        case 'map':
            initializeMap();
            break;
    }
}

function loadDonations() {
    const donations = [
        {
            id: 1,
            title: 'Winter Clothing Bundle',
            description: 'Warm clothes for 3 children - sweaters, jackets, and blankets',
            category: 'clothes',
            status: 'available',
            createdAt: '2024-01-15',
            location: 'Delhi, India'
        },
        {
            id: 2,
            title: 'Rice and Lentils Package',
            description: '25kg rice and 10kg lentils for family support',
            category: 'food',
            status: 'matched',
            createdAt: '2024-01-12',
            location: 'Mumbai, India'
        },
        {
            id: 3,
            title: 'Educational Books',
            description: 'Textbooks and notebooks for primary school students',
            category: 'books',
            status: 'delivered',
            createdAt: '2024-01-08',
            location: 'Bangalore, India'
        }
    ];

    const grid = document.getElementById('donationsGrid');
    grid.innerHTML = '';

    donations.forEach(donation => {
        const card = createDonationCard(donation);
        grid.appendChild(card);
    });
}

function createDonationCard(donation) {
    const card = document.createElement('div');
    card.className = 'card donation-card';
    card.innerHTML = `
        <div class="card-header">
            <span class="category-tag category-${donation.category}">${donation.category}</span>
            <span class="status-badge status-${donation.status}">${donation.status}</span>
        </div>
        <div class="card-body">
            <h3>${donation.title}</h3>
            <p>${donation.description}</p>
            <div class="donation-meta">
                <span><i class="fas fa-calendar"></i> ${donation.createdAt}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${donation.location}</span>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-outline btn-sm">Edit</button>
            <button class="btn btn-primary btn-sm">View Details</button>
        </div>
    `;
    return card;
}

function loadRequests() {
    const requests = PUNARDAAN_DB.requests || [];

    const grid = document.getElementById('requestsGrid');
    grid.innerHTML = '';

    requests.slice(0, 12).forEach(request => {
        const card = createRequestCard(request);
        grid.appendChild(card);
    });
}

function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'card request-card';
    card.innerHTML = `
        <div class="card-header">
            <span class="category-tag category-${request.category}">${request.category}</span>
            <span class="distance-badge">${request.distance || '3.2km'}</span>
        </div>
        <div class="card-body">
            <h3>${request.title}</h3>
            <p>${request.description}</p>
            <div class="request-meta">
                <span><i class="fas fa-user"></i> ${request.receiver}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${request.location}</span>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-outline btn-sm">View Details</button>
            <button class="btn btn-primary btn-sm">Help Now</button>
        </div>
    `;
    return card;
}

// ================= MAP FUNCTIONALITY =================
function initializeMap() {
    if (!document.getElementById('map')) return;

    // Initialize Leaflet map
    window.map = L.map('map').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(window.map);

    // Add markers for NGOs and restaurants
    addMapMarkers();

    // Update map theme
    updateMapTheme(document.body.classList.contains('dark-mode'));
}

function addMapMarkers() {
    const ngos = PUNARDAAN_DB.ngos || [];
    const restaurants = PUNARDAAN_DB.restaurants || [];

    // Add NGO markers
    ngos.forEach(ngo => {
        const marker = L.marker([ngo.lat, ngo.lng])
            .addTo(window.map)
            .bindPopup(`
                <div class="map-popup">
                    <h4>${ngo.name}</h4>
                    <p>${ngo.description}</p>
                    <p><i class="fas fa-phone"></i> ${ngo.phone}</p>
                    <button class="btn btn-primary btn-sm">Contact</button>
                </div>
            `);
        marker.ngoData = ngo;
    });

    // Add restaurant markers
    restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.lat, restaurant.lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        })
        .addTo(window.map)
        .bindPopup(`
            <div class="map-popup">
                <h4>${restaurant.name}</h4>
                <p>${restaurant.description}</p>
                <p><i class="fas fa-phone"></i> ${restaurant.phone}</p>
                <button class="btn btn-primary btn-sm">Contact</button>
            </div>
        `);
        marker.restaurantData = restaurant;
    });

    updateMapStats();
}

function updateMapStats() {
    const ngoCount = PUNARDAAN_DB.ngos?.length || 0;
    const restaurantCount = PUNARDAAN_DB.restaurants?.length || 0;

    document.getElementById('ngoCount').textContent = ngoCount;
    document.getElementById('restaurantCount').textContent = restaurantCount;
}

function updateMapTheme(isDark) {
    if (!window.map) return;

    const tiles = document.querySelector('.leaflet-tile-pane');
    if (tiles) {
        tiles.style.filter = isDark ? 'brightness(0.6) contrast(1.2)' : 'none';
    }
}

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            window.map.setView([latitude, longitude], 15);

            // Add user marker
            if (window.userMarker) {
                window.map.removeLayer(window.userMarker);
            }

            window.userMarker = L.marker([latitude, longitude], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            })
            .addTo(window.map)
            .bindPopup('You are here!');

            showToast('Location found!', 'success');
        });
    } else {
        showToast('Geolocation is not supported by this browser.', 'error');
    }
}

function filterMap(type) {
    // Implement map filtering logic
    showToast(`${type} filter applied`, 'info');
}

// ================= FORM HANDLING =================
function handleProfileUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!validateForm(data)) {
        return;
    }

    // Save profile data
    saveProfileData(data);
    showToast('Profile updated successfully!', 'success');
}

function validateForm(data) {
    let isValid = true;

    // Email validation
    if (!validateEmail(data.email)) {
        showToast('Please enter a valid email address.', 'error');
        isValid = false;
    }

    // Phone validation
    if (!validatePhone(data.phone)) {
        showToast('Please enter a valid phone number.', 'error');
        isValid = false;
    }

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function saveProfileData(data) {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    Object.assign(user, data);
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        language: document.getElementById('languageSelect').value
    };

    localStorage.setItem('userSettings', JSON.stringify(settings));
    showToast('Settings saved successfully!', 'success');
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Handle account deletion
        showToast('Account deletion initiated. You will receive a confirmation email.', 'warning');
    }
}

// ================= FILTERING =================
function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    const activePage = document.querySelector('.page.active').id;

    // Update active filter tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    e.target.classList.add('active');

    // Apply filter
    if (activePage === 'donationsPage') {
        filterDonationsByStatus(filter);
    }
}

function filterDonationsByStatus(status) {
    const cards = document.querySelectorAll('.donation-card');

    cards.forEach(card => {
        const cardStatus = card.querySelector('.status-badge').textContent.toLowerCase();
        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterDonations(query) {
    const cards = document.querySelectorAll('.donation-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterRequests(query) {
    const cards = document.querySelectorAll('.request-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ================= MODALS AND TOASTS =================
function showCreateDonationModal() {
    // Implement modal for creating new donation
    showToast('Create donation modal would open here', 'info');
}

function showToast(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <i class="${iconMap[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title || type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.getElementById('toastContainer').appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
}

// ================= LOGOUT =================
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        window.location.href = '../index.html';
    }
}

// ================= UTILITIES =================
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

// Debounce search
document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));

// ================= UTILITIES =================
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

  window.map = L.map("map").setView([28.7041,77.1025],11);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:"© OpenStreetMap"
    }
  ).addTo(window.map);

  const ngos = [

    {
      lat:28.7041,
      lng:77.1025,
      title:"Helping Hands NGO"
    },

    {
      lat:28.6139,
      lng:77.2090,
      title:"Blood Bank Delhi"
    },

    {
      lat:28.5355,
      lng:77.3910,
      title:"Education NGO"
    }

  ];

  ngos.forEach(ngo => {

    L.marker([ngo.lat,ngo.lng])
      .addTo(window.map)
      .bindPopup(`<b>${ngo.title}</b>`);

  });

}