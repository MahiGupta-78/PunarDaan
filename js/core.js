/**
 * PUNARDAAN CORE SYSTEM
 * Consolidated Utilities, Authentication, Translation, and Theme Management
 */

const Core = {
    // ==================== CONFIGURATION ====================
    config: {
        storagePrefix: 'punardaan_',
        defaultLanguage: 'en',
        defaultTheme: 'light',
        roles: {
            donor: { title: 'Donor', dashboard: 'donor/donor-dashboard.html' },
            ngo: { title: 'NGO', dashboard: 'NGO/ngo-dashboard.html' },
            volunteer: { title: 'Volunteer', dashboard: 'volunteer/volunteer-dashboard.html' },
            student: { title: 'Student', dashboard: 'students/student-dashboard.html' },
            blood_donor: { title: 'Blood Donor', dashboard: 'blood/blood-dashboard.html' },
            animal_shelter: { title: 'Animal Shelter', dashboard: 'animal-shelter/shelter-dashboard.html' },
            receiver: { title: 'Receiver', dashboard: 'receiver/receiver-dashboard.html' },
            restaurant: { title: 'Restaurant', dashboard: 'restaurant/restaurant-dashboard.html' },
            school: { title: 'School', dashboard: 'school/school-dashboard.html' },
            hospital: { title: 'Hospital', dashboard: 'hospital/hospital-dashboard.html' },
            admin: { title: 'Admin', dashboard: 'admin/admin-dashboard.html' }
        }
    },

    // ==================== STATE ====================
    state: {
        language: localStorage.getItem('punardaan_language') || 'en',
        theme: localStorage.getItem('punardaan_theme') || 'light',
        user: JSON.parse(localStorage.getItem('punardaan_user')) || null,
        isAuthenticated: localStorage.getItem('punardaan_isAuthenticated') === 'true'
    },

    // ==================== INITIALIZATION ====================
    init() {
        console.log('Punardaan Core Initializing...');
        this.applyTheme();
        this.applyLanguage();
        this.handleQueryParams();
        this.setupGlobalListeners();
        this.hidePageLoader();
    },

    handleQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (role && window.selectRole) {
            setTimeout(() => window.selectRole(role), 500);
        }
    },

    // ==================== AUTHENTICATION ====================
    auth: {
        login(email, password) {
            const users = JSON.parse(localStorage.getItem('PUNARDAAN_USERS')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                const authData = {
                    ...user,
                    loginTime: new Date().toISOString(),
                    token: Core.utils.generateToken()
                };
                Core.auth.saveSession(authData);
                return { success: true, user: authData };
            }
            return { success: false, error: 'Invalid email or password' };
        },

        register(userData) {
            const users = JSON.parse(localStorage.getItem('PUNARDAAN_USERS')) || [];
            if (users.find(u => u.email === userData.email)) {
                return { success: false, error: 'Email already registered' };
            }

            const newUser = {
                ...userData,
                id: 'user_' + Date.now(),
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('PUNARDAAN_USERS', JSON.stringify(users));
            return { success: true, user: newUser };
        },

        logout() {
            localStorage.removeItem('punardaan_user');
            localStorage.setItem('punardaan_isAuthenticated', 'false');
            Core.state.user = null;
            Core.state.isAuthenticated = false;
            
            const pathPrefix = window.location.pathname.includes('/auth/') || 
                               window.location.pathname.includes('/donor/') ||
                               window.location.pathname.includes('/NGO/') ||
                               window.location.pathname.includes('/volunteer/') ||
                               window.location.pathname.includes('/students/') ? '../' : './';
            window.location.href = pathPrefix + 'index.html';
        },

        saveSession(userData) {
            localStorage.setItem('punardaan_user', JSON.stringify(userData));
            localStorage.setItem('punardaan_isAuthenticated', 'true');
            Core.state.user = userData;
            Core.state.isAuthenticated = true;
        },

        redirect() {
            if (Core.state.isAuthenticated && Core.state.user) {
                const role = Core.state.user.role;
                const dashboard = Core.config.roles[role]?.dashboard || 'index.html';
                // Calculate relative path
                const pathPrefix = window.location.pathname.includes('/auth/') ? '../' : './';
                window.location.href = pathPrefix + dashboard;
            }
        }
    },

    // ==================== THEME SYSTEM ====================
    toggleTheme() {
        Core.state.theme = Core.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('punardaan_theme', Core.state.theme);
        Core.applyTheme();
    },

    applyTheme() {
        document.body.classList.toggle('dark-mode', Core.state.theme === 'dark');
        document.body.classList.toggle('light-mode', Core.state.theme === 'light');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = Core.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    },

    // ==================== TRANSLATION SYSTEM ====================
    translations: {
        en: {
            home: "Home",
            donate: "Donate",
            ngos: "NGOs",
            impact: "Impact",
            contact: "Contact",
            login: "Login",
            register: "Register",
            logout: "Logout",
            welcome: "Welcome",
            dashboard: "Dashboard",
            loading: "Loading PUNARDAAN...",
            tagline: "Don't Waste. Redistribute. Transform Lives.",
            transformLives: "Transform Lives.",
            heroSub: "Punardaan is the world's smartest ecosystem for donation, volunteering, and emergency support. Powered by AI to match resources where they are needed most.",
            donateNow: "Donate Now",
            requestHelp: "Request Help",
            food: "Food",
            blood: "Blood",
            books: "Books",
            clothes: "Clothes",
            myDonations: "My Donations",
            helpRequests: "Help Requests",
            nearbyNGOs: "Nearby NGOs",
            profile: "Profile",
            searchRequests: "Search requests...",
            welcomeBack: "Welcome Back",
            todayImpact: "Today's Impact",
            totalDonations: "Total Donations",
            livesImpacted: "Lives Impacted",
            impactScore: "Impact Score",
            rank: "Community Rank",
            quickActions: "Quick Actions",
            newDonation: "New Donation",
            findRequests: "Find Requests",
            recentActivity: "Recent Activity",
            all: "All",
            save: "Save Changes",
            changePassword: "Change Password"
        },
        hi: {
            home: "होम",
            donate: "दान करें",
            ngos: "एनजीओ",
            impact: "प्रभाव",
            contact: "संपर्क",
            login: "लॉगिन",
            register: "रजिस्टर",
            logout: "लॉगआउट",
            welcome: "स्वागत है",
            dashboard: "डैशबोर्ड",
            loading: "पुनर्दान लोड हो रहा है...",
            tagline: "बर्बाद न करें। पुनर्वितरित करें। जीवन बदलें।",
            transformLives: "जीवन बदलें।",
            heroSub: "पुनर्दान दान, स्वयंसेवा और आपातकालीन सहायता के लिए दुनिया का सबसे स्मार्ट पारिस्थितिकी तंत्र है।",
            donateNow: "अभी दान करें",
            requestHelp: "सहायता मांगें",
            food: "भोजन",
            blood: "रक्त",
            books: "पुस्तकें",
            clothes: "कपड़े",
            myDonations: "मेरे दान",
            helpRequests: "सहायता अनुरोध",
            nearbyNGOs: "पास के एनजीओ",
            profile: "प्रोफ़ाइल",
            searchRequests: "अनुरोध खोजें...",
            welcomeBack: "वापसी पर स्वागत है",
            todayImpact: "आज का प्रभाव",
            totalDonations: "कुल दान",
            livesImpacted: "प्रभावित जीवन",
            impactScore: "प्रभाव स्कोर",
            rank: "सामुदायिक रैंक",
            quickActions: "त्वरित कार्रवाई",
            newDonation: "नया दान",
            findRequests: "अनुरोध खोजें",
            recentActivity: "हाल की गतिविधि",
            all: "सभी",
            save: "परिवर्तन सहेजें",
            changePassword: "पासवर्ड बदलें"
        }
    },

    setLanguage(lang) {
        if (this.translations[lang]) {
            Core.state.language = lang;
            localStorage.setItem('punardaan_language', lang);
            this.applyLanguage();
        }
    },

    applyLanguage() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translations[Core.state.language][key] || key;
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });
        const langText = document.getElementById('langText');
        if (langText) langText.textContent = Core.state.language.toUpperCase();
    },

    // ==================== UI UTILITIES ====================
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-in`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        container.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.onclick = () => this.removeToast(toast);

        setTimeout(() => this.removeToast(toast), 4000);
    },

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    removeToast(toast) {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    },

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    },

    showLoading(btn, text = 'Loading...') {
        const originalContent = btn.innerHTML;
        const originalDisabled = btn.disabled;
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        return () => {
            btn.innerHTML = originalContent;
            btn.disabled = originalDisabled;
        };
    },

    animateCounter(el, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = Math.floor(target).toLocaleString();
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(start).toLocaleString();
            }
        }, 16);
    },

    showPageLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) loader.style.display = 'flex';
    },

    hidePageLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.style.display = 'none', 500);
        }
    },

    // ==================== UTILS ====================
    utils: {
        generateToken() {
            return 'pk_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        },
        
        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        validatePhone(phone) {
            return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
        }
    },

    // ==================== GLOBAL LISTENERS ====================
    setupGlobalListeners() {
        // Theme Toggle
        const themeBtn = document.getElementById('darkModeBtn');
        if (themeBtn) themeBtn.onclick = () => this.toggleTheme();

        // Language Toggle
        const langBtn = document.getElementById('languageBtn');
        if (langBtn) {
            langBtn.onclick = () => {
                const nextLang = Core.state.language === 'en' ? 'hi' : 'en';
                this.setLanguage(nextLang);
            };
        }

        // Logout Global
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.auth.logout();
            };
        });
    }
};

// Initialize Core on Load
document.addEventListener('DOMContentLoaded', () => Core.init());

// Export for global access
window.Core = Core;
