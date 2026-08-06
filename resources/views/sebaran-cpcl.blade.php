@extends('layouts.public')

@section('title', 'Sebaran CPCL')

@push('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css">
    <style>
        #cpcl-map {
            height: calc(100vh - 280px);
            min-height: 480px;
            width: 100%;
            z-index: 0;
        }

        #cpcl-info-panel {
            max-height: calc(100vh - 280px);
            min-height: 480px;
        }

        .cpcl-info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .cpcl-info-table th,
        .cpcl-info-table td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 10px;
            vertical-align: top;
        }

        .cpcl-info-table th {
            width: 42%;
            background: #f9fafb;
            color: #374151;
            font-weight: 600;
            text-align: left;
        }

        .cpcl-info-table td {
            color: #111827;
            word-break: break-word;
        }

        .cpcl-layer-control {
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 500;
            font-family: inherit;
        }

        .cpcl-layer-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 190px;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
            color: #111827;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: box-shadow 0.15s ease;
        }

        .cpcl-layer-toggle:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .cpcl-layer-toggle svg {
            flex-shrink: 0;
            color: #374151;
        }

        .cpcl-layer-toggle .cpcl-layer-chevron {
            margin-left: auto;
            color: #6b7280;
            transition: transform 0.15s ease;
        }

        .cpcl-layer-control.is-open .cpcl-layer-chevron {
            transform: rotate(180deg);
        }

        .cpcl-layer-menu {
            display: none;
            margin-top: 6px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .cpcl-layer-control.is-open .cpcl-layer-menu {
            display: block;
        }

        .cpcl-layer-option {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 12px;
            border: none;
            background: #fff;
            color: #111827;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            transition: background 0.12s ease;
        }

        .cpcl-layer-option:hover {
            background: #f3f4f6;
        }

        .cpcl-layer-option.is-active {
            background: #eff6ff;
            color: #1d4ed8;
        }

        .cpcl-layer-option svg {
            flex-shrink: 0;
            color: #374151;
        }

        .cpcl-layer-option.is-active svg {
            color: #2563eb;
        }

        .cpcl-layer-check {
            margin-left: auto;
            color: #2563eb;
            opacity: 0;
        }

        .cpcl-layer-option.is-active .cpcl-layer-check {
            opacity: 1;
        }

        .cpcl-marker-icon {
            background: transparent !important;
            border: none !important;
        }

        .cpcl-pin {
            position: relative;
            width: 30px;
            height: 30px;
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: transform 0.15s ease, filter 0.15s ease;
        }

        .cpcl-pin:hover {
            transform: translate(-50%, -50%) scale(1.15);
            filter: drop-shadow(0 4px 8px rgba(4, 120, 87, 0.55));
            z-index: 1000 !important;
        }

        .cpcl-pin-dot {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border: 3px solid #fff;
            border-radius: 50%;
            background: linear-gradient(145deg, #10b981 0%, #047857 100%);
            box-shadow: 0 3px 10px rgba(4, 120, 87, 0.45);
            color: #fff;
        }

        .cpcl-pin-dot svg {
            width: 14px;
            height: 14px;
        }

        .marker-cluster-cpcl {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #fff;
            border-radius: 50%;
            background: linear-gradient(145deg, #059669 0%, #065f46 100%);
            box-shadow: 0 4px 14px rgba(4, 120, 87, 0.4);
            color: #fff;
            font-weight: 700;
            font-size: 13px;
        }

        .marker-cluster-cpcl.marker-cluster-medium,
        .marker-cluster-cpcl.marker-cluster-large {
            background: linear-gradient(145deg, #047857 0%, #064e3b 100%);
        }
    </style>
@endpush

@section('content')
    <main class="pt-16">
        <div class="px-4 py-6 sm:px-6 lg:px-16">
            <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Sebaran CPCL</h1>
                    <p class="mt-1 text-sm text-gray-500">Peta sebaran Calon Peserta CPCL berdasarkan titik koordinat petani</p>
                </div>
                <div class="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm">
                    <span class="font-medium text-green-800">Total titik CPCL:</span>
                    <span id="cpcl-total-count" class="font-bold text-green-700">{{ number_format($totalCpcl, 0, ',', '.') }}</span>
                </div>
            </div>

            <div class="mb-4 flex flex-wrap items-center gap-3">
                <label for="cpcl-kabupaten-filter" class="text-sm font-medium text-gray-700">Filter Kabupaten</label>
                <select
                    id="cpcl-kabupaten-filter"
                    class="min-w-[280px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                    <option value="">Semua Kabupaten/Kota</option>
                </select>

                <label for="cpcl-komoditas-filter" class="text-sm font-medium text-gray-700">Filter By Jenis Komoditas</label>
                <select
                    id="cpcl-komoditas-filter"
                    class="min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                    <option value="">Semua Komoditas</option>
                </select>
            </div>

            <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div
                        id="cpcl-map-loader"
                        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 transition-opacity duration-300"
                    >
                        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                            <div class="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                        </div>
                        <p class="mt-4 text-sm font-semibold text-green-800">Memuat peta sebaran CPCL...</p>
                        <p class="mt-1 text-xs text-green-600/80">Mohon tunggu sebentar</p>
                    </div>

                    <div id="cpcl-map"></div>

                    <div id="cpcl-layer-control" class="cpcl-layer-control">
                        <button type="button" id="cpcl-layer-toggle" class="cpcl-layer-toggle" aria-haspopup="listbox" aria-expanded="false">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                                <line x1="8" y1="2" x2="8" y2="18"></line>
                                <line x1="16" y1="6" x2="16" y2="22"></line>
                            </svg>
                            <span id="cpcl-layer-label">Imagery</span>
                            <svg class="cpcl-layer-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <div id="cpcl-layer-menu" class="cpcl-layer-menu" role="listbox" aria-label="Pilih layer peta">
                            <button type="button" class="cpcl-layer-option is-active" data-layer="imagery" role="option">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
                                </svg>
                                <span>Imagery</span>
                                <svg class="cpcl-layer-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </button>
                            <button type="button" class="cpcl-layer-option" data-layer="topographic" role="option">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M8 21l4-7 4 7"></path>
                                    <path d="M12 14V3"></path>
                                    <path d="M4 21h16"></path>
                                    <path d="M3 14l4-4 5 3 5-6 4 5"></path>
                                </svg>
                                <span>Topographic</span>
                                <svg class="cpcl-layer-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </button>
                            <button type="button" class="cpcl-layer-option" data-layer="osm" role="option">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                                    <line x1="8" y1="2" x2="8" y2="18"></line>
                                    <line x1="16" y1="6" x2="16" y2="22"></line>
                                </svg>
                                <span>OpenStreetMap</span>
                                <svg class="cpcl-layer-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <aside
                    id="cpcl-info-panel"
                    class="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm xl:flex xl:flex-col"
                >
                    <div class="border-b border-gray-100 px-4 py-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-green-700">Informasi CPCL</p>
                                <h2 id="cpcl-info-title" class="mt-1 text-base font-bold text-gray-900">Pilih titik pada peta</h2>
                            </div>
                            <button
                                id="cpcl-info-close"
                                type="button"
                                class="rounded-md px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Tutup panel informasi"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div id="cpcl-info-body" class="flex-1 overflow-y-auto px-4 py-3">
                        <p class="text-sm text-gray-500">Klik salah satu titik CPCL di peta untuk melihat detail data petani.</p>
                    </div>
                </aside>
            </div>
        </div>
    </main>
@endsection

@push('scripts')
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
    <script>
        (function () {
            const loader = document.getElementById('cpcl-map-loader');
            const totalCountEl = document.getElementById('cpcl-total-count');
            const kabupatenFilter = document.getElementById('cpcl-kabupaten-filter');
            const komoditasFilter = document.getElementById('cpcl-komoditas-filter');
            const infoPanel = document.getElementById('cpcl-info-panel');
            const infoTitle = document.getElementById('cpcl-info-title');
            const infoBody = document.getElementById('cpcl-info-body');
            const infoClose = document.getElementById('cpcl-info-close');
            const layerControl = document.getElementById('cpcl-layer-control');
            const layerToggle = document.getElementById('cpcl-layer-toggle');
            const layerLabel = document.getElementById('cpcl-layer-label');
            const layerOptions = document.querySelectorAll('.cpcl-layer-option');
            const dataUrl = @json(route('sebaran-cpcl.data'));
            const detailUrlTemplate = @json(route('sebaran-cpcl.petani.show', ['petani' => '__ID__']));

            let allPoints = [];
            let kabupatenOptions = [];
            let komoditasOptions = [];

            const map = L.map('cpcl-map', {
                zoomControl: false,
                scrollWheelZoom: true,
            }).setView([-2.5, 118], 5);

            L.control.zoom({ position: 'topright' }).addTo(map);

            const baseLayers = {
                osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }),
                imagery: L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                    subdomains: ['0', '1', '2', '3'],
                    maxZoom: 20,
                    maxNativeZoom: 19,
                    attribution: '&copy; Google',
                }),
                topographic: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    maxZoom: 17,
                    maxNativeZoom: 17,
                    attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
                }),
            };

            const layerLabels = {
                osm: 'OpenStreetMap',
                imagery: 'Imagery',
                topographic: 'Topographic',
            };

            let activeBaseLayer = 'imagery';
            baseLayers.imagery.addTo(map);

            function setBaseLayer(layerKey) {
                if (!baseLayers[layerKey] || activeBaseLayer === layerKey) {
                    return;
                }

                map.removeLayer(baseLayers[activeBaseLayer]);
                baseLayers[layerKey].addTo(map);
                activeBaseLayer = layerKey;

                layerLabel.textContent = layerLabels[layerKey] || layerKey;

                layerOptions.forEach(function (option) {
                    option.classList.toggle('is-active', option.dataset.layer === layerKey);
                });
            }

            function closeLayerMenu() {
                layerControl.classList.remove('is-open');
                layerToggle.setAttribute('aria-expanded', 'false');
            }

            layerToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const isOpen = layerControl.classList.toggle('is-open');
                layerToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            layerOptions.forEach(function (option) {
                option.addEventListener('click', function () {
                    setBaseLayer(option.dataset.layer);
                    closeLayerMenu();
                });
            });

            document.addEventListener('click', function (event) {
                if (!layerControl.contains(event.target)) {
                    closeLayerMenu();
                }
            });

            map.on('click', closeLayerMenu);

            const markers = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 52,
                spiderfyOnMaxZoom: true,
                iconCreateFunction: function (cluster) {
                    const count = cluster.getChildCount();
                    let size = 42;

                    if (count >= 100) {
                        size = 56;
                    } else if (count >= 20) {
                        size = 48;
                    }

                    return L.divIcon({
                        html: '<div><span>' + count + '</span></div>',
                        className: 'marker-cluster-cpcl' + (count >= 100 ? ' marker-cluster-large' : count >= 20 ? ' marker-cluster-medium' : ''),
                        iconSize: L.point(size, size),
                    });
                },
            });

            map.addLayer(markers);

            const cpclIcon = L.divIcon({
                className: 'cpcl-marker-icon',
                html: [
                    '<div class="cpcl-pin">',
                    '<div class="cpcl-pin-dot">',
                    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">',
                    '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>',
                    '</svg>',
                    '</div>',
                    '</div>',
                ].join(''),
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            function hideLoader() {
                loader.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(function () {
                    loader.classList.add('hidden');
                }, 300);
            }

            function escapeHtml(value) {
                return String(value ?? '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }

            function formatNumber(value) {
                return new Intl.NumberFormat('id-ID').format(value);
            }

            function showInfoPanel() {
                infoPanel.classList.remove('hidden');
                infoPanel.classList.add('flex', 'flex-col');
            }

            function resetInfoPanel() {
                infoTitle.textContent = 'Pilih titik pada peta';
                infoBody.innerHTML = '<p class="text-sm text-gray-500">Klik salah satu titik CPCL di peta untuk melihat detail data petani.</p>';
            }

            function renderInfoTable(rows) {
                if (!rows.length) {
                    infoBody.innerHTML = '<p class="text-sm text-gray-500">Data petani tidak tersedia.</p>';
                    return;
                }

                const tableRows = rows.map(function (row) {
                    return [
                        '<tr>',
                        '<th>' + escapeHtml(row.label) + '</th>',
                        '<td>' + escapeHtml(row.value) + '</td>',
                        '</tr>',
                    ].join('');
                }).join('');

                infoBody.innerHTML = '<table class="cpcl-info-table"><tbody>' + tableRows + '</tbody></table>';
            }

            function loadPetaniDetail(pointId) {
                const detailUrl = detailUrlTemplate.replace('__ID__', pointId);

                infoTitle.textContent = 'Memuat data...';
                infoBody.innerHTML = '<p class="text-sm text-gray-500">Memuat informasi petani...</p>';
                showInfoPanel();

                fetch(detailUrl)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('Gagal memuat detail petani.');
                        }

                        return response.json();
                    })
                    .then(function (detail) {
                        infoTitle.textContent = detail.title || 'Detail CPCL';
                        renderInfoTable(detail.rows || []);
                    })
                    .catch(function (error) {
                        console.error(error);
                        infoTitle.textContent = 'Gagal memuat data';
                        infoBody.innerHTML = '<p class="text-sm text-red-600">Informasi petani tidak dapat ditampilkan.</p>';
                    });
            }

            function fitMapToPoints(points) {
                const bounds = points.map(function (point) {
                    return [point.lat, point.lng];
                });

                if (bounds.length === 1) {
                    map.setView(bounds[0], 13);
                    return;
                }

                if (bounds.length > 1) {
                    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
                }
            }

            function renderMarkers(points) {
                markers.clearLayers();

                points.forEach(function (point) {
                    const marker = L.marker([point.lat, point.lng], { icon: cpclIcon });
                    marker.on('click', function () {
                        loadPetaniDetail(point.id);
                    });
                    markers.addLayer(marker);
                });

                if (totalCountEl) {
                    totalCountEl.textContent = formatNumber(points.length);
                }

                fitMapToPoints(points);

                setTimeout(function () {
                    map.invalidateSize();
                }, 100);
            }

            function populateKabupatenFilter(options) {
                const selectedValue = kabupatenFilter.value;
                kabupatenFilter.innerHTML = '<option value="">Semua Kabupaten/Kota</option>';

                options.forEach(function (option) {
                    const opt = document.createElement('option');
                    opt.value = option.code;
                    opt.textContent = option.name + ' (' + formatNumber(option.total) + ')';
                    kabupatenFilter.appendChild(opt);
                });

                kabupatenFilter.value = selectedValue;
            }

            function populateKomoditasFilter(options) {
                const selectedValue = komoditasFilter.value;
                komoditasFilter.innerHTML = '<option value="">Semua Komoditas</option>';

                options.forEach(function (option) {
                    const opt = document.createElement('option');
                    opt.value = option.id;
                    opt.textContent = option.name + ' (' + formatNumber(option.total) + ')';
                    komoditasFilter.appendChild(opt);
                });

                komoditasFilter.value = selectedValue;
            }

            function applyFilters() {
                const selectedKabupaten = kabupatenFilter.value;
                const selectedKomoditas = komoditasFilter.value;

                let filtered = allPoints;

                if (selectedKabupaten) {
                    filtered = filtered.filter(function (point) {
                        return point.kab_kota_code === selectedKabupaten;
                    });
                }

                if (selectedKomoditas) {
                    filtered = filtered.filter(function (point) {
                        return String(point.jenis_kumoditas_id) === selectedKomoditas;
                    });
                }

                renderMarkers(filtered);
            }

            kabupatenFilter.addEventListener('change', function () {
                resetInfoPanel();
                applyFilters();
            });

            komoditasFilter.addEventListener('change', function () {
                resetInfoPanel();
                applyFilters();
            });

            infoClose.addEventListener('click', function () {
                resetInfoPanel();
            });

            fetch(dataUrl)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Gagal memuat data titik CPCL.');
                    }

                    return response.json();
                })
                .then(function (payload) {
                    allPoints = payload.points || [];
                    kabupatenOptions = payload.kabupaten || [];
                    komoditasOptions = payload.komoditas || [];

                    populateKabupatenFilter(kabupatenOptions);
                    populateKomoditasFilter(komoditasOptions);
                    applyFilters();
                    hideLoader();
                })
                .catch(function (error) {
                    hideLoader();
                    console.error(error);
                    alert('Gagal memuat data sebaran CPCL. Silakan muat ulang halaman.');
                });
        })();
    </script>
@endpush
