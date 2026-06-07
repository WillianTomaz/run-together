import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

import { useAuthStore } from '../stores/authStore';
import { useMapStore } from '../stores/mapStore';
import { useEventStore } from '../stores/eventStore';
import { MAP_CONFIG } from '../constants/index';
import { buildCityClusters } from '../services/clustering/clusteringService';
import { CityClusterModal } from '../components/Modals/CityClusterModal';
import type { CityCluster } from '../services/clustering/clusteringService';

// ── Custom cluster icon factory ──────────────────────────────────────────────

function makeClusterIcon(userCount: number, eventCount: number): L.DivIcon {
  const total = userCount + eventCount;
  const size  = total >= 10 ? 52 : total >= 5 ? 44 : 36;

  const hasUsers  = userCount > 0;
  const hasEvents = eventCount > 0;
  const mixed     = hasUsers && hasEvents;

  const bg = mixed
    ? 'linear-gradient(135deg,#2563eb 50%,#16a34a 50%)'
    : hasEvents
      ? '#16a34a'
      : '#2563eb';

  const emoji = mixed ? '👥' : hasEvents ? '🚩' : '👥';

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      flex-direction:column;
      color:#fff;font-weight:700;
      font-size:${size < 44 ? 11 : 13}px;
      box-shadow:0 3px 10px rgba(0,0,0,.35);
      border:3px solid #fff;
      line-height:1;gap:1px;
      cursor:pointer;
    ">
      <span style="font-size:${size < 44 ? 13 : 16}px">${emoji}</span>
      <span>${total}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: '',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export const MapPage = () => {
  const user      = useAuthStore((s) => s.user);
  const users     = useMapStore((s) => s.users);
  const events    = useEventStore((s) => s.events);
  const centerLat = useMapStore((s) => s.centerLat);
  const centerLng = useMapStore((s) => s.centerLng);
  const zoom      = useMapStore((s) => s.zoom);

  const [activeCluster, setActiveCluster] = useState<CityCluster | null>(null);

  // Include current user in clustering even before they appear in the shared users list
  const allUsers = useMemo(() => {
    const withCity = users.filter((u) => Boolean(u.city));
    if (!user?.city) return withCity;
    const already = withCity.some((u) => u.id === user.id);
    return already ? withCity : [...withCity, user];
  }, [users, user]);

  const fullClusters = useMemo(
    () => buildCityClusters(allUsers, events),
    [allUsers, events],
  );

  if (!user) return null;

  const mapCenter: LatLngExpression = [centerLat, centerLng];

  return (
    <div className="relative w-full h-full">
      {/* Cluster detail modal */}
      {activeCluster && (
        <CityClusterModal
          cluster={activeCluster}
          currentUserId={user.id}
          onClose={() => setActiveCluster(null)}
        />
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoom ?? MAP_CONFIG.DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* City cluster markers */}
        {fullClusters.map((cluster) => (
          <Marker
            key={cluster.key}
            position={[cluster.latitude, cluster.longitude]}
            icon={makeClusterIcon(cluster.users.length, cluster.events.length)}
            eventHandlers={{ click: () => setActiveCluster(cluster) }}
          >
            <Popup>
              <div className="text-sm min-w-35">
                <p className="font-bold text-base">📍 {cluster.city}{cluster.state ? `, ${cluster.state}` : ''}</p>
                <p className="text-gray-600 mt-1">👥 {cluster.users.length} {cluster.users.length === 1 ? 'pessoa' : 'pessoas'}</p>
                <p className="text-gray-600">🚩 {cluster.events.length} {cluster.events.length === 1 ? 'evento' : 'eventos'}</p>
                <button
                  onClick={() => setActiveCluster(cluster)}
                  className="mt-2 w-full text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t text-xs text-gray-600 px-4 py-2 flex justify-between items-center z-999">
        <span>
          {user.city
            ? `📍 Sua cidade: ${user.city}${user.state ? `, ${user.state}` : ''}`
            : '📍 Localização não definida'}
        </span>
        <span className="text-gray-400">
          {fullClusters.length} {fullClusters.length === 1 ? 'cidade' : 'cidades'} no mapa
        </span>
      </div>
    </div>
  );
};
