import type { Friend } from '../../types/index';
import { storageService, STORAGE } from './storageService';

export const friendService = {
  // Get all friendships
  getAllFriends: (): Friend[] => {
    return storageService.getItem<Friend[]>(STORAGE.FRIENDS, []) || [];
  },

  // Add friend request
  addFriendRequest: (userId: string, friendId: string): void => {
    const friends = friendService.getAllFriends();
    
    // Check if already exists
    const exists = friends.some(
      (f) => (f.userId === userId && f.friendId === friendId) ||
             (f.userId === friendId && f.friendId === userId)
    );
    
    if (!exists) {
      friends.push({
        userId,
        friendId,
        status: 'pending',
        createdAt: new Date(),
      });
      storageService.setItem(STORAGE.FRIENDS, friends);
    }
  },

  // Accept friend request
  acceptFriendRequest: (userId: string, friendId: string): void => {
    const friends = friendService.getAllFriends();
    const friend = friends.find(
      (f) => (f.userId === userId && f.friendId === friendId) ||
             (f.userId === friendId && f.friendId === userId)
    );
    
    if (friend) {
      friend.status = 'accepted';
      friend.acceptedAt = new Date();
      storageService.setItem(STORAGE.FRIENDS, friends);
    }
  },

  // Reject/Remove friendship
  removeFriendship: (userId: string, friendId: string): void => {
    const friends = friendService.getAllFriends();
    storageService.setItem(
      STORAGE.FRIENDS,
      friends.filter(
        (f) => !((f.userId === userId && f.friendId === friendId) ||
                 (f.userId === friendId && f.friendId === userId))
      )
    );
  },

  // Get friendship status
  getFriendshipStatus: (userId: string, friendId: string): Friend | undefined => {
    const friends = friendService.getAllFriends();
    return friends.find(
      (f) => (f.userId === userId && f.friendId === friendId) ||
             (f.userId === friendId && f.friendId === userId)
    );
  },

  // Get accepted friends
  getAcceptedFriends: (userId: string): string[] => {
    const friends = friendService.getAllFriends();
    return friends
      .filter((f) => f.status === 'accepted')
      .map((f) => (f.userId === userId ? f.friendId : f.userId));
  },

  // Get pending requests
  getPendingRequests: (userId: string): Friend[] => {
    const friends = friendService.getAllFriends();
    return friends.filter(
      (f) => f.status === 'pending' && (f.userId === userId || f.friendId === userId)
    );
  },
};
