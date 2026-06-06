const STORAGE_KEYS = {
  USER: 'lets_run_user',
  USERS: 'lets_run_users',
  FRIENDS: 'lets_run_friends',
  EVENTS: 'lets_run_events',
  CHATS: 'lets_run_chats',
  TERMS_ACCEPTED: 'lets_run_terms_accepted',
};

class StorageService {
  // Getter/Setter genérico
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }

  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  // Export all data
  exportData(): string {
    const data = {
      user: this.getItem(STORAGE_KEYS.USER),
      users: this.getItem(STORAGE_KEYS.USERS),
      friends: this.getItem(STORAGE_KEYS.FRIENDS),
      events: this.getItem(STORAGE_KEYS.EVENTS),
      chats: this.getItem(STORAGE_KEYS.CHATS),
      termsAccepted: this.getItem(STORAGE_KEYS.TERMS_ACCEPTED),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.user) this.setItem(STORAGE_KEYS.USER, data.user);
      if (data.users) this.setItem(STORAGE_KEYS.USERS, data.users);
      if (data.friends) this.setItem(STORAGE_KEYS.FRIENDS, data.friends);
      if (data.events) this.setItem(STORAGE_KEYS.EVENTS, data.events);
      if (data.chats) this.setItem(STORAGE_KEYS.CHATS, data.chats);
      if (data.termsAccepted) this.setItem(STORAGE_KEYS.TERMS_ACCEPTED, data.termsAccepted);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
export const STORAGE = STORAGE_KEYS;
