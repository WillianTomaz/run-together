import type { Chat, Message } from '../../types/index';
import { storageService, STORAGE } from './storageService';
import { v4 as uuidv4 } from 'uuid';

export const chatService = {
  // Get all chats
  getAllChats: (): Chat[] => {
    return storageService.getItem<Chat[]>(STORAGE.CHATS, []) || [];
  },

  // Create P2P chat
  createP2PChat: (userId1: string, userId2: string): Chat => {
    const chats = chatService.getAllChats();
    let chat = chats.find(
      (c) => c.type === 'p2p' &&
             c.participantIds.includes(userId1) &&
             c.participantIds.includes(userId2)
    );

    if (!chat) {
      chat = {
        id: uuidv4(),
        type: 'p2p',
        participantIds: [userId1, userId2],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      chats.push(chat);
      storageService.setItem(STORAGE.CHATS, chats);
    }

    return chat;
  },

  // Create event chat
  createEventChat: (eventId: string, initialFollowers: string[]): Chat => {
    const chats = chatService.getAllChats();
    let chat = chats.find((c) => c.type === 'event' && c.eventId === eventId);

    if (!chat) {
      chat = {
        id: uuidv4(),
        type: 'event',
        eventId,
        participantIds: initialFollowers,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      chats.push(chat);
      storageService.setItem(STORAGE.CHATS, chats);
    }

    return chat;
  },

  // Add message
  addMessage: (chatId: string, senderId: string, content: string): Message => {
    const chats = chatService.getAllChats();
    const chat = chats.find((c) => c.id === chatId);

    if (!chat) {
      throw new Error('Chat not found');
    }

    const message: Message = {
      id: uuidv4(),
      senderId,
      content,
      timestamp: new Date(),
      read: false,
    };

    chat.messages.push(message);
    chat.updatedAt = new Date();
    storageService.setItem(STORAGE.CHATS, chats);

    return message;
  },

  // Get chat by ID
  getChatById: (chatId: string): Chat | undefined => {
    return chatService.getAllChats().find((c) => c.id === chatId);
  },

  // Get P2P chat between users
  getP2PChat: (userId1: string, userId2: string): Chat | undefined => {
    return chatService.getAllChats().find(
      (c) => c.type === 'p2p' &&
             c.participantIds.includes(userId1) &&
             c.participantIds.includes(userId2)
    );
  },

  // Get event chat
  getEventChat: (eventId: string): Chat | undefined => {
    return chatService.getAllChats().find((c) => c.type === 'event' && c.eventId === eventId);
  },

  // Get user's chats
  getUserChats: (userId: string): Chat[] => {
    return chatService.getAllChats().filter((c) => c.participantIds.includes(userId));
  },

  // Add participant to event chat
  addParticipantToEventChat: (eventId: string, userId: string): void => {
    const chats = chatService.getAllChats();
    const chat = chats.find((c) => c.type === 'event' && c.eventId === eventId);

    if (chat && !chat.participantIds.includes(userId)) {
      chat.participantIds.push(userId);
      storageService.setItem(STORAGE.CHATS, chats);
    }
  },

  // Remove participant from event chat
  removeParticipantFromEventChat: (eventId: string, userId: string): void => {
    const chats = chatService.getAllChats();
    const chat = chats.find((c) => c.type === 'event' && c.eventId === eventId);

    if (chat) {
      chat.participantIds = chat.participantIds.filter((p) => p !== userId);
      storageService.setItem(STORAGE.CHATS, chats);
    }
  },

  // Delete chat
  deleteChat: (chatId: string): void => {
    const chats = chatService.getAllChats();
    storageService.setItem(STORAGE.CHATS, chats.filter((c) => c.id !== chatId));
  },
};
