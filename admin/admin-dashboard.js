// ===============================================
// ADMIN DASHBOARD JAVASCRIPT
// ===============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupPageNavigation();
  setupNotifications();
  initializeMap();
});

function initializeDashboard() {
  if (!isAuthenticated()) {
    window.location.href = '../auth/login.html';
    return;
  }
  const userData = getAuthData();
  document.getElementById('userName').textContent = userData.name || 'System Administrator';
  updateThemeButton();
  setupCounterAnimations();
}

function setupPageNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      switchPage(page);
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function switchPage(pageName) {
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => page.classList.remove('active'));
  const selectedPage = document.querySelector(`.page-content[data-page="${pageName}"]`);
  if (selectedPage) {
    selectedPage.classList.add('active');
    document.querySelector('.pages-container').scrollTop = 0;
    if (pageName === 'dashboard') {
      initializeMap();
    } else if (pageName === 'ai-insights') {
      if (typeof MLAnalytics !== 'undefined') {
        MLAnalytics.renderDemandForecastChart('demandForecastChart');
      }
    }
  }
}

function setupCounterAnimations() {
  const statValues = document.querySelectorAll('.stat-value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.animated) {
        let valueStr = entry.target.textContent.replace(/,/g, '').replace('K', '000');
        let value = parseInt(valueStr);
        if(!isNaN(value)) {
            animateNumber(entry.target, 0, value, 1000);
            entry.target.animated = true;
        }
      }
    });
  });
  statValues.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration) {
  let startTime = null;
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    const progress = (currentTime - startTime) / duration;
    if (progress < 1) {
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current > 1000 ? (current/1000).toFixed(1) + 'K' : current;
      requestAnimationFrame(animate);
    } else {
      element.textContent = end > 1000 ? (end/1000).toFixed(0) + 'K' : end;
    }
  }
  requestAnimationFrame(animate);
}

function setupNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  if(notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      showToast('You have 9 system alerts', 'info');
    });
  }
}

function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || mapContainer._leaflet_id) return; 

  try {
    const map = L.map('map').setView([28.7041, 77.1025], 5); // Center on India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const markers = [
      { lat: 28.7041, lng: 77.1025, title: 'Delhi Hub', type: 'food', color: '#1d4ed8' },
      { lat: 19.0760, lng: 72.8777, title: 'Mumbai Hub', type: 'blood', color: '#dc2626' },
      { lat: 12.9716, lng: 77.5946, title: 'Bangalore Hub', type: 'education', color: '#10b981' },
      { lat: 22.5726, lng: 88.3639, title: 'Kolkata Hub', type: 'volunteer', color: '#f97316' }
    ];

    const createMarkerIcon = (color) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    markers.forEach(marker => {
      L.marker([marker.lat, marker.lng], { icon: createMarkerIcon(marker.color) })
        .bindPopup(`<strong>${marker.title}</strong><br>Type: ${marker.type}`)
        .addTo(map);
    });

  } catch (error) {
    console.log('Map initialization skipped', error);
  }
}

function updateThemeButton() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

function logout() {
  if (confirm('Logout of Admin Console?')) {
    removeFromStorage('user');
    removeFromStorage('isAuthenticated');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = '../auth/login.html';
    }, 1000);
  }
}

window.switchPage = switchPage;
window.logout = logout;
