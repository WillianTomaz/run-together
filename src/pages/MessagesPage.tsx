import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { FiMessageCircle, FiArrowRight, FiMap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const MessagesPage = () => {
  const user = useAuthStore((state) => state.user);
  const chats = useChatStore((state) => state.chats);
  const [userChats, setUserChats] = useState(
    chats.filter((c) => c.participantIds.includes(user?.id || ''))
  );

  useEffect(() => {
    if (user) setUserChats(chats.filter((c) => c.participantIds.includes(user.id)));
  }, [chats, user]);

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--bg-base)" }}>
      <div className="p-5 md:p-8 max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FiMessageCircle size={26} className="text-green-500" />
            Mensagens
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Converse com amigos e grupos de eventos
          </p>
        </div>

        {userChats.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-5xl mb-4">💬</p>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Nenhuma conversa ainda</p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Adicione amigos no mapa para começar a conversar
            </p>
            <Link to="/map">
              <button
                className="btn btn-primary btn-md inline-flex items-center gap-2"
              >
                <FiMap size={16} /> Ir para o Mapa
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userChats.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              return (
                <div
                  key={chat.id}
                  className="card p-4 flex items-center justify-between gap-3 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl shrink-0">
                      {chat.type === 'p2p' ? '👤' : '🚩'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        {chat.type === 'p2p' ? 'Chat Privado' : 'Chat do Evento'}
                      </p>
                      {lastMsg ? (
                        <p className="text-xs truncate max-w-xs" style={{ color: "var(--text-muted)" }}>
                          {lastMsg.content}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: "var(--text-faint)" }}>Sem mensagens ainda</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {chat.messages.length > 0 && (
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: "rgb(34 197 94 / .15)", color: "#16a34a" }}
                      >
                        {chat.messages.length}
                      </span>
                    )}
                    <FiArrowRight size={18} style={{ color: "var(--text-faint)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
