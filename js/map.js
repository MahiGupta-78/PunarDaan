/**
 * PUNARDAAN MAP SYSTEM
 * Handles Leaflet.js initialization and NGO markers.
 */

const MapSystem = {
    instance: null,

    init(containerId, center = [30.3165, 78.0322], zoom = 12) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Cleanup if already exists
        if (this.instance) {
            this.instance.remove();
        }

        this.instance = L.map(containerId).setView(center, zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.instance);

        return this.instance;
    },

    addMarkers(ngos) {
        if (!this.instance) return;

        ngos.forEach(ngo => {
            const marker = L.marker([ngo.latitude, ngo.longitude]).addTo(this.instance);
            marker.bindPopup(`
                <div class="map-popup">
                    <img src="${ngo.image}" style="width: 100%; border-radius: 8px; margin-bottom: 8px;">
                    <h4 style="margin-bottom: 5px;">${ngo.name}</h4>
                    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 10px;">${ngo.category}</p>
                    <button class="btn btn-primary btn-xs" onclick="window.location.href='../auth/register.html?role=donor'">Donate Now</button>
                </div>
            `);
        });
    },

    fitBounds(points) {
        if (!this.instance || points.length === 0) return;
        const bounds = L.latLngBounds(points);
        this.instance.fitBounds(bounds);
    }
};

window.MapSystem = MapSystem;
