import { MAP_CONFIG } from '../../constants/index';

// Add random imprecision to coordinates (±1km for non-friends)
export const addLocationImprecision = (
  latitude: number,
  longitude: number,
  radiusKm: number = MAP_CONFIG.RADIUS_KM
): { lat: number; lng: number } => {
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusKm;

  // Convert to radians
  const lat1 = latitude * (Math.PI / 180);
  const lon1 = longitude * (Math.PI / 180);

  // Earth's radius in km
  const R = 6371;

  // Calculate new coordinates
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(randomDistance / R) +
      Math.cos(lat1) * Math.sin(randomDistance / R) * Math.cos(randomAngle)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(randomAngle) * Math.sin(randomDistance / R) * Math.cos(lat1),
      Math.cos(randomDistance / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: lat2 * (180 / Math.PI),
    lng: lon2 * (180 / Math.PI),
  };
};

// Get user's precise location (requires browser Geolocation API)
export const getUserLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Watch user's location
export const watchUserLocation = (
  callback: (coords: GeolocationCoordinates) => void,
  errorCallback?: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported');
    return 0;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback(position.coords);
    },
    (error) => {
      errorCallback?.(error);
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5000,
    }
  );
};

// Stop watching location
export const stopWatchingLocation = (watchId: number): void => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
};
