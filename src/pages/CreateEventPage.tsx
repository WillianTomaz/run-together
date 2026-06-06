import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEventStore } from '../stores/eventStore';
import { Button } from '../components/Common/Button';
import { Card } from '../components/Common/Card';
import type { SportType } from '../types/index';
import { SPORTS } from '../constants/index';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { eventService } from '../services/localStorage/eventService';

interface FormData {
  title: string;
  description: string;
  sportType: SportType;
  dateTime: string;
  maxParticipants?: number;
}

export const CreateEventPage = () => {
  const user = useAuthStore((state) => state.user);
  const addEvent = useEventStore((state) => state.addEvent);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    sportType: 'running',
    dateTime: '',
    maxParticipants: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.title || !formData.dateTime) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      const newEvent = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        latitude: user.latitude,
        longitude: user.longitude,
        sportType: formData.sportType,
        dateTime: new Date(formData.dateTime),
        createdBy: user.id,
        followers: [user.id],
        maxParticipants: formData.maxParticipants,
        createdAt: new Date(),
      };

      eventService.createEvent(newEvent);
      addEvent(newEvent);
      
      alert('Evento criado com sucesso!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary font-semibold mb-6 hover:underline"
      >
        <FiArrowLeft size={20} />
        Voltar
      </button>

      <Card className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiPlus size={32} />
          Criar Evento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Evento *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Corrida no Parque Ibirapuera"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o evento..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Sport Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Esporte *
            </label>
            <select
              name="sportType"
              value={formData.sportType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {(Object.entries(SPORTS) as Array<[SportType, typeof SPORTS[SportType]]>).map(([key, sport]) => (
                <option key={key} value={key}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>

          {/* DateTime */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data e Hora *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Participantes Máximos (opcional)
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants || ''}
              onChange={handleChange}
              placeholder="Deixe em branco para ilimitado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            className="w-full mt-6"
          >
            Criar Evento
          </Button>
        </form>
      </Card>
    </div>
  );
};
