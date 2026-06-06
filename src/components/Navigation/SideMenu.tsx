import { useState } from 'react';
import { FiX, FiMap, FiPlus, FiSearch, FiMessageCircle, FiLogOut, FiDownload, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth/authService';
import { storageService } from '../../services/localStorage/storageService';
import { Button } from '../Common/Button';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-56 flex flex-col`}
      >
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center md:justify-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="md:hidden text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b bg-gray-50">
            <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/map"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiMap size={20} />
            <span>Ver Mapa</span>
          </Link>
          <Link
            to="/create-event"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiPlus size={20} />
            <span>Criar Evento</span>
          </Link>
          <Link
            to="/events"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiSearch size={20} />
            <span>Buscar Eventos</span>
          </Link>
          <Link
            to="/messages"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiMessageCircle size={20} />
            <span>Mensagens</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="border-t p-4 space-y-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiDownload size={18} />
            Exportar Dados
          </button>
          <button
            onClick={handleImport}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiUpload size={18} />
            Importar Dados
          </button>
          <Button
            onClick={handleLogout}
            variant="danger"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
          >
            <FiLogOut size={18} />
            Sair
          </Button>
        </div>
      </div>
    </>
  );
};
