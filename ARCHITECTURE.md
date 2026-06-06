# 🏗️ Arquitetura & Decisões Técnicas - Let's Run Together

## 1. Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components (UI)                     │
│  LoginPage | MapPage | EventsPage | CreateEventPage | Chat  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Custom React Hooks                          │
│       useAuth | useLocation | useChat | useEvents           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Zustand Store (State Management)                │
│  authStore | mapStore | chatStore | eventStore | friendStore│
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Services Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ localStorage Services      Auth Services             │   │
│  │ - userService             - authService             │   │
│  │ - eventService            - locationService         │   │
│  │ - chatService                                        │   │
│  │ - friendService                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Persistence & External APIs                     │
│         localStorage | Netlify Identity | Geolocation       │
└─────────────────────────────────────────────────────────────┘
```

## 2. Fluxo de Dados (Data Flow)

### User Login Flow
```
LoginPage
  → authService.login()
    → Netlify Identity (Google OAuth)
      → User object
        → userService.setCurrentUser()
          → localStorage
            → useAuthStore.setUser()
              → App re-renders → Redirect to MapPage
```

### Creating Event Flow
```
CreateEventPage (form)
  → handleSubmit()
    → eventService.createEvent()
      → localStorage
        → useEventStore.addEvent()
          → EventsPage re-renders with new event
```

### Chat Message Flow
```
ChatModal (input)
  → handleSendMessage()
    → chatService.addMessage()
      → localStorage
        → useChatStore.addMessage()
          → ChatList re-renders with new message
```

## 3. State Management com Zustand

### Por que Zustand?

✅ **Vantagens**
- Leve (apenas ~2KB)
- Não precisa de Provider/Context
- API simples e intuitiva
- Type-safe com TypeScript
- Sem boilerplate (ações inline)

❌ **Alternativas descartadas**
- Redux: muito boilerplate para este projeto
- Context API: prop drilling, performance
- Recoil: overkill para app simples

### Exemplo de Store

```typescript
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}));

