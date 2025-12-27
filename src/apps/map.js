/**
 * Map application module for DEVDEBUG OS
 * Uses Leaflet.js and OpenStreetMap
 */

export function initializeMapWindow(windowElement, system) {
    const { API_CONFIG, ANIMATION_CONSTANTS } = system;

    // --- NEW: Custom Control for Live Coordinates ---
    L.Control.Coordinates = L.Control.extend({
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-control-coordinates');
            container.innerHTML = 'Lat: 0.00000, Lon: 0.00000';

            map.on('mousemove', (e) => {
                const wrappedLatLng = e.latlng.wrap(); // FIX: Wrap coordinates
                const lat = wrappedLatLng.lat.toFixed(5);
                const lng = wrappedLatLng.lng.toFixed(5);
                container.innerHTML = `Lat: ${lat}, Lon: ${lng}`;
            });

            map.on('mouseout', () => {
                container.innerHTML = '---';
            });

            return container;
        },
        onRemove: function (map) {
            map.off('mousemove');
            map.off('mouseout');
        }
    });

    // --- NEW: Custom Select Dropdown Control for Layers ---
    L.Control.SelectLayers = L.Control.extend({
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-control-select-layers leaflet-bar');
            const select = L.DomUtil.create('select', '', container);

            // Populate select options
            for (const name in this.options.baseLayers) {
                const option = L.DomUtil.create('option', '', select);
                option.value = name;
                option.innerHTML = name;
                if (map.hasLayer(this.options.baseLayers[name])) {
                    select.value = name;
                }
            }

            L.DomEvent.on(select, 'change', () => {
                const selectedLayerName = select.value;
                // Remove all other base layers
                for (const name in this.options.baseLayers) {
                    if (map.hasLayer(this.options.baseLayers[name])) {
                        map.removeLayer(this.options.baseLayers[name]);
                    }
                }
                // Add the selected one
                map.addLayer(this.options.baseLayers[selectedLayerName]);
            });

            // Prevent map clicks from propagating
            L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
            L.DomEvent.on(container, 'mousedown', L.DomEvent.stopPropagation);
            return container;
        },
        onRemove: function (map) {
            // Nothing to do here
        }
    });

    // --- NEW: Custom Coordinate Search Control ---
    L.Control.LatLonSearch = L.Control.extend({
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-control-latlon-search');
            container.innerHTML = `
                <div class="latlon-container">
                    <div class="input-group">
                        <span>Latitude</span>
                        <input type="text" id="lat-input" placeholder="e.g. 28.6139" title="Latitude (-90 to 90)">
                    </div>
                    <div class="input-group">
                        <span>Longitude</span>
                        <input type="text" id="lon-input" placeholder="e.g. 77.2090" title="Longitude (-180 to 180)">
                    </div>
                    <button id="coord-search-btn" title="Search Coordinates">
                        <i data-lucide="search"></i>
                    </button>
                </div>
            `;

            const latInput = container.querySelector('#lat-input');
            const lonInput = container.querySelector('#lon-input');
            const btn = container.querySelector('#coord-search-btn');

            const performSearch = () => {
                const latVal = latInput.value.trim();
                const lonVal = lonInput.value.trim();

                if (!latVal || !lonVal) return;

                const lat = parseFloat(latVal);
                const lon = parseFloat(lonVal);

                if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    const latlng = L.latLng(lat, lon);
                    map.setView(latlng, 13, { animate: true });
                    reverseGeocodeAndPlaceMarker(latlng);
                } else {
                    alert('Invalid coordinates.\nLatitude: -90 to 90\nLongitude: -180 to 180');
                }
            };

            L.DomEvent.on(btn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                performSearch();
            });

            L.DomEvent.on(latInput, 'keydown', (e) => {
                if (e.key === 'Enter') performSearch();
            });

            L.DomEvent.on(lonInput, 'keydown', (e) => {
                if (e.key === 'Enter') performSearch();
            });

            L.DomEvent.disableClickPropagation(container);

            // Re-render Lucide icons for the new control
            setTimeout(() => {
                if (window.lucide) {
                    lucide.createIcons({ nodes: container.querySelectorAll('[data-lucide]') });
                }
            }, 100);

            return container;
        },
        onRemove: function (map) {
            // Cleanup
        }
    });

    // --- NEW: Search Mode Toggle Control ---
    L.Control.SearchToggle = L.Control.extend({
        onAdd: function (map) {
            this._mode = null;
            const container = L.DomUtil.create('div', 'leaflet-control-search-toggle');
            container.innerHTML = `
                <div class="search-toggle-btn" id="toggle-address" title="Address Search">
                    <i data-lucide="search"></i>
                </div>
                <div class="search-toggle-btn" id="toggle-coords" title="Coordinate Search">
                    <i data-lucide="compass"></i>
                </div>
            `;

            const addressBtn = container.querySelector('#toggle-address');
            const coordsBtn = container.querySelector('#toggle-coords');

            L.DomEvent.on(addressBtn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                this.toggleMode('address');
            });

            L.DomEvent.on(coordsBtn, 'click', (e) => {
                L.DomEvent.stopPropagation(e);
                this.toggleMode('coords');
            });

            L.DomEvent.disableClickPropagation(container);

            setTimeout(() => {
                if (window.lucide) {
                    lucide.createIcons({ nodes: container.querySelectorAll('[data-lucide]') });
                }
            }, 100);

            return container;
        },
        toggleMode: function (mode) {
            if (this._mode === mode) {
                this.setMode(null);
            } else {
                this.setMode(mode);
            }
        },
        setMode: function (mode) {
            this._mode = mode;
            const addressBtn = this._container.querySelector('#toggle-address');
            const coordsBtn = this._container.querySelector('#toggle-coords');

            const mapContainer = this._map.getContainer();
            const addressSearch = mapContainer.querySelector('.leaflet-control-geosearch');
            const coordsSearch = mapContainer.querySelector('.leaflet-control-latlon-search');

            addressBtn?.classList.remove('active');
            coordsBtn?.classList.remove('active');

            [addressSearch, coordsSearch].forEach(el => {
                if (el) {
                    el.classList.remove('map-search-visible');
                    el.classList.add('map-search-hidden');
                }
            });

            if (mode === 'address' && addressSearch) {
                addressBtn?.classList.add('active');
                addressSearch.classList.remove('map-search-hidden');
                addressSearch.classList.add('map-search-visible');
            } else if (mode === 'coords' && coordsSearch) {
                coordsBtn?.classList.add('active');
                coordsSearch.classList.remove('map-search-hidden');
                coordsSearch.classList.add('map-search-visible');
            }
        }
    });

    // Prevent re-initialization
    if (windowElement.querySelector('#map-container.leaflet-container')) {
        return;
    }

    windowElement.querySelector('.window-content').innerHTML = `<div id="map-container" class="h-full w-full"></div>`;
    const mapContainer = windowElement.querySelector('#map-container');

    // Layers
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {});
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {});

    const resizeObserver = new ResizeObserver(() => {
        setTimeout(() => map.invalidateSize(), ANIMATION_CONSTANTS.RESIZE_DEBOUNCE);
    });
    resizeObserver.observe(windowElement.querySelector('.window-content'));
    windowElement.resizeObserver = resizeObserver; // Store for cleanup

    const map = L.map(mapContainer, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        layers: [darkLayer],
        attributionControl: false,
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    const baseMaps = {
        "Default": darkLayer,
        "Satellite": satelliteLayer,
        "Street": streetLayer,
        "Topographic": topoLayer
    };
    new L.Control.SelectLayers({ baseLayers: baseMaps }, { position: 'topright' }).addTo(map);
    new L.Control.Coordinates({ position: 'bottomright' }).addTo(map);

    let customMarker = null;
    const greenIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="%23FFFFFF" stroke="%23000000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const placeMarker = (latlng, popupContent) => {
        if (customMarker) map.removeLayer(customMarker);
        customMarker = L.marker(latlng, { icon: greenIcon }).addTo(map);
        if (popupContent) customMarker.bindPopup(popupContent).openPopup();
    };

    const reverseGeocodeAndPlaceMarker = async (latlng) => {
        const wrappedLatLng = latlng.wrap();
        const lat = wrappedLatLng.lat;
        const lng = wrappedLatLng.lng;
        const defaultPopup = `<b>Coordinates:</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        placeMarker(wrappedLatLng, `<b>Locating...</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`);

        if (!API_CONFIG.OPENCAGE.KEY || API_CONFIG.OPENCAGE.KEY === 'YOUR_OPENCAGE_API_KEY') {
            placeMarker(wrappedLatLng, defaultPopup);
            return;
        }

        try {
            const response = await fetch(`${API_CONFIG.OPENCAGE.BASE_URL}?q=${lat}+${lng}&key=${API_CONFIG.OPENCAGE.KEY}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                placeMarker(wrappedLatLng, `<b>${data.results[0].formatted}</b>`);
            } else {
                placeMarker(wrappedLatLng, defaultPopup);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            placeMarker(wrappedLatLng, defaultPopup);
        }
    };

    // --- Unified Search Panel ---
    L.Control.MapSearchPanel = L.Control.extend({
        onAdd: function (map) {
            this._map = map;
            this._mode = null;
            this._provider = new window.GeoSearch.OpenStreetMapProvider();

            const panel = L.DomUtil.create('div', 'map-search-panel');
            panel.innerHTML = `
                <div class="map-search-tabs">
                    <div class="map-search-tab" data-mode="address" title="Search by Address">
                        <i data-lucide="search"></i>
                    </div>
                    <div class="map-search-tab" data-mode="coords" title="Search by Coordinates">
                        <i data-lucide="compass"></i>
                    </div>
                </div>
                <div class="map-search-content" id="search-address">
                    <div class="map-search-address">
                        <input type="text" id="address-input" placeholder="Enter location or address..." />
                        <button class="map-search-btn" id="address-search-btn" title="Search">
                            <i data-lucide="search"></i>
                        </button>
                    </div>
                </div>
                <div class="map-search-content" id="search-coords">
                    <div class="map-search-coords">
                        <div class="map-coord-input-group">
                            <label>Latitude</label>
                            <input type="text" id="coord-lat" placeholder="e.g. 28.6139" />
                        </div>
                        <div class="map-coord-input-group">
                            <label>Longitude</label>
                            <input type="text" id="coord-lon" placeholder="e.g. 77.2090" />
                        </div>
                        <button class="map-search-btn" id="coords-search-btn" title="Go">
                            <i data-lucide="map-pin"></i>
                        </button>
                    </div>
                </div>
                <div class="map-search-results" id="search-results"></div>
            `;

            const tabs = panel.querySelectorAll('.map-search-tab');
            const addressContent = panel.querySelector('#search-address');
            const coordsContent = panel.querySelector('#search-coords');
            const resultsContainer = panel.querySelector('#search-results');
            const addressInput = panel.querySelector('#address-input');

            tabs.forEach(tab => {
                L.DomEvent.on(tab, 'click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    const mode = tab.dataset.mode;
                    if (this._mode === mode) {
                        this._mode = null;
                        tabs.forEach(t => t.classList.remove('active'));
                        addressContent.classList.remove('active');
                        coordsContent.classList.remove('active');
                    } else {
                        this._mode = mode;
                        tabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        addressContent.classList.remove('active');
                        coordsContent.classList.remove('active');
                        if (mode === 'address') {
                            addressContent.classList.add('active');
                            setTimeout(() => addressInput.focus(), 100);
                        } else {
                            coordsContent.classList.add('active');
                            setTimeout(() => panel.querySelector('#coord-lat').focus(), 100);
                        }
                    }
                });
            });

            const performAddressSearch = async () => {
                const query = addressInput.value.trim();
                if (!query) return;
                try {
                    const results = await this._provider.search({ query });
                    resultsContainer.innerHTML = '';
                    if (results.length > 0) {
                        results.slice(0, 6).forEach(result => {
                            const item = document.createElement('div');
                            item.className = 'map-search-result-item';
                            item.textContent = result.label;
                            item.addEventListener('click', () => {
                                const latlng = L.latLng(result.y, result.x);
                                map.setView(latlng, 13, { animate: true });
                                reverseGeocodeAndPlaceMarker(latlng);
                                resultsContainer.classList.remove('active');
                                addressInput.value = result.label;
                            });
                            resultsContainer.appendChild(item);
                        });
                        resultsContainer.classList.add('active');
                    } else {
                        resultsContainer.classList.remove('active');
                    }
                } catch (err) { console.error('Search error:', err); }
            };

            L.DomEvent.on(panel.querySelector('#address-search-btn'), 'click', (e) => { L.DomEvent.stopPropagation(e); performAddressSearch(); });
            L.DomEvent.on(addressInput, 'keydown', (e) => {
                if (e.key === 'Enter') performAddressSearch();
                if (e.key === 'Escape') {
                    addressInput.value = '';
                    resultsContainer.classList.remove('active');
                }
            });

            const performCoordsSearch = () => {
                const lat = parseFloat(panel.querySelector('#coord-lat').value.trim());
                const lon = parseFloat(panel.querySelector('#coord-lon').value.trim());
                if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    const latlng = L.latLng(lat, lon);
                    map.setView(latlng, 13, { animate: true });
                    reverseGeocodeAndPlaceMarker(latlng);
                } else {
                    alert('Invalid coordinates.\nLatitude: -90 to 90\nLongitude: -180 to 180');
                }
            };

            L.DomEvent.on(panel.querySelector('#coords-search-btn'), 'click', (e) => { L.DomEvent.stopPropagation(e); performCoordsSearch(); });
            const latInp = panel.querySelector('#coord-lat');
            const lonInp = panel.querySelector('#coord-lon');
            L.DomEvent.on(latInp, 'keydown', (e) => { if (e.key === 'Enter') performCoordsSearch(); });
            L.DomEvent.on(lonInp, 'keydown', (e) => { if (e.key === 'Enter') performCoordsSearch(); });

            L.DomEvent.on(map.getContainer(), 'click', () => {
                resultsContainer.classList.remove('active');
            });

            L.DomEvent.disableClickPropagation(panel);
            L.DomEvent.disableScrollPropagation(panel);
            setTimeout(() => { if (window.lucide) lucide.createIcons({ nodes: panel.querySelectorAll('[data-lucide]') }); }, 50);
            return panel;
        }
    });

    new L.Control.MapSearchPanel({ position: 'topleft' }).addTo(map);

    map.on('click', (e) => reverseGeocodeAndPlaceMarker(e.latlng));
}
