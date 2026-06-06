import NetlifyIdentity from 'netlify-identity-widget';
import type { User } from '../../types/index';
import { userService } from '../localStorage/userService';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  // Initialize auth
  init: (): Promise<void> => {
    return new Promise((resolve) => {
      NetlifyIdentity.init({
        APIUrl: import.meta.env.VITE_NETLIFY_IDENTITY_URL || 'https://yoursite.netlify.app/.netlify/identity',
      });
      resolve();
    });
  },

  // Login with Google
  login: async (): Promise<User | null> => {
    try {
      const user = await NetlifyIdentity.open('signup');
      
      if (user) {
        const appUser: User = {
          id: uuidv4(),
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email || 'User',
          avatar: user.user_metadata?.avatar_url,
          latitude: -23.5505, // Default to São Paulo
          longitude: -46.6333,
          sportType: 'running',
          lastUpdated: new Date(),
          createdAt: new Date(),
        };

        userService.setCurrentUser(appUser);
        return appUser;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    return null;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await NetlifyIdentity.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    const user = NetlifyIdentity.currentUser();
    return !!user;
  },

  // Get current user from Netlify
  getCurrentNetlifyUser: () => {
    return NetlifyIdentity.currentUser();
  },

  // Accept terms
  acceptTerms: (): void => {
    localStorage.setItem('lets_run_terms_accepted', JSON.stringify(true));
  },

  // Check if terms were accepted
  termsAccepted: (): boolean => {
    return JSON.parse(localStorage.getItem('lets_run_terms_accepted') || 'false');
  },
};
