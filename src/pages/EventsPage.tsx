import { useEventStore } from '../stores/eventStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Common/Button';
import { SPORTS } from '../constants/index';
import { FiCalendar, FiMapPin, FiArrowRight, FiUsers, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const EventsPage = () => {
  const user = useAuthStore((state) => state.user);
  const events = useEventStore((state) => state.events);
  const followEvent = useEventStore((state) => state.followEvent);
  const unfollowEvent = useEventStore((state) => state.unfollowEvent);

  if (!user) return null;

  const mine = events.filter((e) => e.followers.includes(user.id));
  const others = events.filter((e) => !e.followers.includes(user.id));

  const EventCard = ({ event, following }: { event: typeof events[0]; following: boolean }) => (
    <div className="card p-5 flex flex-col justify-between gap-4 hover:shadow-lg transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--text-primary)' }}>{event.title}</h3>
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ background: SPORTS[event.sportType].color }}
          >
            {SPORTS[event.sportType].label.split(' ')[0]}
          </span>
        </div>

        {event.description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{event.description}</p>
        )}

        <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p className="flex items-center gap-1.5">
            <FiCalendar size={13} />
            {new Date(event.dateTime).toLocaleString("pt-BR")}
          </p>
          <p className="flex items-center gap-1.5">
            <FiUsers size={13} />
            {event.followers.length} {event.followers.length === 1 ? "participante" : "participantes"}
          </p>
        </div>
      </div>

      <Button
        onClick={() => following ? unfollowEvent(event.id, user.id) : followEvent(event.id, user.id)}
        variant={following ? "ghost" : "primary"}
        size="sm"
        className="w-full"
        style={following ? { border: "1px solid var(--border)" } : {}}
      >
        {following ? "Deixar Evento" : "Participar"}
      </Button>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--bg-base)" }}>
      <div className="p-5 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FiMapPin size={26} className="text-green-500" /> Eventos
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Busque e participe de eventos</p>
          </div>
          <Link to="/create-event">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5">
              <FiPlusCircle size={16} /> Criar
            </Button>
          </Link>
        </div>

        {/* My Events */}
        {mine.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Meus Eventos <span className="ml-1 text-xs font-normal" style={{ color: "var(--text-faint)" }}>({mine.length})</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {mine.map((e) => <EventCard key={e.id} event={e} following={true} />)}
            </div>
          </section>
        )}

        {/* Available */}
        {others.length > 0 && (
          <section>
            <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Disponíveis <span className="ml-1 text-xs font-normal" style={{ color: "var(--text-faint)" }}>({others.length})</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {others.map((e) => <EventCard key={e.id} event={e} following={false} />)}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-5xl mb-4">🚩</p>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Nenhum evento criado</p>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Seja o primeiro a criar um evento na sua cidade!</p>
            <Link to="/create-event">
              <Button variant="primary" className="inline-flex items-center gap-2">
                Criar Evento <FiArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
