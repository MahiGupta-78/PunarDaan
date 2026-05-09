// ===============================================
// PUNARDAAN GLOBAL UTILITIES
// Enhanced with Language Support & Advanced Features
// ===============================================

// ==================== LANGUAGE SYSTEM ====================
const translations = {
  en: {
    // Navigation
    home: "Home",
    donate: "Donate",
    ngos: "NGOs",
    impact: "Impact",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Register",

    // Common
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    close: "Close",
    loading: "Loading...",
    success: "Success!",
    error: "Error",
    warning: "Warning",
    info: "Information",

    // Dashboard
    dashboard: "Dashboard",
    myDonations: "My Donations",
    helpRequests: "Help Requests",
    nearbyNGOs: "Nearby NGOs",
    documents: "Documents",
    myImpact: "My Impact",
    profile: "Profile",
    logout: "Logout",

    // Forms
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    city: "City",
    address: "Address",
    description: "Description",
    quantity: "Quantity",
    urgency: "Urgency Level",
    availability: "Availability",

    // Categories
    food: "Food",
    blood: "Blood",
    books: "Books",
    clothes: "Clothes",
    medical: "Medical",
    education: "Education",
    shelter: "Shelter",

    // AI & Recommendations
    aiRecommendations: "AI Recommendations",
    nearbyNGOs: "Nearby NGOs",
    urgentRequests: "Urgent Requests",
    smartMatching: "Smart Matching",
    aiMatchFound: "AI Match Found",
    excellentMatch: "Excellent Match",
    goodMatch: "Good Match",
    fairMatch: "Fair Match",

    // Status
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
    inProgress: "In Progress",
    available: "Available",

    // Messages
    requestSubmitted: "Request submitted successfully!",
    donationCreated: "Donation created successfully!",
    profileUpdated: "Profile updated successfully!",
    loginSuccess: "Login successful!",
    logoutSuccess: "Logged out successfully!",

    // Placeholders
    enterName: "Enter your name",
    enterEmail: "Enter your email",
    enterPhone: "Enter your phone number",
    enterCity: "Enter your city",
    enterAddress: "Enter your address",
    describeNeed: "Describe your need...",
    searchNGOs: "Search NGOs...",
    searchRequests: "Search requests..."
  },

  hi: {
    // Navigation
    home: "होम",
    donate: "दान करें",
    ngos: "एनजीओ",
    impact: "प्रभाव",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉगिन",
    register: "रजिस्टर",

    // Common
    submit: "सबमिट करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    edit: "एडिट करें",
    delete: "डिलीट करें",
    view: "देखें",
    close: "बंद करें",
    loading: "लोड हो रहा है...",
    success: "सफलता!",
    error: "त्रुटि",
    warning: "चेतावनी",
    info: "जानकारी",

    // Dashboard
    dashboard: "डैशबोर्ड",
    myDonations: "मेरे दान",
    helpRequests: "मदद के अनुरोध",
    nearbyNGOs: "नजदीकी एनजीओ",
    documents: "दस्तावेज",
    myImpact: "मेरा प्रभाव",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",

    // Forms
    fullName: "पूरा नाम",
    email: "ईमेल",
    phone: "फोन नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड कन्फर्म करें",
    city: "शहर",
    address: "पता",
    description: "विवरण",
    quantity: "मात्रा",
    urgency: "तात्कालिकता स्तर",
    availability: "उपलब्धता",

    // Categories
    food: "खाना",
    blood: "खून",
    books: "किताबें",
    clothes: "कपड़े",
    medical: "मेडिकल",
    education: "शिक्षा",
    shelter: "आश्रय",

    // AI & Recommendations
    aiRecommendations: "एआई सिफारिशें",
    nearbyNGOs: "नजदीकी एनजीओ",
    urgentRequests: "तत्काल अनुरोध",
    smartMatching: "स्मार्ट मिलान",
    aiMatchFound: "एआई मिलान मिला",
    excellentMatch: "उत्कृष्ट मिलान",
    goodMatch: "अच्छा मिलान",
    fairMatch: "सामान्य मिलान",

    // Status
    pending: "लंबित",
    approved: "स्वीकृत",
    rejected: "अस्वीकृत",
    completed: "पूर्ण",
    inProgress: "प्रगति में",
    available: "उपलब्ध",

    // Messages
    requestSubmitted: "अनुरोध सफलतापूर्वक सबमिट किया गया!",
    donationCreated: "दान सफलतापूर्वक बनाया गया!",
    profileUpdated: "प्रोफाइल अपडेट की गई!",
    loginSuccess: "लॉगिन सफल!",
    logoutSuccess: "लॉगआउट हो गया!",

    // Placeholders
    enterName: "अपना नाम दर्ज करें",
    enterEmail: "अपना ईमेल दर्ज करें",
    enterPhone: "अपना फोन नंबर दर्ज करें",
    enterCity: "अपना शहर दर्ज करें",
    enterAddress: "अपना पता दर्ज करें",
    describeNeed: "अपनी आवश्यकता बताएं...",
    searchNGOs: "एनजीओ खोजें...",
    searchRequests: "अनुरोध खोजें..."
  }
};

