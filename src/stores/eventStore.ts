import { create } from 'zustand';
import type { Event } from '../types/index';

interface EventStore {
  events: Event[];
  selectedEvent: Event | null;
  
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  removeEvent: (eventId: string) => void;
  followEvent: (eventId: string, userId: string) => void;
  unfollowEvent: (eventId: string, userId: string) => void;
  setSelectedEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,

  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (eventId) => set((state) => ({
    events: state.events.filter((e) => e.id !== eventId),
  })),
  followEvent: (eventId, userId) => set((state) => ({
    events: state.events.map((e) =>
      e.id === eventId && !e.followers.includes(userId)
        ? { ...e, followers: [...e.followers, userId] }
        : e
    ),
  })),
  unfollowEvent: (eventId, userId) => set((state) => ({
    events: state.events.map((e) =>
      e.id === eventId
        ? { ...e, followers: e.followers.filter((f) => f !== userId) }
        : e
    ),
  })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
}));
