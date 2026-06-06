// Sport types
export type SportType = 'running' | 'cycling' | 'gym' | 'swimming';

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  latitude: number;
  longitude: number;
  sportType: SportType;
  lastUpdated: Date;
  createdAt: Date;
}

// Friend
export interface Friend {
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  acceptedAt?: Date;
}

// Event
export interface Event {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  sportType: SportType;
  dateTime: Date;
  createdBy: string;
  followers: string[];
  maxParticipants?: number;
  createdAt: Date;
}

// Message
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Chat
export interface Chat {
  id: string;
  type: 'p2p' | 'event';
  participantIds: string[];
  eventId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Auth Context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