// Uso no componente
const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);
```

## 4. Padrão de Serviços

### localStorage Services

Cada domínio tem seu próprio serviço:

```typescript
// userService.ts
export const userService = {
  getCurrentUser: () => { /* ... */ },
  saveUser: (user) => { /* ... */ },
  getAllUsers: () => { /* ... */ },
};
```

**Vantagem**: Fácil swappear `localStorage` por `API` quando necessário

## 5. Segurança & Privacidade

### Imprecisão de Localização

```typescript
// Haversine formula para adicionar ±1km de imprecisão
export const addLocationImprecision = (lat, lng, radiusKm = 1) => {
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * radiusKm;
  
  // Calcula novo ponto aleatório dentro do raio
  // ...
  return { lat: newLat, lng: newLng };
};
```

**Resultado**: Ponto do usuário é mostrado em posição aleatória dentro de 1km

### Chat P2P Protegido

```typescript
// Apenas amigos confirmados podem conversar
if (friendStatus.status !== 'accepted') {
  return null;  // Chat não abre
}
```

### OAuth Seguro

- Credenciais gerenciadas pelo Netlify
- Nenhuma senha armazenada localmente
- Tokens JWT do Netlify

## 6. Decisões de Design

### 1. Por que localStorage ao invés de banco de dados?

✅ **Justificativa**
- MVP rápido sem backend
- Sem complexidade de servidor
- Dados isolados por domínio
- Preparado para migração

❌ **Limitações**
- ~5-10MB de storage
- Dados não sincronizam entre abas
- Sem colaboração real-time

**Plano B**: Quando pronto, criar `services/api/*` com mesmo interface

### 2. Por que Leaflet?

✅ Razões
- Leve e rápido (~40KB)
- OpenStreetMap (free, sem API key)
- React-Leaflet wrapper excelente
- Muitos plugins disponíveis

❌ Alternativas
- Google Maps: pago, complexo
- Mapbox: pago, overkill
- Deck.gl: muito heavy

### 3. Por que TypeScript?

✅ Benefícios
- Type safety → menos bugs
- Melhor autocomplete
- Documentação automática
- Refactoring seguro

### 4. Por que Tailwind?

✅ Razões
- Utility-first rápido
- Mobile-first design
- Sem decisões de estilo
- Documentação excelente
- Theming fácil

## 7. Performance

### Code Splitting

```typescript
// React Router já faz isso automaticamente
const MapPage = lazy(() => import('./pages/MapPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
```

### Memoization

```typescript
// Evitar re-renders desnecessários
export const MyComponent = memo(({ user }) => {
  return <div>{user.name}</div>;
}, (prev, next) => prev.user.id === next.user.id);
```

### Lazy Loading

```typescript
// MapContainer é pesado, renderizar apenas quando necessário
{isMapVisible && <MapPage />}
```

## 8. Testes

### Manual Testing Checklist

```
[] Auth
  [] Login com Google funciona
  [] Logout limpa store
  [] Termos aparecem na primeira vez
  
[] Map
  [] Localização carrega corretamente
  [] Mapa é responsivo
  [] Zoom/pan funcionam
  
[] Eventos
  [] Criar evento salva
  [] Listar eventos funciona
  [] Seguir/deseguir evento funciona
  
[] Chat
  [] Chat P2P abre apenas entre amigos
  [] Mensagens salvam
  [] Chat de evento tem todos followers
  
[] Data
  [] Exportar gera arquivo JSON
  [] Importar restaura dados
  [] Dados persistem ao recarregar página
```

### Debugging

```typescript
// localStorage debug
console.log(JSON.parse(localStorage.getItem('lets_run_users')));

// Zustand state
import { useMapStore } from './stores/mapStore';
const store = useMapStore.getState();
console.log(store);
```

## 9. Roadmap de Migração para Backend

### Fase 1: Preparar Serviços

✅ Hoje: `services/localStorage/*`
📋 Criar: `services/api/*` com mesma interface

### Fase 2: Backend

```typescript
// Novo API service
export const userService = {
  async getCurrentUser() {
    const res = await fetch('/api/users/me');
    return res.json();
  },
  async saveUser(user) {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return res.json();
  },
};
```

### Fase 3: Swap

```typescript
// Antes
import { userService } from '../services/localStorage/userService';

// Depois (sem mudar componentes!)
import { userService } from '../services/api/userService';
```

## 10. Escalabilidade

### Quando mudar localStorage para Backend

- Mais de 100.000 usuários
- Necessidade de real-time chat (WebSocket)
- Análises e relatórios
- Notificações push
- Mobile app

### Stack Sugerido para Backend

- **Framework**: Node.js (Express/Nest.js) ou Python (FastAPI)
- **Database**: PostgreSQL (geolocalização nativa)
- **Real-time**: Socket.io ou Firebase
- **Search**: Elasticsearch (busca de eventos)
- **Cache**: Redis (usuários online)
- **Hosting**: Railway, Render ou AWS

## 11. Padrões de Código

### Componente Funcional

```typescript
import type { FC } from 'react';
import { Button } from './Button';

interface MyComponentProps {
  title: string;
  onClose: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ 
  title, 
  onClose 
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClose}>Fechar</Button>
    </div>
  );
};
```

### Custom Hook

```typescript
import { useEffect, useState } from 'react';
import { userService } from '../services/localStorage/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const data = userService.getAllUsers();
    setUsers(data);
  }, []);
  
  return users;
};
```

### Store

```typescript
import { create } from 'zustand';
import type { User } from '../types/index';

interface UserStore {
  users: User[];
  addUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
}));
```

## 12. CI/CD

### GitHub Actions (sugerido)

```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run type-check
```

### Deploy Automático

Netlify já oferece:
- Deploy em cada push
- Preview deployments em PRs
- Rollback automático
- Analytics

---

**Última atualização**: Junho 2026  
**Versão**: 1.0.0  
**Mantido por**: Comunidade Let's Run Together
