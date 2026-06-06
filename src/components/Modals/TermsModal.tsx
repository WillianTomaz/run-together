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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold">🏃 Let's Run Together</h2>
          <p className="text-green-100 mt-1">Encontre amigos para correr!</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Bem-vindo!</span> Essa plataforma ajuda você a encontrar
              pessoas para praticar esportes juntas no mesmo dia e horário.
            </p>

            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-blue-900 mb-2">📍 Como funciona:</p>
              <ul className="space-y-1 text-blue-800 text-xs">
                <li>✓ Veja pessoas e eventos próximas no mapa</li>
                <li>✓ Envie solicitações de amizade</li>
                <li>✓ Converse com amigos confirmados</li>
                <li>✓ Crie e siga eventos</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-3 rounded">
              <p className="font-semibold text-amber-900 mb-2">🔐 Privacidade:</p>
              <p className="text-amber-800">
                Sua localização é mostrada com imprecisão de ±1km para usuários não-amigos. Você controla quem vê sua
                localização precisa.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="font-semibold mb-2">📋 Termos de Uso:</p>
              <p className="text-xs">
                Ao usar essa plataforma, você concorda em:
              </p>
              <ul className="text-xs space-y-1 mt-2">
                <li>• Compartilhar sua localização aproximada</li>
                <li>• Ser respeitoso com outros usuários</li>
                <li>• Não compartilhar informações pessoais sensíveis no chat</li>
              </ul>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 pt-4 border-t">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer flex-1">
              Aceito os termos de uso e permito o acesso à minha localização
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <Button
            onClick={handleAccept}
            disabled={!accepted}
            size="lg"
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};
