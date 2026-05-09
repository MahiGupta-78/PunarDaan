/**
 * PUNARDAAN AUTH SYSTEM
 * Handles registration, login, logout, and session management.
 */

const Auth = {
    login(email, password) {
        const users = JSON.parse(localStorage.getItem('PUNARDAAN_USERS')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.saveSession(user);
            return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials. Please try again.' };
    },

    register(userData) {
        const users = JSON.parse(localStorage.getItem('PUNARDAAN_USERS')) || [];
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email already registered.' };
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
        
        // Determine redirect path
        const path = window.location.pathname;
        const prefix = path.includes('/auth/') || path.includes('/donor/') || path.includes('/NGO/') || path.includes('/students/') || path.includes('/impact/') ? '../' : './';
        window.location.href = prefix + 'index.html';
    },

    saveSession(user) {
        localStorage.setItem('punardaan_user', JSON.stringify(user));
        localStorage.setItem('punardaan_isAuthenticated', 'true');
    },

    getUser() {
        return JSON.parse(localStorage.getItem('punardaan_user'));
    },

    isAuthenticated() {
        return localStorage.getItem('punardaan_isAuthenticated') === 'true';
    },

    redirect() {
        if (this.isAuthenticated()) {
            const user = this.getUser();
            const roles = {
                donor: 'donor/donor-dashboard.html',
                ngo: 'NGO/ngo-dashboard.html',
                volunteer: 'volunteer/volunteer-dashboard.html',
                student: 'students/student-dashboard.html'
            };
            const dashboard = roles[user.role] || 'index.html';
            const prefix = window.location.pathname.includes('/auth/') ? '../' : './';
            window.location.href = prefix + dashboard;
        }
    }
};

window.Auth = Auth;
