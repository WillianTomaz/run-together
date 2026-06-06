import type { User } from '../../types/index';
import { storageService, STORAGE } from './storageService';

export const userService = {
  // Get current user
  getCurrentUser: (): User | null => {
    return storageService.getItem<User>(STORAGE.USER);
  },

  // Set current user
  setCurrentUser: (user: User): void => {
    storageService.setItem(STORAGE.USER, user);
  },

  // Get all users in map
  getAllUsers: (): User[] => {
    return storageService.getItem<User[]>(STORAGE.USERS, []) || [];
  },

  // Add or update user
  saveUser: (user: User): void => {
    const users = userService.getAllUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    storageService.setItem(STORAGE.USERS, users);
  },

  // Get user by ID
  getUserById: (userId: string): User | undefined => {
    return userService.getAllUsers().find((u) => u.id === userId);
  },

  // Remove user
  removeUser: (userId: string): void => {
    const users = userService.getAllUsers();
    storageService.setItem(STORAGE.USERS, users.filter((u) => u.id !== userId));
  },

  // Update user location
  updateUserLocation: (userId: string, latitude: number, longitude: number): void => {
    const user = userService.getUserById(userId);
    if (user) {
      user.latitude = latitude;
      user.longitude = longitude;
      user.lastUpdated = new Date();
      userService.saveUser(user);
    }
  },

  // Get users nearby (within distance)
  getUsersNearby: (latitude: number, longitude: number, radiusKm: number): User[] => {
    const users = userService.getAllUsers();
    return users.filter((user) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        user.latitude,
        user.longitude
      );
      return distance <= radiusKm;
    });
  },
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
