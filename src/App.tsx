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
import { LocationSelectionModal } from './components/Modals/LocationSelectionModal';

import type { CityLocation } from './services/location/geocodingService';
import type { User, SportType } from './types/index';
import { v4 as uuidv4 } from 'uuid';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the user still needs to pick a city */
const needsLocation = (u: User | null): boolean => !u?.city;

// ── Component ─────────────────────────────────────────────────────────────────

function AppContent() {
  const user             = useAuthStore((s) => s.user);
  const setUser          = useAuthStore((s) => s.setUser);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setUsers         = useMapStore((s) => s.setUsers);
  const setCenter        = useMapStore((s) => s.setCenter);
  const setZoom          = useMapStore((s) => s.setZoom);

  const [isSideMenuOpen, setIsSideMenuOpen]       = useState(false);
  const [isInitializing, setIsInitializing]       = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // ── Initialization ────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        await authService.init();

        const saved = userService.getCurrentUser();
        if (saved) {
          setUser(saved);
          setAuthenticated(true);
          if (saved.latitude && saved.longitude) {
            setCenter(saved.latitude, saved.longitude);
            setZoom(12);
          }
          if (needsLocation(saved)) setShowLocationModal(true);
        }

        setUsers(userService.getAllUsers());

        // ── Netlify Identity login callback ──────────────────────────────────
        NetlifyIdentity.on('login', (nlUser) => {
          const email = (nlUser as { email?: string })?.email ?? '';
          if (!email) return;

          const existing = userService.getCurrentUser();
          if (existing && existing.email === email) {
            setUser(existing);
            setAuthenticated(true);
            if (needsLocation(existing)) setShowLocationModal(true);
            return;
          }

          const meta = (nlUser as { user_metadata?: { full_name?: string; avatar_url?: string } })?.user_metadata;

          const appUser: User = {
            id: uuidv4(),
            email,
            name: meta?.full_name ?? email,
            avatar: meta?.avatar_url,
            latitude: 0,
            longitude: 0,
            city: '',
            state: '',
            sportType: 'running',
            lastUpdated: new Date(),
            createdAt: new Date(),
          };

          userService.setCurrentUser(appUser);
          setUser(appUser);
          setAuthenticated(true);
          setShowLocationModal(true);
        });
      } catch (err) {
        console.error('Error initializing app:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [setUser, setAuthenticated, setUsers, setCenter, setZoom]);

  // ── Location confirmed ────────────────────────────────────────────────────
  const handleLocationConfirmed = (city: CityLocation, sport: SportType) => {
    if (!city.name) {
      setShowLocationModal(false);
      return;
    }

    const updated: User = {
      ...(user!),
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      state: city.state,
      sportType: sport,
      lastUpdated: new Date(),
    };

    userService.setCurrentUser(updated);
    userService.saveUser(updated);
    setUser(updated);
    setCenter(city.latitude, city.longitude);
    setZoom(12);
    setUsers(userService.getAllUsers());
    setShowLocationModal(false);
  };

  // ── Render guards ─────────────────────────────────────────────────────────

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🏃</div>
          <p className="text-white text-2xl font-bold tracking-tight">Let's Run Together</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-300 text-sm">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-base)' }}>
      <LocationSelectionModal
        isOpen={showLocationModal}
        onConfirm={handleLocationConfirmed}
        initialCity={user.city}
        initialSport={user.sportType}
        required={needsLocation(user)}
      />

      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onOpenLocationModal={() => setShowLocationModal(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="md:hidden px-4 py-3 flex items-center justify-between shrink-0"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm shadow">
              🏃
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Let's Run</span>
          </div>
          <Button variant="ghost" onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} className="w-9 h-9 rounded-xl p-0">
            <FiMenu size={20} />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/map"          element={<MapPage />} />
            <Route path="/events"       element={<EventsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/messages"     element={<MessagesPage />} />
            <Route path="/"             element={<Navigate to="/map" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppContent;
