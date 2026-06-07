import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiSearch, FiLoader } from 'react-icons/fi';
import { searchCities, POPULAR_CITIES } from '../../services/location/geocodingService';
import type { CityLocation } from '../../services/location/geocodingService';
import type { SportType } from '../../types/index';
import { SPORTS } from '../../constants/index';
import { Button } from '../Common/Button';

interface Props {
  isOpen: boolean;
  onConfirm: (city: CityLocation, sport: SportType) => void;
  initialCity?: string;
  initialSport?: SportType;
  required?: boolean;
}

export const LocationSelectionModal = ({ isOpen, onConfirm, initialCity, initialSport, required = false }: Props) => {
  const [query, setQuery] = useState(initialCity ?? '');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [selected, setSelected] = useState<CityLocation | null>(null);
  const [sport, setSport] = useState<SportType>(initialSport ?? 'running');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialCity ?? '');
      setSport(initialSport ?? 'running');
      setSelected(null);
      setShowDropdown(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialCity, initialSport]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    searchCities(query).then((r) => {
      setResults(r);
      setIsSearching(false);
    });
  }, [query]);

  const handleSelect = (city: CityLocation) => {
    setSelected(city);
    setQuery(city.fullName);
    setShowDropdown(false);
    setResults([]);
  };

  if (!isOpen) return null;

  const showPopular = query.trim().length < 2;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel w-full max-w-md">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FiMapPin size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Onde você está?</h2>
              <p className="text-green-100 text-sm mt-0.5">
                {required ? 'Necessário para aparecer no mapa' : 'Atualize sua localização'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* City search */}
          <div>
            <label className="label">Cidade</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--text-faint)' }}>
                {isSearching ? <FiLoader size={15} className="animate-spin" /> : <FiSearch size={15} />}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                onFocus={() => { if (query.length >= 2) setShowDropdown(true); }}
                placeholder="Ex: São Paulo, Rio de Janeiro..."
                className="input pl-9"
              />

              {showDropdown && results.length > 0 && (
                <ul
                  className="absolute top-full mt-1 left-0 right-0 rounded-xl shadow-lg max-h-52 overflow-y-auto z-50"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  {results.map((city) => (
                    <li key={city.fullName}>
                      <button
                        type="button"
                        onMouseDown={() => handleSelect(city)}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors hover:bg-[var(--bg-muted)] text-sm"
                      >
                        <FiMapPin size={13} className="text-green-500 shrink-0" />
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{city.name}</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--text-faint)' }}>{city.state}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {showPopular && (
              <div className="mt-3">
                <p className="label mb-2">Cidades populares</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.slice(0, 10).map((city) => (
                    <button
                      key={city.fullName}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full transition-colors border"
                      style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selected && (
              <div
                className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgb(34 197 94 / .12)', color: '#16a34a', border: '1px solid rgb(34 197 94 / .3)' }}
              >
                <FiMapPin size={14} />
                <span className="font-semibold">{selected.fullName}</span>
                <span className="ml-auto text-xs opacity-70">✓ Selecionado</span>
              </div>
            )}
          </div>

          {/* Sport selector */}
          <div>
            <label className="label">Esporte de hoje</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SPORTS) as SportType[]).map((key) => {
                const s = SPORTS[key];
                const isActive = sport === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSport(key)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border: `2px solid ${isActive ? s.color : 'var(--border)'}`,
                      background: isActive ? `${s.color}1a` : 'var(--bg-card)',
                      color: isActive ? s.color : 'var(--text-muted)',
                    }}
                  >
                    <span className="text-xl">{s.label.split(' ')[0]}</span>
                    <span>{s.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button disabled={!selected} onClick={() => selected && onConfirm(selected, sport)} size="lg" className="w-full">
            {required ? 'Confirmar e entrar no mapa' : 'Salvar localização'}
          </Button>

          {!required && (
            <button
              type="button"
              onClick={() => onConfirm({ name: '', state: '', fullName: '', latitude: 0, longitude: 0 }, sport)}
              className="w-full text-center text-sm transition-colors"
              style={{ color: 'var(--text-faint)' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
