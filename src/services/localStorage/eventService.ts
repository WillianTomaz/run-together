import type { Event } from '../../types/index';
import { storageService, STORAGE } from './storageService';

export const eventService = {
  // Get all events
  getAllEvents: (): Event[] => {
    return storageService.getItem<Event[]>(STORAGE.EVENTS, []) || [];
  },

  // Create event
  createEvent: (event: Event): void => {
    const events = eventService.getAllEvents();
    events.push(event);
    storageService.setItem(STORAGE.EVENTS, events);
  },

  // Update event
  updateEvent: (eventId: string, updates: Partial<Event>): void => {
    const events = eventService.getAllEvents();
    const index = events.findIndex((e) => e.id === eventId);
    
    if (index >= 0) {
      events[index] = { ...events[index], ...updates };
      storageService.setItem(STORAGE.EVENTS, events);
    }
  },

  // Delete event
  deleteEvent: (eventId: string): void => {
    const events = eventService.getAllEvents();
    storageService.setItem(STORAGE.EVENTS, events.filter((e) => e.id !== eventId));
  },

  // Get event by ID
  getEventById: (eventId: string): Event | undefined => {
    return eventService.getAllEvents().find((e) => e.id === eventId);
  },

  // Follow event
  followEvent: (eventId: string, userId: string): void => {
    const event = eventService.getEventById(eventId);
    if (event && !event.followers.includes(userId)) {
      event.followers.push(userId);
      eventService.updateEvent(eventId, { followers: event.followers });
    }
  },

  // Unfollow event
  unfollowEvent: (eventId: string, userId: string): void => {
    const event = eventService.getEventById(eventId);
    if (event) {
      event.followers = event.followers.filter((f) => f !== userId);
      eventService.updateEvent(eventId, { followers: event.followers });
    }
  },

  // Get events nearby
  getEventsNearby: (latitude: number, longitude: number, radiusKm: number): Event[] => {
    const events = eventService.getAllEvents();
    return events.filter((event) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        event.latitude,
        event.longitude
      );
      return distance <= radiusKm;
    });
  },

  // Get user's events (created)
  getUserEvents: (userId: string): Event[] => {
    return eventService.getAllEvents().filter((e) => e.createdBy === userId);
  },

  // Get user's followed events
  getUserFollowedEvents: (userId: string): Event[] => {
    return eventService.getAllEvents().filter((e) => e.followers.includes(userId));
  },
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
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
