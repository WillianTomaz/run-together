import { create } from 'zustand';
import type { Chat, Message } from '../types/index';

interface ChatStore {
  chats: Chat[];
  activeChat: Chat | null;
  
  setChats: (chats: Chat[]) => void;
  createChat: (chat: Chat) => void;
  addMessage: (chatId: string, message: Message) => void;
  setActiveChat: (chat: Chat | null) => void;
  getChatBetweenUsers: (userId1: string, userId2: string) => Chat | undefined;
  getEventChat: (eventId: string) => Chat | undefined;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,

  setChats: (chats) => set({ chats }),
  createChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map((c) =>
      c.id === chatId
        ? { ...c, messages: [...c.messages, message], updatedAt: new Date() }
        : c
    ),
  })),
  setActiveChat: (chat) => set({ activeChat: chat }),
  getChatBetweenUsers: (userId1, userId2) => {
    const state = get();
    return state.chats.find(
      (c) => c.type === 'p2p' &&
             c.participantIds.includes(userId1) &&
             c.participantIds.includes(userId2)
    );
  },
  getEventChat: (eventId) => {
    const state = get();
    return state.chats.find((c) => c.type === 'event' && c.eventId === eventId);
  },
  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter((c) => c.id !== chatId),
  })),
}));
