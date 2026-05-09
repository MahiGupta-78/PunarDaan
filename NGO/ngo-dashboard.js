// ===============================================
// NGO DASHBOARD JAVASCRIPT
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
  document.getElementById('userName').textContent = userData.name || 'Organization';
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
  }
}

function setupCounterAnimations() {
  const statValues = document.querySelectorAll('.stat-value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.animated) {
        let valueStr = entry.target.textContent.replace(/,/g, '');
        let value = parseFloat(valueStr);
        if(!isNaN(value)) {
            animateNumber(entry.target, 0, value, 1000, valueStr.includes('.'));
            entry.target.animated = true;
        }
      }
    });
  });
  statValues.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, isFloat) {
  let startTime = null;
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    const progress = (currentTime - startTime) / duration;
    if (progress < 1) {
      const current = start + (end - start) * progress;
      element.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      requestAnimationFrame(animate);
    } else {
      element.textContent = isFloat ? end.toFixed(1) : end;
      if (element.textContent === '75') element.textContent += '%'; // Hack for the 75% stat
    }
  }
  requestAnimationFrame(animate);
}

function setupNotifications() {
  const notificationBtn = document.querySelector('.notification-btn');
  if(notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      showToast('You have 3 inventory alerts', 'info');
    });
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
  if (confirm('Logout of NGO Dashboard?')) {
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
