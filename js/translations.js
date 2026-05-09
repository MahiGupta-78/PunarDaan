/**
 * PUNARDAAN TRANSLATION SYSTEM
 * Handles multilingual support (English & Hindi).
 */

const Translations = {
    dictionary: {
        en: {
            home: "Home",
            donate: "Donate",
            ngos: "NGOs",
            impact: "Impact",
            contact: "Contact",
            login: "Login",
            register: "Register",
            logout: "Logout",
            transformLives: "Transform Lives.",
            heroSub: "Punardaan is the world's smartest ecosystem for donation, volunteering, and emergency support.",
            donateNow: "Donate Now",
            requestHelp: "Request Help",
            nearbyNGOs: "Nearby NGOs",
            mealsSaved: "Meals Saved",
            livesImpacted: "Lives Impacted",
            bloodDonations: "Blood Donations",
            volunteerHours: "Volunteer Hours"
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
            transformLives: "जीवन बदलें।",
            heroSub: "पुनर्दान दान, स्वयंसेवा और आपातकालीन सहायता के लिए दुनिया का सबसे स्मार्ट पारिस्थितिकी तंत्र है।",
            donateNow: "अभी दान करें",
            requestHelp: "सहायता मांगें",
            nearbyNGOs: "पास के एनजीओ",
            mealsSaved: "भोजन दान",
            livesImpacted: "प्रभावित जीवन",
            bloodDonations: "रक्त दान",
            volunteerHours: "सेवा घंटे"
        }
    },

    getLanguage() {
        return localStorage.getItem('punardaan_language') || 'en';
    },

    setLanguage(lang) {
        localStorage.setItem('punardaan_language', lang);
        this.apply();
    },

    toggle() {
        const next = this.getLanguage() === 'en' ? 'hi' : 'en';
        this.setLanguage(next);
    },

    apply() {
        const lang = this.getLanguage();
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            const text = this.dictionary[lang][key] || key;
            if (el.tagName === 'INPUT' && el.placeholder) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
        
        const langBtn = document.getElementById('languageBtn');
        if (langBtn) langBtn.innerHTML = `<i class="fas fa-globe"></i> ${lang.toUpperCase()}`;
    }
};

window.Translations = Translations;
