# 🚀 Quick Start - Let's Run Together

## ⚡ 5 Minutos para Começar

### 1. Instale Dependências
```bash
npm install
```

### 2. Inicie o Dev Server
```bash
npm run dev
```

Abra `http://localhost:5173` no navegador

### 3. Teste Localmente

**Simulando múltiplos usuários:**

1. Abra a aplicação em 2 abas do navegador
2. Login com diferentes contas Google (ou dummy data em dev)
3. Veja os usuários aparecendo no mapa

**localStorage em Dev:**

```javascript
// No console do navegador:
JSON.parse(localStorage.getItem('lets_run_users'))
JSON.parse(localStorage.getItem('lets_run_events'))
JSON.parse(localStorage.getItem('lets_run_chats'))
```

## 📝 Testando Features

### ✅ Auth
- [ ] Login com Google funciona
- [ ] Termos aparecem (primeira vez)
- [ ] Permissão de localização é solicitada
- [ ] Logout limpa dados de sessão

### ✅ Mapa
- [ ] Mapa carrega e está centralizado
- [ ] Seu marcador aparece
- [ ] Zoom/pan funciona
- [ ] Responsivo em mobile

### ✅ Eventos
- [ ] Criar evento salva em localStorage
- [ ] Listar eventos mostra eventos criados
- [ ] Seguir evento adiciona você como follower
- [ ] Data/hora são validadas

### ✅ Chat
- [ ] Criar chat funciona (simulando amigos)
- [ ] Mensagens aparecem em tempo real
- [ ] Chat de evento tem todos followers

### ✅ Dados
- [ ] Exportar gera arquivo JSON
- [ ] Importar restaura dados
- [ ] Recarregar página mantém dados

## 🔨 Comandos Principais

```bash
# Desenvolvimento
npm run dev          # Start dev server
npm run build        # Build para produção
npm run preview      # Preview do build

# Type checking
npm run type-check   # TypeScript checker

# Build com verificação
npm run build        # Inclui type-check
```

## 🌍 Deploy no Netlify

### Opção 1: Direto via GitHub (Recomendado)

1. Push seu código
2. Vá para netlify.com
3. "New site from Git"
4. Selecione seu repositório
5. Pronto! Deploy automático

### Opção 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

## 🔐 Configurar Google OAuth

1. Google Cloud Console
2. Crie OAuth 2.0 credentials
3. Adicione URIs:
   - http://localhost:5173 (dev)
   - https://seu-site.netlify.app (produção)
4. Configure em Netlify Identity

## 🎨 Interface

### Páginas Principais

```
/          → Redirect a /map
/map       → Mapa com usuários e eventos
/events    → Listar eventos
/create-event → Criar novo evento
/messages  → Chat e mensagens
```

### Menu (Mobile: hamburger)

- 🗺️ Ver Mapa
- ➕ Criar Evento  
- 🔍 Buscar Eventos
- 💬 Mensagens
- ⬇️ Exportar Dados
- ⬆️ Importar Dados
- 🚪 Sair

## 💾 localStorage Keys

```javascript
lets_run_user           // Usuário atual
lets_run_users          // Todos os usuários
lets_run_events         // Todos os eventos
lets_run_chats          // Todas as conversas
lets_run_friends        // Relações de amizade
lets_run_terms_accepted // Termos aceitos
```

## 🐛 Troubleshooting

### Mapa não aparece
- Verificar console (F12)
- Netlify pode bloquear Maps em dev
- Usar http://localhost em dev

### localStorage vazio
- Dados são salvos quando ações acontecem
- Criar evento → salva em localStorage
- Testar em incógnito (limpo) vs normal

### Build falha
```bash
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript errors
```bash
npm run type-check  # Ver todos os erros
```

## 📚 Documentação Completa

- **README.md** - Visão geral e setup
- **CONTRIBUTING.md** - Como contribuir
- **ARCHITECTURE.md** - Decisões técnicas
- **QUICK_START.md** - Esse arquivo!

## 🎯 Próximos Passos

### Para Usuários
1. Criar conta com Google
2. Explorar o mapa
3. Criar primeiro evento
4. Convidar amigos

### Para Desenvolvedores
1. Explore a estrutura (`src/`)
2. Adicione um novo tipo de esporte em `constants/index.ts`
3. Crie um novo componente
4. Faça um PR! 🚀

---

**Pronto? Vamos lá! 🏃‍♂️**
