import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useEventStore } from '../stores/eventStore';
import { Button } from '../components/Common/Button';
import type { SportType } from '../types/index';
import { SPORTS } from '../constants/index';
import { FiArrowLeft, FiCalendar, FiFileText, FiUsers } from 'react-icons/fi';
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

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    sportType: 'running',
    dateTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === 'maxParticipants' ? (value ? parseInt(value) : undefined) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.dateTime) return;
    setIsSubmitting(true);
    try {
      const ev = {
        id: uuidv4(),
        title: form.title,
        description: form.description,
        latitude: user.latitude,
        longitude: user.longitude,
        sportType: form.sportType,
        dateTime: new Date(form.dateTime),
        createdBy: user.id,
        followers: [user.id],
        maxParticipants: form.maxParticipants,
        createdAt: new Date(),
      };
      eventService.createEvent(ev);
      addEvent(ev);
      navigate('/events');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const inputClass = "input";
  const labelClass = "label";

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--bg-base)" }}>
      <div className="p-5 md:p-8 max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <FiArrowLeft size={18} />
          Voltar
        </button>

        <div className="card p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Criar Evento</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Reúna pessoas para praticar esportes na sua cidade
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><FiFileText size={13} /> Título *</span>
              </label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="Ex: Corrida no Parque Ibirapuera"
                className={inputClass} required
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="Descreva o evento, ponto de encontro, ritmo esperado..."
                rows={4} className={inputClass}
              />
            </div>

            {/* Sport */}
            <div>
              <label className={labelClass}>Esporte *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(SPORTS) as SportType[]).map((key) => {
                  const s = SPORTS[key];
                  const active = form.sportType === key;
                  return (
                    <button
                      key={key} type="button" onClick={() => setForm((p) => ({ ...p, sportType: key }))}
                      className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        border: `2px solid ${active ? s.color : "var(--border)"}`,
                        background: active ? `${s.color}18` : "var(--bg-card)",
                        color: active ? s.color : "var(--text-muted)",
                      }}
                    >
                      <span className="text-2xl">{s.label.split(' ')[0]}</span>
                      <span>{s.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DateTime */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><FiCalendar size={13} /> Data e Hora *</span>
              </label>
              <input
                type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange}
                className={inputClass} required
              />
            </div>

            {/* Max participants */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5"><FiUsers size={13} /> Máximo de Participantes</span>
              </label>
              <input
                type="number" name="maxParticipants"
                value={form.maxParticipants ?? ""}
                onChange={handleChange}
                placeholder="Sem limite"
                min={2} className={inputClass}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button type="submit" isLoading={isSubmitting} size="lg" className="flex-1">
                Criar Evento
              </Button>
              <Button
                type="button" variant="ghost" size="lg"
                onClick={() => navigate(-1)}
                style={{ border: "1px solid var(--border)" }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
