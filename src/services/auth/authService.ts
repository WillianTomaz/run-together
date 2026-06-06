import NetlifyIdentity from 'netlify-identity-widget';
import type { User } from '../../types/index';
import { userService } from '../localStorage/userService';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  // Initialize auth
  init: (): Promise<void> => {
    return new Promise((resolve) => {
      // Get the URL from environment
      const apiUrl = import.meta.env.VITE_NETLIFY_IDENTITY_URL;
      
      console.log('Initializing Netlify Identity');
      console.log('APIUrl:', apiUrl);
      
      // Only initialize Netlify Identity if URL is configured
      if (apiUrl && apiUrl !== 'https://yoursite.netlify.app') {
        NetlifyIdentity.init({
          APIUrl: apiUrl,
        });
        
        // Listen for login events
        NetlifyIdentity.on('login', (user) => {
          console.log('User logged in:', user);
        });
      } else {
        console.warn('Netlify Identity URL not configured. Using mock auth mode.');
        console.warn('To enable real auth, set VITE_NETLIFY_IDENTITY_URL in .env.local');
      }
      
      resolve();
    });
  },

  // Login with Google
  login: async (): Promise<User | null> => {
    const apiUrl = import.meta.env.VITE_NETLIFY_IDENTITY_URL;
    
    // Mock auth for development (when URL not configured)
    if (!apiUrl || apiUrl === 'https://yoursite.netlify.app') {
      console.log('Using mock auth (development mode)');
      const mockUser: User = {
        id: uuidv4(),
        email: 'dev@example.com',
        name: 'Development User',
        avatar: undefined,
        latitude: -23.5505,
        longitude: -46.6333,
        sportType: 'running',
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      
      userService.setCurrentUser(mockUser);
      console.log('Mock user created:', mockUser);
      return mockUser;
    }

    // Real auth with Netlify Identity
    try {
      console.log('Opening Netlify Identity modal');
      
      // Open Netlify Identity modal
      await NetlifyIdentity.open('signup');
      
      // Get the current user after modal closes
      const currentUser = NetlifyIdentity.currentUser();
      
      console.log('Current user from Netlify:', currentUser);
      
      if (currentUser && currentUser.email) {
        const appUser: User = {
          id: uuidv4(),
          email: currentUser.email || '',
          name: currentUser.user_metadata?.full_name || currentUser.email || 'User',
          avatar: currentUser.user_metadata?.avatar_url,
          latitude: -23.5505,
          longitude: -46.6333,
          sportType: 'running',
          lastUpdated: new Date(),
          createdAt: new Date(),
        };

        userService.setCurrentUser(appUser);
        console.log('App user created:', appUser);
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
