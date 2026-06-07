import { useState } from 'react';
import { FiX, FiUsers, FiFlag } from 'react-icons/fi';
import type { CityCluster } from '../../services/clustering/clusteringService';
import { SPORTS } from '../../constants/index';

interface Props {
  cluster: CityCluster | null;
  currentUserId: string;
  onClose: () => void;
}

type Tab = 'people' | 'events';

export const CityClusterModal = ({ cluster, currentUserId, onClose }: Props) => {
  const [tab, setTab] = useState<Tab>('people');

  if (!cluster) return null;

  const total = cluster.users.length + cluster.events.length;

  return (
    <div className="modal-backdrop items-end sm:items-center">
      <div
        className="modal-panel w-full sm:max-w-lg"
        style={{ borderRadius: '1.5rem 1.5rem 0 0' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 flex-wrap">
              📍 {cluster.city}
              {cluster.state && <span className="text-base font-normal opacity-75">({cluster.state})</span>}
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              {total} {total === 1 ? 'ponto' : 'pontos'} no mapa
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors shrink-0 ml-3"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          {([
            { id: 'people' as Tab, icon: <FiUsers size={15} />, label: 'Pessoas', count: cluster.users.length },
            { id: 'events' as Tab, icon: <FiFlag size={15} />,  label: 'Eventos', count: cluster.events.length },
          ] as const).map(({ id, icon, label, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors"
              style={{
                borderBottom: tab === id ? '2px solid #2563eb' : '2px solid transparent',
                color: tab === id ? '#2563eb' : 'var(--text-muted)',
              }}
            >
              {icon}
              {label}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: tab === id ? '#2563eb22' : 'var(--bg-subtle)', color: tab === id ? '#2563eb' : 'var(--text-muted)' }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">

          {tab === 'people' && (
            <>
              {cluster.users.length === 0
                ? <EmptyState emoji="🏙️" text="Nenhuma pessoa nesta cidade ainda." />
                : cluster.users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
                  >
                    <div className="relative shrink-0">
                      {u.avatar
                        ? <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                        : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )
                      }
                      <span className="absolute -bottom-1 -right-1 text-sm leading-none">{SPORTS[u.sportType].label.split(' ')[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {u.name}
                        {u.id === currentUserId && <span className="ml-1.5 text-xs text-green-600 font-normal">(você)</span>}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{SPORTS[u.sportType].label}</p>
                    </div>
                  </div>
                ))
              }
            </>
          )}

          {tab === 'events' && (
            <>
              {cluster.events.length === 0
                ? <EmptyState emoji="🚩" text="Nenhum evento nesta cidade ainda." />
                : cluster.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl space-y-2"
                    style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{ev.title}</h3>
                      <span
                        className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full text-white"
                        style={{ background: SPORTS[ev.sportType].color }}
                      >
                        {SPORTS[ev.sportType].label.split(' ')[0]}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{ev.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-faint)' }}>
                      <span>📅 {new Date(ev.dateTime).toLocaleDateString('pt-BR')}</span>
                      <span>🕐 {new Date(ev.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>👥 {ev.followers.length}</span>
                    </div>
                  </div>
                ))
              }
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-muted)' }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors btn btn-ghost"
            style={{ border: '1px solid var(--border)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ emoji, text }: { emoji: string; text: string }) => (
  <div className="text-center py-12" style={{ color: 'var(--text-faint)' }}>
    <p className="text-4xl mb-2">{emoji}</p>
    <p className="text-sm">{text}</p>
  </div>
);
