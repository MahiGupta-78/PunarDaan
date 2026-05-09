// ===============================================
// VOLUNTEER DASHBOARD JAVASCRIPT
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  setupPageNavigation();
  setupNotifications();
});

function initializeDashboard() {
  if (!isAuthenticated()) {
    window.location.href = '../auth/login.html';
    return;
  }
  const userData = getAuthData();
  document.getElementById('userName').textContent = userData.name || 'Volunteer';
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
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => page.classList.remove('active'));

  // Show selected page
  const selectedPage = document.querySelector(`.page-content[data-page="${pageName}"]`);
  if (selectedPage) {
    selectedPage.classList.add('active');
    document.querySelector('.pages-container').scrollTop = 0;
    if (pageName === 'dispatch') {
      initializeMap();
    }
  }
}

function setupCounterAnimations() {
  const statValues = document.querySelectorAll('.stat-value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.animated) {
        let valueStr = entry.target.textContent.replace(/[^0-9.]/g, '');
        let value = parseFloat(valueStr);
        if(!isNaN(value)) {
            animateNumber(entry.target, 0, value, 1000, entry.target.textContent);
            entry.target.animated = true;
        }
      }
    });
  });
  statValues.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, originalText) {
  let startTime = null;
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    const progress = (currentTime - startTime) / duration;
    if (progress < 1) {
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current;
      requestAnimationFrame(animate);
    } else {
      element.textContent = originalText;
    }
  }
  requestAnimationFrame(animate);
}

function setupNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  if(notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      showToast('You have 1 priority dispatch', 'info');
    });
  }
}

function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || mapContainer._leaflet_id) return; 

  try {
    const map = L.map('map').setView([28.7041, 77.1025], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: var(--blue); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>`
    });

    const endIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: var(--green); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>`
    });

    L.marker([28.7041, 77.1025], { icon: startIcon }).bindPopup('Pickup: Om Shree Dhaba').addTo(map);
    L.marker([28.6500, 77.2000], { icon: endIcon }).bindPopup('Dropoff: Hope Orphanage').addTo(map);
    
    // Draw route line
    const latlngs = [
      [28.7041, 77.1025],
      [28.6800, 77.1500],
      [28.6500, 77.2000]
    ];
    L.polyline(latlngs, {color: 'var(--blue)', weight: 4, dashArray: '10, 10'}).addTo(map);

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
  if (confirm('Logout of Volunteer Dashboard?')) {
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
