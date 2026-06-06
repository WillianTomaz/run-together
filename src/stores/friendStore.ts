import { create } from 'zustand';
import type { Friend } from '../types/index';

interface FriendStore {
  friends: Friend[];
  
  setFriends: (friends: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  updateFriendStatus: (userId: string, friendId: string, status: Friend['status']) => void;
  removeFriend: (userId: string, friendId: string) => void;
  getFriend: (userId: string, friendId: string) => Friend | undefined;
  getAcceptedFriends: (userId: string) => string[];
}

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],

  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  updateFriendStatus: (userId, friendId, status) => set((state) => ({
    friends: state.friends.map((f) =>
      (f.userId === userId && f.friendId === friendId) ||
      (f.userId === friendId && f.friendId === userId)
        ? { ...f, status, acceptedAt: status === 'accepted' ? new Date() : f.acceptedAt }
        : f
    ),
  })),
  removeFriend: (userId, friendId) => set((state) => ({
    friends: state.friends.filter(
      (f) => !((f.userId === userId && f.friendId === friendId) ||
               (f.userId === friendId && f.friendId === userId))
    ),
  })),
  getFriend: (userId, friendId) => {
    const state = get();
    return state.friends.find(
      (f) => (f.userId === userId && f.friendId === friendId) ||
             (f.userId === friendId && f.friendId === userId)
    );
  },
  getAcceptedFriends: (userId) => {
    const state = get();
    return state.friends
      .filter((f) => f.status === 'accepted')
      .map((f) => (f.userId === userId ? f.friendId : f.userId));
  },
}));
