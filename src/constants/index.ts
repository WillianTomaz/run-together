// Sport icons and labels
export const SPORTS = {
  running: {
    label: '🏃 Corrida',
    icon: 'running',
    color: '#ef4444',
  },
  cycling: {
    label: '🚴 Ciclismo',
    icon: 'bike',
    color: '#f59e0b',
  },
  gym: {
    label: '💪 Academia',
    icon: 'dumbbell',
    color: '#8b5cf6',
  },
  swimming: {
    label: '🏊 Natação',
    icon: 'droplet',
    color: '#06b6d4',
  },
};

// Map constants
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 12,
  MAX_ZOOM: 18,
  RADIUS_KM: 1, // Default radius for non-friends
  FRIEND_RADIUS_KM: 0.1, // More precise for friends
  CENTER_LAT: -23.5505, // São Paulo default
  CENTER_LNG: -46.6333,
};

// Auth
export const AUTH_MESSAGES = {
  WELCOME: 'Bem-vindo ao Let\'s Run Together!',
  PERMISSION_DENIED: 'Você precisa permitir o acesso à localização para usar o app',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
};
