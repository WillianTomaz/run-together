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
      console.log('Login result:', user);
      
      if (user) {
        console.log('Setting user:', user);
        setUser(user);
        setAuthenticated(true);
        // Force a small delay to ensure state updates
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.warn('No user returned from authService.login()');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-400/5 blur-2xl" />
      </div>

      <TermsModal isOpen={showTerms} onAccept={handleAcceptTerms} />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-500" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg mb-5 text-4xl">
                🏃
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Let's Run Together</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Encontre amigos para praticar esportes perto de você</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {[
                { icon: '📍', title: 'Localização por cidade', desc: 'Veja quem está na sua cidade pronto para sair' },
                { icon: '👥', title: 'Conecte-se', desc: 'Faça amigos e combine horários' },
                { icon: '💬', title: 'Chat integrado', desc: 'Converse com amigos e eventos' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <span className="text-2xl shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              isLoading={isLoading}
              size="lg"
              className="w-full"
            >
              <FiLogIn size={18} />
              Entrar com Google
            </Button>

            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 leading-relaxed">
              Ao continuar, você concorda com os termos de uso e política de privacidade
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Let's Run Together &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