// ==================== GLOBAL STATE ====================
let currentLanguage = localStorage.getItem('punardaan-language') || 'en';
let currentTheme = localStorage.getItem('punardaan-theme') || 'light';

// ==================== LANGUAGE FUNCTIONS ====================
function setLanguage(lang) {
  if (!translations[lang]) return;

  currentLanguage = lang;
  localStorage.setItem('punardaan-language', lang);

  // Update all translatable elements
  updateAllTranslations();

  // Update language button
  updateLanguageButton();

  // Show success message
  showToast(getTranslation('languageChanged'), 'success');
}

function getTranslation(key, lang = currentLanguage) {
  return translations[lang][key] || translations['en'][key] || key;
}

function updateAllTranslations() {
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key);

    if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
      element.placeholder = translation;
    } else if (element.tagName === 'OPTION') {
      element.textContent = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Update page title if it has translation
  const titleKey = document.documentElement.getAttribute('data-title');
  if (titleKey) {
    document.title = getTranslation(titleKey);
  }
}

function updateLanguageButton() {
  const langBtn = document.getElementById('languageBtn');
  if (langBtn) {
    langBtn.innerHTML = `<i class="fas fa-globe"></i> ${currentLanguage.toUpperCase()}`;
  }
}

// ==================== THEME FUNCTIONS ====================
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('punardaan-theme', currentTheme);
  applyTheme();
  updateThemeButton();
}

function applyTheme() {
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');

  // Update theme-specific elements
  const themeBtn = document.getElementById('darkModeBtn');
  if (themeBtn) {
    themeBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Update map theme if exists
  if (window.mapInstance) {
    updateMapTheme();
  }
}

function updateThemeButton() {
  const themeBtn = document.getElementById('darkModeBtn');
  if (themeBtn) {
    themeBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  }
}

function updateMapTheme() {
  // Update Leaflet map tiles for dark mode
  if (window.mapInstance) {
    const tileLayer = currentTheme === 'dark'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // Dark tiles would go here
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    // In a real implementation, you'd update the tile layer
    // For now, just add a dark overlay
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.style.filter = currentTheme === 'dark' ? 'brightness(0.7)' : 'none';
    }
  }
}

// ==================== ENHANCED TOAST SYSTEM ====================
function showToast(message, type = 'info', duration = 4000) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = getToastIcon(type);
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="toast-progress"></div>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

// ==================== ENHANCED LOADING SYSTEM ====================
function showLoading(button, text = 'Loading...') {
  if (!button) return;

  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `
    <span class="spinner"></span>
    ${text}
  `;

  return () => {
    button.disabled = false;
    button.innerHTML = originalText;
  };
}

function showPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.display = 'flex';
  }
}

