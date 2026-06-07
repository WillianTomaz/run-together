[![Netlify Status](https://api.netlify.com/api/v1/badges/88daba3d-41ac-45b1-b94c-814c5a0adcff/deploy-status)](https://app.netlify.com/projects/run-together/deploys)

# 🏃 Let's Run Together - Plataforma de Encontro para Corredores

Uma plataforma web moderna para encontrar amigos e pessoas para praticar esportes juntas no mesmo dia e horário.

## 🎯 Motivação

O maior desafio de quem pratica corrida, ciclismo ou outros esportes é encontrar parceiros disponíveis para treinar juntos. Esta plataforma resolve esse problema permitindo que usuários se conectem em tempo real através de localização compartilhada, com controle total sobre privacidade e segurança.

## ✨ Funcionalidades

### Core Features
- **🗺️ Mapa Interativo**: Veja usuários e eventos próximos em um mapa em tempo real
- **📍 Localização Segura**: Sua localização é mostrada com imprecisão de ±1km para usuários não-amigos, apenas amigos confirmados veem sua posição precisa
- **👥 Sistema de Amigos**: Solicite amizade com outros usuários e converse apenas com amigos confirmados
- **💬 Chat P2P**: Converse com amigos para combinar sessões de treino
- **🎪 Eventos**: Crie eventos para reunir múltiplas pessoas (grupos de corrida, corridas de rua, etc)
- **📱 Responsividade**: Totalmente funcional em desktop e mobile
- **🔐 Autenticação OAuth**: Login seguro com Google via Netlify Identity

### Esportes Suportados
- 🏃 **Corrida**
- 🚴 **Ciclismo**
- 💪 **Academia/Musculação**
- 🏊 **Natação**

### Persistência de Dados
- Dados armazenados localmente em `localStorage`
- **Exportar/Importar**: Faça backup de seus dados a qualquer momento
- Sincronização automática quando novo usuário é adicionado

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 18.x | Framework principal |
| **TypeScript** | 5.x | Type safety |
| **React Router DOM** | 6.x | Roteamento |
| **Zustand** | 4.x | State management (leve e eficiente) |
| **Leaflet + React-Leaflet** | 4.x | Mapa interativo com OpenStreetMap |
| **Tailwind CSS** | 4.x | Estilização responsiva |
| **React Icons** | 4.x | Ícones |
| **UUID** | 4.x | Geração de IDs únicos |
| **Dayjs** | 1.x | Manipulação de datas |
| **Netlify Identity** | Latest | Autenticação Google OAuth |
| **Vite** | 8.x | Build tool moderno |

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Map/              # Componentes do mapa
│   ├── Chat/             # Componentes de chat
│   ├── Events/           # Componentes de eventos
│   ├── Navigation/       # Menu lateral
│   ├── Modals/           # Modais (termos, amizades)
│   └── Common/           # Componentes reutilizáveis (Button, Card)
├── pages/
│   ├── LoginPage.tsx     # Página de autenticação
│   ├── MapPage.tsx       # Mapa principal
│   ├── EventsPage.tsx    # Listagem de eventos
│   ├── CreateEventPage.tsx # Criar novo evento
│   └── MessagesPage.tsx  # Chat e mensagens
├── hooks/                # Custom React hooks
├── services/
│   ├── localStorage/     # Serviços de persistência
│   ├── auth/            # Autenticação
│   └── location/        # Geolocalização
├── stores/              # Zustand stores (state management)
├── types/               # Tipos TypeScript
├── constants/           # Configurações e constantes
├── utils/               # Funções utilitárias
└── App.tsx              # Componente raiz com roteamento
```

## 🏗️ Arquitetura & Padrões

### Clean Code & SOLID Principles
- **Single Responsibility**: Cada serviço/componente tem uma responsabilidade única
- **Open/Closed**: Fácil adicionar novos tipos de esporte sem modificar código existente
- **Dependency Injection**: Zustand stores injetam dependências via hooks
- **Separation of Concerns**: Serviços abstraem a lógica de negócio

### State Management com Zustand
- Stores separados por domínio: `authStore`, `mapStore`, `chatStore`, `eventStore`, `friendStore`
- State compartilhado sem prop drilling
- Fácil integração com localStorage

### Serviços de Persistência
Arquitetura preparada para migração futura para backend:
```typescript
// Hoje: localStorage
userService.saveUser(user)

// Amanhã: basta trocar a implementação em services/localStorage/userService.ts
// para services/api/userService.ts sem mudar componentes
```

### Segurança & Privacidade
1. **Imprecisão de Localização**: Algoritmo Haversine adiciona ±1km de imprecisão para não-amigos
2. **Chat P2P Protegido**: Apenas amigos confirmados podem conversar
3. **OAuth**: Credenciais gerenciadas pelo Netlify, nenhuma senha armazenada
4. **localStorage Isolado**: Dados confinados ao domínio do navegador

## 🚀 Iniciando Localmente

### Pré-requisitos
- Node.js 18+ e npm 9+
- Uma conta Netlify (para autenticação)

### Setup Local

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/run-together.git
cd run-together
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
VITE_NETLIFY_IDENTITY_URL=https://seu-site.netlify.app/.netlify/identity
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173`

### Comandos Úteis

```bash
# Build para produção
npm run build

# Visualizar build localmente
npm run preview

# TypeScript type checking
npm run type-check

# Build com type checking
npm run build
```

## 🌐 Fazendo Deploy no Netlify

### Método 1: Deploy via Git (Recomendado)

1. **Push seu código para GitHub**
```bash
git add .
git commit -m "Inicial: Let's Run Together"
git push origin main
```

2. **Conecte ao Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Clique "New site from Git"
   - Selecione seu repositório GitHub
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Configure Autenticação**
   - Em Netlify: Site settings → Identity
   - Ative o Netlify Identity
   - Configure Google OAuth provider

4. **Deploy automático**
   - Cada push para `main` faz deploy automático

### Método 2: Deploy Manual

```bash
# Build local
npm run build

# Instale Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Configuração do netlify.toml

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[context.production]
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔐 Configurando Google OAuth

1. Vá para [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Habilite Google+ API
4. Crie credenciais OAuth 2.0 (Web application)
5. Adicione URIs autorizados:
   - `http://localhost:5173`
   - `https://seu-site.netlify.app`
6. Configure em Netlify Identity → Providers

## 📊 Estrutura de Dados

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  avatar?: string;
  latitude: number;        // Com imprecisão ±1km
  longitude: number;
  sportType: 'running' | 'cycling' | 'gym' | 'swimming';
  lastUpdated: Date;
  createdAt: Date;
}
```

### Friend
```typescript
{
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  acceptedAt?: Date;
}
```

### Event
```typescript
{
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  sportType: SportType;
  dateTime: Date;
  createdBy: string;
  followers: string[];
  maxParticipants?: number;
  createdAt: Date;
}
```

### Chat
```typescript
{
  id: string;
  type: 'p2p' | 'event';
  participantIds: string[];
  eventId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 Testing & Quality

### Code Quality
- TypeScript strict mode para type safety
- ESLint (setup em `.eslintrc.cjs`)
- Tailwind CSS para consistência visual

### Manual Testing Checklist
- [ ] Login/Logout funciona
- [ ] Mapa carrega com localização correta
- [ ] Criar evento salva em localStorage
- [ ] Chat P2P entre amigos funciona
- [ ] Exportar/Importar dados funciona
- [ ] Responsivo em mobile
- [ ] Privacidade: não-amigos veem posição imprecisa

## 📱 UX/UI Highlights

- **Mobile-first**: Totalmente responsivo e otimizado para tela pequena
- **Dark mode ready**: Estrutura CSS preparada para tema escuro
- **Acessibilidade**: Contraste adequado, labels em inputs, ARIA attributes
- **Feedback visual**: Loading states, validações, mensagens de sucesso
- **Animações suaves**: Transitions CSS para melhor UX

## 🔄 Fluxo do Usuário

1. **Primeiro Acesso**
   - Modal de Termos & Privacidade
   - Autenticação via Google
   - Permissão de localização

2. **Na Plataforma**
   - Vê o mapa com pessoas próximas
   - Pode enviar requisição de amizade
   - Após aceitar, pode conversar
   - Pode criar/seguir eventos
   - Acessa chat de evento com todos os followers

3. **Dados Persistem**
   - Tudo é salvo em localStorage
   - Pode exportar para backup
   - Pode importar em novo navegador/dispositivo

## 📦 Migrando para Backend

Estrutura preparada para fácil migração:

1. Crie `services/api/userService.ts` com mesmas funções
2. Substitua imports em componentes
3. Nenhuma mudança necessária nos componentes!

Exemplo:
```typescript
// Antes: localStorage
import { userService } from '../services/localStorage/userService';

// Depois: API
import { userService } from '../services/api/userService';

// Componente não muda!
```

## 🤝 Contribuindo

### Setup para Contribuidores

1. Fork o repositório
2. Crie uma branch `feature/sua-feature`
3. Siga Clean Code principles
4. Faça commit com mensagens descritivas
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript com tipos explícitos
- Componentes funcionais com hooks
- Nomes descritivos em português
- Comentar código complexo apenas
- Arquivo por componente

### Exemplo de Componente

```typescript
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClose: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onClose }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};
```

## 🐛 Relatando Issues

Descreva:
- O que você estava fazendo
- O que esperava
- O que aconteceu
- Screenshots se possível
- Browser/SO

## 📝 Licença

Este projeto é open source sob a licença MIT.

## 🙏 Agradecimentos

- OpenStreetMap & Leaflet por mapa fantástico
- Netlify pela autenticação segura
- React & Zustand pela excelente DX

## 📞 Suporte

- 📧 Email: support@letsruntogether.com
- 🐙 GitHub Issues: [Issues](https://github.com/seu-usuario/run-together/issues)
- 💬 Discussions: [Discussions](https://github.com/seu-usuario/run-together/discussions)

---

**Desenvolvido com ❤️ para corredores, ciclistas e atletas**
