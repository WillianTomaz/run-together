import type { User, Event } from '../../types/index';

export interface CityCluster {
  /** Unique key: "CityName|StateCode" */
  key: string;
  city: string;
  state: string;
  /** Average lat of all users in this cluster */
  latitude: number;
  /** Average lng of all users in this cluster */
  longitude: number;
  users: User[];
  events: Event[];
}

/**
 * Groups users and events into city-level clusters.
 * Users are grouped by city + state.
 * Events without a city property are matched to the nearest existing user cluster.
 */
export const buildCityClusters = (users: User[], events: Event[]): CityCluster[] => {
  const map = new Map<string, CityCluster>();

  // ── Users ──────────────────────────────────────────────────────────────────
  for (const u of users) {
    if (!u.city) continue;
    const key = `${u.city}|${u.state ?? ''}`;
    if (!map.has(key)) {
      map.set(key, { key, city: u.city, state: u.state ?? '', latitude: u.latitude, longitude: u.longitude, users: [], events: [] });
    }
    const cluster = map.get(key)!;
    cluster.users.push(u);

    // Keep coordinates as centroid of cluster users
    const lat = cluster.users.reduce((s, x) => s + x.latitude, 0) / cluster.users.length;
    const lng = cluster.users.reduce((s, x) => s + x.longitude, 0) / cluster.users.length;
    cluster.latitude = lat;
    cluster.longitude = lng;
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  for (const ev of events) {
    // Events may carry a city field (future-proof)
    const evCity = (ev as Event & { city?: string; state?: string }).city;
    const evState = (ev as Event & { city?: string; state?: string }).state;
    let key: string | null = null;

    if (evCity) {
      key = `${evCity}|${evState ?? ''}`;
      // Create a cluster for the event if no users are there yet
      if (!map.has(key)) {
        map.set(key, { key, city: evCity, state: evState ?? '', latitude: ev.latitude, longitude: ev.longitude, users: [], events: [] });
      }
    } else {
      // Match by proximity: find the nearest user cluster within ~50 km
      key = findNearestClusterKey(ev.latitude, ev.longitude, map);
    }

    if (key && map.has(key)) {
      map.get(key)!.events.push(ev);
    }
  }

  return Array.from(map.values())
    .filter((c) => c.users.length > 0 || c.events.length > 0)
    .sort((a, b) => (b.users.length + b.events.length) - (a.users.length + a.events.length));
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function findNearestClusterKey(lat: number, lng: number, map: Map<string, CityCluster>): string | null {
  let bestKey: string | null = null;
  let bestDist = Infinity;

  map.forEach((cluster, key) => {
    const d = haversineKm(lat, lng, cluster.latitude, cluster.longitude);
    if (d < bestDist && d < 50) {
      bestDist = d;
      bestKey = key;
    }
  });

  return bestKey;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
