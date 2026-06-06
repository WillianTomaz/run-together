import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { useAuthStore } from '../stores/authStore';
import { useMapStore } from '../stores/mapStore';
import { useEventStore } from '../stores/eventStore';
import { SPORTS, MAP_CONFIG } from '../constants/index';

export const MapPage = () => {
  const user = useAuthStore((state) => state.user);
  const users = useMapStore((state) => state.users);
  const events = useEventStore((state) => state.events);
  const centerLat = useMapStore((state) => state.centerLat);
  const centerLng = useMapStore((state) => state.centerLng);
  const zoom = useMapStore((state) => state.zoom);

  if (!user) return null;

  const mapCenter: LatLngExpression = [centerLat, centerLng];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* User marker */}
        <Marker position={[user.latitude, user.longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{user.name}</p>
              <p>{SPORTS[user.sportType].label}</p>
            </div>
          </Popup>
        </Marker>

        {/* Other users */}
        {users.map((otherUser) => (
          <div key={otherUser.id}>
            <Circle
              center={[otherUser.latitude, otherUser.longitude]}
              radius={MAP_CONFIG.RADIUS_KM * 1000}
              pathOptions={{
                color: SPORTS[otherUser.sportType].color,
                opacity: 0.3,
              }}
            />
            <Marker position={[otherUser.latitude, otherUser.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{otherUser.name}</p>
                  <p>{SPORTS[otherUser.sportType].label}</p>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}

        {/* Events */}
        {events.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{event.title}</p>
                <p>{SPORTS[event.sportType].label}</p>
                <p className="text-xs text-gray-600">{new Date(event.dateTime).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
