import { create } from 'zustand';
import type { User } from '../types/index';

interface MapStore {
  users: User[];
  centerLat: number;
  centerLng: number;
  zoom: number;
  
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  users: [],
  centerLat: -23.5505,
  centerLng: -46.6333,
  zoom: 15,

  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (userId) => set((state) => ({
    users: state.users.filter((u) => u.id !== userId),
  })),
  setCenter: (lat, lng) => set({ centerLat: lat, centerLng: lng }),
  setZoom: (zoom) => set({ zoom }),
}));