function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// ==================== FORM VALIDATION ====================
function validateField(field) {
  const value = field.value.trim();
  const type = field.getAttribute('data-validate') || field.type;
  let isValid = true;
  let errorMessage = '';

  // Clear previous errors
  clearFieldError(field);

  // Required validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }

  // Type-specific validation
  if (isValid && value) {
    switch (type) {
      case 'email':
        if (!isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!isValidPhone(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      case 'password':
        if (!isValidPassword(value)) {
          isValid = false;
          errorMessage = 'Password must be at least 8 characters with numbers and letters';
        }
        break;
    }
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  } else if (value) {
    showFieldSuccess(field);
  }

  return isValid;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^[\+]?[1-9][\d]{0,15}$/;
  return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

function showFieldError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;

  field.parentElement.appendChild(errorDiv);
}

function showFieldSuccess(field) {
  field.classList.add('success');
  field.classList.remove('error');
  clearFieldError(field);
}

function clearFieldError(field) {
  field.classList.remove('error', 'success');
  const errorDiv = field.parentElement.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('input, select, textarea');

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

// ==================== ENHANCED MODAL SYSTEM ====================
function showModal(modalId, data = {}) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'flex';
  modal.classList.add('show');

  // Populate modal with data if provided
  Object.keys(data).forEach(key => {
    const element = modal.querySelector(`[data-field="${key}"]`);
    if (element) {
      element.textContent = data[key];
    }
  });

  // Focus trap
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);

  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// ==================== ENHANCED SEARCH SYSTEM ====================
function setupSearch(searchInput, itemsContainer, filterFunction) {
  if (!searchInput || !itemsContainer) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const items = itemsContainer.querySelectorAll('[data-searchable]');

    items.forEach(item => {
      const searchableText = item.getAttribute('data-searchable').toLowerCase();
      const isVisible = searchableText.includes(query);
      item.style.display = isVisible ? 'block' : 'none';
    });
  });
}

// ==================== ENHANCED ANIMATION SYSTEM ====================
function animateCounter(element, target, duration = 2000) {
  if (!element) return;

  const start = parseInt(element.textContent) || 0;
  const increment = (target - start) / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

function animateElement(element, animation, duration = 300) {
  if (!element) return;

  element.style.animation = `${animation} ${duration}ms ease-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

// ==================== ENHANCED IMAGE UPLOAD ====================
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
}

// ==================== ENHANCED LOCAL STORAGE ====================
function saveToStorage(key, data) {
  try {
    localStorage.setItem(`punardaan_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Storage save error:', error);
    return false;
  }
}

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(`punardaan_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Storage get error:', error);
    return null;
  }
}

function removeFromStorage(key) {
  localStorage.removeItem(`punardaan_${key}`);
}

// ==================== INITIALIZATION ====================
function initializeGlobalFeatures() {
  // Apply saved theme
  applyTheme();

  // Apply saved language
  updateAllTranslations();
  updateLanguageButton();

  // Setup global event listeners
  setupGlobalListeners();

  // Initialize tooltips
  initializeTooltips();

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
}

function setupGlobalListeners() {
  // Language toggle
  const langBtn = document.getElementById('languageBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const newLang = currentLanguage === 'en' ? 'hi' : 'en';
      setLanguage(newLang);
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('darkModeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Close modals on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
}

function initializeTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = e.target.getAttribute('data-tooltip');
  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L for language toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      const newLang = currentLanguage === 'en' ? 'hi' : 'en';
      setLanguage(newLang);
    }

    // Ctrl/Cmd + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// ==================== EXPORT ====================
window.translations = translations;
window.currentLanguage = currentLanguage;
window.currentTheme = currentTheme;

window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.toggleTheme = toggleTheme;
window.showToast = showToast;
window.showLoading = showLoading;
window.validateField = validateField;
window.validateForm = validateForm;
window.showModal = showModal;
window.closeModal = closeModal;
window.animateCounter = animateCounter;
window.animateElement = animateElement;
window.setupImagePreview = setupImagePreview;
window.saveToStorage = saveToStorage;
window.getFromStorage = getFromStorage;
window.removeFromStorage = removeFromStorage;
window.initializeGlobalFeatures = initializeGlobalFeatures;