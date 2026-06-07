import { useState } from 'react';
import { FiX, FiMap, FiPlus, FiSearch, FiMessageCircle, FiLogOut, FiDownload, FiUpload, FiMapPin, FiMoon, FiSun } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth/authService';
import { storageService } from '../../services/localStorage/storageService';
import { useThemeStore } from '../../stores/themeStore';
import { Button } from '../Common/Button';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  /** Opens the location selection modal */
  onOpenLocationModal?: () => void;
}

export const SideMenu = ({ isOpen, onClose, onOpenLocationModal }: SideMenuProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const location = useLocation();
  const [isExporting, setIsExporting] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    onClose();
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = storageService.exportData();
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', `lets-run-backup-${new Date().toISOString().split('T')[0]}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const success = storageService.importData(event.target.result);
        if (success) {
          alert('Dados importados com sucesso!');
          window.location.reload();
        } else {
          alert('Erro ao importar dados');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const navItems = [
    { to: '/map',          icon: <FiMap size={18} />,          label: 'Ver Mapa' },
    { to: '/create-event', icon: <FiPlus size={18} />,         label: 'Criar Evento' },
    { to: '/events',       icon: <FiSearch size={18} />,       label: 'Buscar Eventos' },
    { to: '/messages',     icon: <FiMessageCircle size={18} />, label: 'Mensagens' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 transform transition-all duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-60`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}
      >
        {/* Brand header */}
        <div className="p-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-lg shadow">
              🏃
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Let's Run</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Together</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg transition-colors btn-ghost"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="mx-4 mt-4 mb-2 p-3 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
            <div className="flex items-center gap-3">
              {user.avatar
                ? <img src={user.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" alt={user.name} />
                : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">{user.name.charAt(0).toUpperCase()}</div>
              }
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user.email}</p>
                {user.city && (
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#22c55e' }}>
                    <FiMapPin size={10} />{user.city}{user.state ? `, ${user.state}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                    : 'hover:bg-[var(--bg-subtle)]'
                }`}
                style={active ? {} : { color: 'var(--text-muted)' }}
              >
                <span className={active ? 'text-green-500' : ''}>{icon}</span>
                {label}
              </Link>
            );
          })}

          {/* Location */}
          <button
            onClick={() => { onOpenLocationModal?.(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-subtle)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiMapPin size={18} />
            Mudar Localização
          </button>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-1 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-subtle)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-3">
              {isDark ? <FiSun size={18} className="text-amber-400" /> : <FiMoon size={18} className="text-indigo-400" />}
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </span>
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                isDark ? 'bg-amber-400' : 'bg-indigo-400'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isDark ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-subtle)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiDownload size={18} /> Exportar Dados
          </button>
          <button
            onClick={handleImport}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-subtle)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiUpload size={18} /> Importar Dados
          </button>

          <div className="pt-1">
            <Button onClick={handleLogout} variant="danger" size="sm" className="w-full">
              <FiLogOut size={16} /> Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
