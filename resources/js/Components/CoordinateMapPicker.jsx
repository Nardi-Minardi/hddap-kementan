import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Button, Input, Spin, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const { Text } = Typography;

const DEFAULT_CENTER = [-2.548926, 118.014863];
const DEFAULT_ZOOM = 5;
const MARKER_ZOOM = 14;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function parseCoordinate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsed = typeof value === 'number'
        ? value
        : parseFloat(String(value).trim().replace(',', '.'));

    return Number.isFinite(parsed) ? parsed : null;
}

function roundCoordinate(value) {
    return Math.round(value * 1_000_000) / 1_000_000;
}

export default function CoordinateMapPicker({ latitude, longitude, onChange }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const hasCenteredRef = useRef(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const getParsedCoordinates = () => ({
        lat: parseCoordinate(latitude),
        lng: parseCoordinate(longitude),
    });

    const syncMarker = (lat, lng, shouldCenter = false) => {
        const map = mapRef.current;

        if (!map || lat === null || lng === null) {
            return;
        }

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
        } else {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (event) => {
                const { lat: nextLat, lng: nextLng } = event.target.getLatLng();
                onChange(roundCoordinate(nextLat), roundCoordinate(nextLng));
            });
        }

        if (shouldCenter) {
            map.setView([lat, lng], MARKER_ZOOM, { animate: hasCenteredRef.current });
            hasCenteredRef.current = true;
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return undefined;
        }

        const { lat, lng } = getParsedCoordinates();
        const initialLat = lat ?? DEFAULT_CENTER[0];
        const initialLng = lng ?? DEFAULT_CENTER[1];
        const initialZoom = lat !== null && lng !== null ? MARKER_ZOOM : DEFAULT_ZOOM;

        const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom: initialZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        map.on('click', (event) => {
            const nextLat = roundCoordinate(event.latlng.lat);
            const nextLng = roundCoordinate(event.latlng.lng);
            syncMarker(nextLat, nextLng, false);
            onChange(nextLat, nextLng);
        });

        mapRef.current = map;

        if (lat !== null && lng !== null) {
            syncMarker(lat, lng, true);
        }

        const resizeTimer = window.setTimeout(() => {
            map.invalidateSize();

            if (lat !== null && lng !== null) {
                syncMarker(lat, lng, true);
            }
        }, 150);

        return () => {
            window.clearTimeout(resizeTimer);
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
            hasCenteredRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const { lat, lng } = getParsedCoordinates();

        if (lat !== null && lng !== null) {
            const shouldCenter = !hasCenteredRef.current;
            syncMarker(lat, lng, shouldCenter);
            return;
        }

        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }

        hasCenteredRef.current = false;
    }, [latitude, longitude]);

    const handleSearch = async () => {
        const query = searchQuery.trim();

        if (!query) {
            return;
        }

        setSearching(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=${encodeURIComponent(query)}`,
                { headers: { Accept: 'application/json' } },
            );

            if (!response.ok) {
                return;
            }

            const results = await response.json();

            if (!results.length) {
                return;
            }

            const nextLat = roundCoordinate(parseFloat(results[0].lat));
            const nextLng = roundCoordinate(parseFloat(results[0].lon));
            onChange(nextLat, nextLng);
            syncMarker(nextLat, nextLng, true);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex gap-2">
                <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onPressEnter={handleSearch}
                    placeholder="Cari lokasi..."
                    size="large"
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    size="large"
                    loading={searching}
                    onClick={handleSearch}
                    className="!border-emerald-500 !bg-emerald-500 hover:!bg-emerald-600"
                >
                    Cari
                </Button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gray-200">
                <div ref={mapContainerRef} className="h-[360px] w-full" />
                {searching && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <Spin />
                    </div>
                )}
            </div>

            <Text type="secondary" className="text-xs">
                Klik pada peta untuk menambahkan penanda atau seret penanda untuk mengubah posisi.
            </Text>
        </div>
    );
}
