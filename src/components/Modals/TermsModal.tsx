import { useState } from 'react';
import { Button } from '../Common/Button';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const TermsModal = ({ isOpen, onAccept }: TermsModalProps) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏃</span>
            <div>
              <h2 className="text-xl font-bold">Bem-vindo ao Let's Run!</h2>
              <p className="text-green-100 text-sm mt-0.5">Encontre parceiros para praticar esportes</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📍', text: 'Localize parceiros pela sua cidade' },
              { icon: '🤝', text: 'Envie solicitações de amizade' },
              { icon: '💬', text: 'Converse com amigos confirmados' },
              { icon: '🚩', text: 'Crie e participe de eventos' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
                <span className="text-xl shrink-0">{icon}</span>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 border-l-4 border-amber-400" style={{ background: 'var(--bg-muted)' }}>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>🔐 Sua privacidade</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Sua localização é mostrada por cidade, sem precisão GPS para desconhecidos. Apenas amigos confirmados têm acesso ao chat privado.
            </p>
          </div>

          <div className="text-xs space-y-1.5" style={{ color: 'var(--text-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>📋 Ao continuar você concorda em:</p>
            {['Compartilhar sua localização por cidade', 'Ser respeitoso com outros usuários', 'Não compartilhar dados pessoais no chat'].map(t => (
              <p key={t} className="flex items-center gap-2"><span className="text-green-500">✓</span>{t}</p>
            ))}
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 pt-3 cursor-pointer" style={{ borderTop: '1px solid var(--border)' }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded accent-green-500 cursor-pointer shrink-0"
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Li e aceito os termos de uso
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-5 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
          <Button onClick={handleAccept} disabled={!accepted} size="lg" className="w-full">
            Entrar na plataforma
          </Button>
        </div>
      </div>
    </div>
  );
};
