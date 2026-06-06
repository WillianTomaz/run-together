import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { Card } from '../components/Common/Card';
import { FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const MessagesPage = () => {
  const user = useAuthStore((state) => state.user);
  const chats = useChatStore((state) => state.chats);
  const [userChats, setUserChats] = useState(chats.filter((c) => c.participantIds.includes(user?.id || '')));

  useEffect(() => {
    if (user) {
      setUserChats(chats.filter((c) => c.participantIds.includes(user.id)));
    }
  }, [chats, user]);

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiMessageCircle size={32} />
        Mensagens
      </h1>

      {userChats.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma conversa ainda</p>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Ir para o mapa
              <FiArrowRight />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userChats.map((chat) => (
            <Card key={chat.id} className="flex items-center justify-between p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div>
                <p className="font-semibold text-gray-900">
                  {chat.type === 'p2p' ? 'Chat Privado' : 'Chat do Evento'}
                </p>
                <p className="text-sm text-gray-600">{chat.messages.length} mensagens</p>
              </div>
              <FiArrowRight size={20} className="text-gray-400" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
