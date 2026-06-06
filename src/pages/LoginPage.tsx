import { useState, useEffect } from 'react';
import { Button } from '../components/Common/Button';
import { TermsModal } from '../components/Modals/TermsModal';
import { authService } from '../services/auth/authService';
import { useAuthStore } from '../stores/authStore';
import { FiLogIn } from 'react-icons/fi';

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    // Check if terms were already accepted
    if (!authService.termsAccepted()) {
      setShowTerms(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.login();
      if (user) {
        setUser(user);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    authService.acceptTerms();
    setShowTerms(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center p-4">
      <TermsModal isOpen={showTerms} onAccept={handleAcceptTerms} />

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏃</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Let's Run Together</h1>
          <p className="text-gray-600">Encontre amigos para correr perto de você</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Localização</p>
              <p className="text-gray-600">Encontre pessoas próximas a você</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">👥</span>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Conecte-se</p>
              <p className="text-gray-600">Faça amigos para praticar esportes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">Chat</p>
              <p className="text-gray-600">Comunique-se facilmente</p>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          isLoading={isLoading}
          size="lg"
          className="w-full flex items-center justify-center gap-2 mb-4"
        >
          <FiLogIn size={20} />
          Login com Google
        </Button>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center">
          Ao continuar, você concorda com nossos termos de uso e política de privacidade
        </p>
      </div>
    </div>
  );
};
