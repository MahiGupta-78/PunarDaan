/**
 * PUNARDAAN MAIN SCRIPT
 * Entry point and UI controllers.
 */

const App = {
    init() {
        console.log('Punardaan App Initializing...');
        this.applyTheme();
        Translations.apply();
        this.setupListeners();
        this.hideLoader();
    },

    setupListeners() {
        // Theme Toggle
        const themeBtn = document.getElementById('darkModeBtn');
        if (themeBtn) {
            themeBtn.onclick = () => {
                const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
                localStorage.setItem('punardaan_theme', theme);
                this.applyTheme();
            };
        }

        // Language Toggle
        const langBtn = document.getElementById('languageBtn');
        if (langBtn) {
            langBtn.onclick = () => Translations.toggle();
        }

        // Logout
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                Auth.logout();
            };
        });
    },

    applyTheme() {
        const theme = localStorage.getItem('punardaan_theme') || 'light';
        document.body.classList.toggle('dark-mode', theme === 'dark');
        document.body.classList.toggle('light-mode', theme === 'light');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },

    hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.style.display = 'none', 500);
        }
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas ${this.getToastIcon(type)}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    },

    createToastContainer() {
        const div = document.createElement('div');
        div.id = 'toastContainer';
        div.className = 'toast-container';
        document.body.appendChild(div);
        return div;
    },

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
