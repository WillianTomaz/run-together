import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import NetlifyIdentity from 'netlify-identity-widget';
import { useAuthStore } from './stores/authStore';
import { useMapStore } from './stores/mapStore';
import { authService } from './services/auth/authService';
import { userService } from './services/localStorage/userService';
import { LoginPage } from './pages/LoginPage';
import { MapPage } from './pages/MapPage';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { MessagesPage } from './pages/MessagesPage';
import { SideMenu } from './components/Navigation/SideMenu';
import { Button } from './components/Common/Button';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './types/index';

function AppContent() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUsers = useMapStore((state) => state.setUsers);
  
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auth
        await authService.init();
        
        // Check if user was already saved
        const savedUser = userService.getCurrentUser();
        if (savedUser) {
          setUser(savedUser);
          setAuthenticated(true);
        }
        
        // Load all users
        const allUsers = userService.getAllUsers();
        setUsers(allUsers);

        // Setup Netlify Identity listeners
        NetlifyIdentity.on('login', (netlifyUser: any) => {
          console.log('Netlify Identity login event:', netlifyUser);
          if (netlifyUser && netlifyUser.email) {
            const appUser: User = {
              id: uuidv4(),
              email: netlifyUser.email || '',
              name: netlifyUser.user_metadata?.full_name || netlifyUser.email || 'User',
              avatar: netlifyUser.user_metadata?.avatar_url,
              latitude: -23.5505,
              longitude: -46.6333,
              sportType: 'running',
              lastUpdated: new Date(),
              createdAt: new Date(),
            };
            userService.setCurrentUser(appUser);
            setUser(appUser);
            setAuthenticated(true);
          }
        });
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [setUser, setAuthenticated, setUsers]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary to-blue-600">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏃</div>
          <p className="text-white text-xl">Let's Run Together</p>
          <p className="text-green-100 text-sm mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow md:hidden p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">🏃 Let's Run</h1>
          <Button
            variant="ghost"
            onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            className="p-0 w-10 h-10"
          >
            <FiMenu size={24} />
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/map" element={<MapPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/" element={<Navigate to="/map" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppContent;
