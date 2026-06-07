// Nominatim (OpenStreetMap) geocoding service — free, no API key required

export interface CityLocation {
  name: string;         // "São Paulo"
  state: string;        // "SP"
  fullName: string;     // "São Paulo, SP"
  latitude: number;
  longitude: number;
}

// Popular Brazilian cities with precise coordinates for instant access
export const POPULAR_CITIES: CityLocation[] = [
  { name: 'São Paulo',     state: 'SP', fullName: 'São Paulo, SP',     latitude: -23.5505, longitude: -46.6333 },
  { name: 'Rio de Janeiro',state: 'RJ', fullName: 'Rio de Janeiro, RJ',latitude: -22.9068, longitude: -43.1729 },
  { name: 'Belo Horizonte',state: 'MG', fullName: 'Belo Horizonte, MG',latitude: -19.9167, longitude: -43.9345 },
  { name: 'Brasília',      state: 'DF', fullName: 'Brasília, DF',      latitude: -15.7801, longitude: -47.9292 },
  { name: 'Salvador',      state: 'BA', fullName: 'Salvador, BA',      latitude: -12.9714, longitude: -38.5014 },
  { name: 'Fortaleza',     state: 'CE', fullName: 'Fortaleza, CE',     latitude:  -3.7172, longitude: -38.5431 },
  { name: 'Curitiba',      state: 'PR', fullName: 'Curitiba, PR',      latitude: -25.4284, longitude: -49.2733 },
  { name: 'Manaus',        state: 'AM', fullName: 'Manaus, AM',        latitude:  -3.1190, longitude: -60.0217 },
  { name: 'Recife',        state: 'PE', fullName: 'Recife, PE',        latitude:  -8.0539, longitude: -34.8811 },
  { name: 'Porto Alegre',  state: 'RS', fullName: 'Porto Alegre, RS',  latitude: -30.0346, longitude: -51.2177 },
  { name: 'Goiânia',       state: 'GO', fullName: 'Goiânia, GO',       latitude: -16.6869, longitude: -49.2648 },
  { name: 'Belém',         state: 'PA', fullName: 'Belém, PA',         latitude:  -1.4558, longitude: -48.5044 },
  { name: 'Florianópolis', state: 'SC', fullName: 'Florianópolis, SC', latitude: -27.5954, longitude: -48.5480 },
  { name: 'Maceió',        state: 'AL', fullName: 'Maceió, AL',        latitude:  -9.6658, longitude: -35.7350 },
  { name: 'Natal',         state: 'RN', fullName: 'Natal, RN',         latitude:  -5.7945, longitude: -35.2110 },
  { name: 'Teresina',      state: 'PI', fullName: 'Teresina, PI',      latitude:  -5.0892, longitude: -42.8019 },
  { name: 'Campo Grande',  state: 'MS', fullName: 'Campo Grande, MS',  latitude: -20.4697, longitude: -54.6201 },
  { name: 'João Pessoa',   state: 'PB', fullName: 'João Pessoa, PB',   latitude:  -7.1195, longitude: -34.8450 },
  { name: 'Aracaju',       state: 'SE', fullName: 'Aracaju, SE',       latitude: -10.9091, longitude: -37.0677 },
  { name: 'Porto Velho',   state: 'RO', fullName: 'Porto Velho, RO',   latitude:  -8.7612, longitude: -63.9004 },
];

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Search Brazilian cities via Nominatim API with debounce
 * Falls back to POPULAR_CITIES for fast local matching
 */
export const searchCities = (query: string): Promise<CityLocation[]> => {
  return new Promise((resolve) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      resolve([]);
      return;
    }

    // Fast local filter first
    const lower = trimmed.toLowerCase();
    const local = POPULAR_CITIES.filter(
      (c) => c.name.toLowerCase().includes(lower) || c.state.toLowerCase().includes(lower),
    );

    searchDebounceTimer = setTimeout(async () => {
      try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', `${trimmed}, Brasil`);
        url.searchParams.set('format', 'json');
        url.searchParams.set('countrycodes', 'br');
        url.searchParams.set('featuretype', 'city');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('limit', '10');
        url.searchParams.set('dedupe', '1');

        const res = await fetch(url.toString(), {
          headers: { 'Accept-Language': 'pt-BR' },
        });

        if (!res.ok) {
          resolve(local);
          return;
        }

        const data: NominatimResult[] = await res.json();

        const apiResults: CityLocation[] = data
          .filter((r) =>
            ['city', 'town', 'village', 'administrative'].includes(r.type) ||
            ['city', 'town', 'village'].includes(r.addresstype),
          )
          .map((r) => {
            const cityName =
              r.address.city || r.address.town || r.address.village || r.name;
            const stateCode = r.address.state ? (STATE_NAME_TO_CODE[r.address.state] ?? r.address.state) : '';
            return {
              name: cityName,
              state: stateCode,
              fullName: `${cityName}, ${stateCode}`,
              latitude: parseFloat(r.lat),
              longitude: parseFloat(r.lon),
            };
          });

        // Merge: API results first, then local ones not already present
        const seen = new Set(apiResults.map((c) => c.fullName));
        const merged = [
          ...apiResults,
          ...local.filter((c) => !seen.has(c.fullName)),
        ].slice(0, 10);

        resolve(merged.length > 0 ? merged : local);
      } catch {
        resolve(local);
      }
    }, 300);
  });
};

interface NominatimResult {
  lat: string;
  lon: string;
  name: string;
  type: string;
  addresstype: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
  };
}

const STATE_NAME_TO_CODE: Record<string, string> = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
  'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
  'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN', 'Rio Grande do Sul': 'RS', 'Rondônia': 'RO',
  'Roraima': 'RR', 'Santa Catarina': 'SC', 'São Paulo': 'SP',
  'Sergipe': 'SE', 'Tocantins': 'TO',
};
