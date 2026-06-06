import { useEventStore } from '../stores/eventStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/Common/Card';
import { Button } from '../components/Common/Button';
import { SPORTS } from '../constants/index';
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const EventsPage = () => {
  const user = useAuthStore((state) => state.user);
  const events = useEventStore((state) => state.events);
  const followEvent = useEventStore((state) => state.followEvent);
  const unfollowEvent = useEventStore((state) => state.unfollowEvent);

  if (!user) return null;

  const userFollowedEvents = events.filter((e) => e.followers.includes(user.id));
  const otherEvents = events.filter((e) => !e.followers.includes(user.id));

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FiMapPin size={32} />
          Eventos
        </h1>
        <p className="text-gray-600">Busque e siga eventos perto de você</p>
      </div>

      {/* Followed Events */}
      {userFollowedEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Meus Eventos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userFollowedEvents.map((event) => (
              <Card key={event.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FiCalendar size={16} />
                      {new Date(event.dateTime).toLocaleString()}
                    </p>
                    <p>{SPORTS[event.sportType].label}</p>
                    <p className="font-semibold text-primary">{event.followers.length} pessoas</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => unfollowEvent(event.id, user.id)}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    Deixar Evento
                  </Button>
                  <Link
                    to={`/event/${event.id}/chat`}
                    className="block text-center text-sm text-primary font-semibold hover:underline"
                  >
                    Ver Chat
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Events */}
      {otherEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eventos Disponíveis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherEvents.map((event) => (
              <Card key={event.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FiCalendar size={16} />
                      {new Date(event.dateTime).toLocaleString()}
                    </p>
                    <p>{SPORTS[event.sportType].label}</p>
                    <p className="font-semibold text-primary">{event.followers.length} pessoas</p>
                  </div>
                </div>
                <Button
                  onClick={() => followEvent(event.id, user.id)}
                  variant="primary"
                  size="sm"
                  className="w-full mt-4"
                >
                  Seguir Evento
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum evento criado ainda</p>
            <Link
              to="/create-event"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Criar um evento
              <FiArrowRight />
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};
