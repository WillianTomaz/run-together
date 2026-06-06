# 🤝 Guia de Contribuição - Let's Run Together

Obrigado por querer contribuir! Este documento explica como fazer isso de forma organizada e eficiente.

## 🎯 Como Começar

### 1. Fork e Clone
```bash
# Fork no GitHub, depois:
git clone https://github.com/seu-usuario/run-together.git
cd run-together
git remote add upstream https://github.com/original/run-together.git
```

### 2. Setup Local
```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## 📝 Workflow de Contribuição

### Passo 1: Crie uma Branch
```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/bug-description
# ou
git checkout -b docs/improvement
```

**Nomes de branch:**
- `feature/user-authentication` - nova funcionalidade
- `fix/chat-messages-bug` - correção de bug
- `refactor/auth-service` - refatoração
- `docs/setup-guide` - documentação

### Passo 2: Faça suas mudanças

Siga os padrões de código:

#### TypeScript/React
```typescript
// ✅ BOM
import type { User } from '../types/index';

interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
}

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  return (
    <div onClick={() => onSelect(user)}>
      <p>{user.name}</p>
    </div>
  );
};

// ❌ RUIM
export const UserCard = (props: any) => {
  return <div onClick={() => props.onSelect(props.user)}>{props.user.name}</div>;
};
```

#### Estrutura de Arquivos
```bash
src/
├── components/
│   └── MyComponent.tsx        # Um arquivo por componente
├── pages/
│   └── MyPage.tsx
├── services/
│   └── myService.ts
├── types/
│   └── MyType.ts
└── stores/
    └── myStore.ts
```

#### Importar Tipos Corretamente
```typescript
// ✅ BOM
import type { User, Event } from '../types/index';
import { useAuthStore } from '../stores/authStore';

// ❌ RUIM
import { User, Event } from '../types/index';  // Types devem ser type-only
```

### Passo 3: Commit com Mensagens Claras

```bash
# ✅ BOM
git commit -m "feat: adicionar busca de eventos por tipo de esporte"
git commit -m "fix: corrigir bug de imprecisão de localização"
git commit -m "docs: atualizar guia de contribuição"

# ❌ RUIM
git commit -m "arrumei algo"
git commit -m "changes"
```

**Formato de mensagem:**
```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Exemplo completo:
```
feat(chat): implementar chat P2P entre amigos

- Adiciona componente ChatModal
- Cria chatService com persistência em localStorage
- Implementa validação de amizade antes de abrir chat

Closes #123
```

### Passo 4: Push e Pull Request

```bash
git push origin feature/minha-feature
```

No GitHub:
1. Clique "Compare & pull request"
2. Preencha o template do PR:

```markdown
## 📝 Descrição
Breve descrição do que foi feito

## 🎯 Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] TypeScript compila sem erros
- [ ] Testei localmente
- [ ] Atualizei documentação relevante

## 🔗 Relacionado a
Closes #123
```

## 📋 Checklist Antes de Submeter

- [ ] `npm run build` funciona sem erros
- [ ] Código segue padrões TypeScript/React
- [ ] Sem `console.log` ou código de debug
- [ ] Tipos estão corretos
- [ ] Arquivo por componente
- [ ] PR tem descrição clara
- [ ] Commits têm mensagens descritivas

## 🛠️ Arquitetura e Padrões

### Camadas

```
UI Component → Custom Hook → Zustand Store → Service → Storage
```

### Exemplo Completo: Adicionar Feature

1. **Type** (`src/types/index.ts`)
```typescript
export interface MyData {
  id: string;
  name: string;
}
```

2. **Service** (`src/services/localStorage/myService.ts`)
```typescript
export const myService = {
  getAll: (): MyData[] => {
    return storageService.getItem<MyData[]>(STORAGE.MY_DATA, []) || [];
  },
  save: (data: MyData): void => {
    const all = myService.getAll();
    const index = all.findIndex((d) => d.id === data.id);
    if (index >= 0) all[index] = data;
    else all.push(data);
    storageService.setItem(STORAGE.MY_DATA, all);
  },
};
```

3. **Store** (`src/stores/myStore.ts`)
```typescript
import { create } from 'zustand';
import type { MyData } from '../types/index';

interface MyStore {
  items: MyData[];
  addItem: (item: MyData) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
}));
```

4. **Hook** (`src/hooks/useMyData.ts`)
```typescript
import { useMyStore } from '../stores/myStore';
import { myService } from '../services/localStorage/myService';

export const useMyData = () => {
  const items = useMyStore((state) => state.items);
  const addItem = useMyStore((state) => state.addItem);

  const save = (item: MyData) => {
    myService.save(item);
    addItem(item);
  };

  return { items, save };
};
```

5. **Component** (`src/components/MyComponent.tsx`)
```typescript
import { useMyData } from '../hooks/useMyData';

export const MyComponent = () => {
  const { items, save } = useMyData();

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## 🔍 Code Review

Seus PRs serão revisados por:
- [ ] Funcionalidade correcta
- [ ] Sem bugs/regressions
- [ ] Padrões de código
- [ ] Documentação
- [ ] Performance
- [ ] Segurança

### Feedback Comum

**"TypeScript não compila"** → Verifique tipos e imports

**"Quebrou outro componente"** → Teste `npm run build`

**"Não segue padrões"** → Veja exemplos em componentes similares

## 🐛 Encontrou um Bug?

1. Verifique se não foi reportado em Issues
2. Crie uma Issue descrevendo:
   - Como reproduzir
   - Comportamento esperado vs atual
   - Screenshots
   - Browser/SO

## 💡 Sugestões de Features

1. Abra uma Discussion ou Issue
2. Descreva o problema e solução proposta
3. Aguarde feedback antes de começar

## 📚 Recursos Úteis

- [Documentação React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet API](https://leafletjs.com/reference)

## 🎓 Dúvidas?

- Abra uma Discussion
- Comente em Issues existentes
- Veja código de outros PRs

## 👏 Obrigado!

Toda contribuição, por menor que seja, faz diferença. Obrigado por querer melhorar Let's Run Together! 🏃‍♂️
