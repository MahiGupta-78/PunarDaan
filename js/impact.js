/**
 * PUNARDAAN IMPACT SYSTEM
 * Handles analytics, counters, and progress rings.
 */

const ImpactSystem = {
    init() {
        this.animateCounters();
        this.initCharts();
        this.initProgressRings();
    },

    animateCounters() {
        document.querySelectorAll('.counter').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            let current = 0;
            const step = target / 100;
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = Math.floor(target).toLocaleString();
                    clearInterval(interval);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }
            }, 10);
        });
    },

    initCharts() {
        const ctx = document.getElementById('donationChart');
        if (!ctx) return;

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#94a3b8' : '#64748b';

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Impact Growth',
                    data: [1200, 1500, 1800, 2200, 3000, 4500],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: isDark ? '#1e293b' : '#f1f5f9' }, ticks: { color: textColor } },
                    x: { grid: { display: false }, ticks: { color: textColor } }
                }
            }
        });
    },

    initProgressRings() {
        document.querySelectorAll('.progress-circle').forEach(circle => {
            const bar = circle.querySelector('.bar');
            const percentEl = circle.parentElement.querySelector('.percentage');
            if (!bar || !percentEl) return;

            const radius = bar.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const targetPercent = parseInt(percentEl.textContent);

            bar.style.strokeDasharray = circumference;
            bar.style.strokeDashoffset = circumference;

            setTimeout(() => {
                const offset = circumference - (targetPercent / 100) * circumference;
                bar.style.strokeDashoffset = offset;
            }, 500);
        });
    }
};

window.ImpactSystem = ImpactSystem;
