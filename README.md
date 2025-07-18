# 🚀 Oásis Rocket Telemetry System

Sistema de visualização e análise de telemetria para foguetes, desenvolvido com Next.js, TypeScript e Prisma.

---

## 🧰 Tecnologias Utilizadas

- [Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/) + SQLite
- [Recharts](https://recharts.org/) (gráficos)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/#/), [lint-staged](https://github.com/okonet/lint-staged)
- Scripts Python para mock do ESP

---

## 📁 Estrutura do Projeto

```
src/
├── app/              # Páginas e rotas API
├── components/       # Componentes React reutilizáveis
├── lib/              # Funções utilitárias, comunicação ESP, API, etc
├── services/         # Serviços
├── hooks/            # React hooks customizados
├── views/            # Componentes das páginas
prisma/
├── schema.prisma     # Modelo do banco de dados
├── seed.ts           # Script de seed para popular o banco
scripts/
├── mock-esp-server.py # Mock do servidor ESP (Python)
```

---

## Primeiros Passos

### 1. Clone o repositório

```bash
git https://github.com/PI1-G01-T04-2025-1/rocket-telemetry/
cd rocket-telemetry
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
# Banco de dados
DATABASE_URL="file:./prisma/dev.db"

# Endereço do mock ESP (backend)
ESP_BASE_URL="http://localhost:8080"

# Endereço do mock ESP (frontend)
NEXT_PUBLIC_ESP_BASE_URL="http://localhost:8080"

# Endereço da API (frontend)
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

### 4. Rode as migrations e popule o banco

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Inicie o mock do ESP (opcional, para testes locais)

```bash
# Em outro terminal
python3 scripts/mock-esp-server.py
```

### 6. Rode o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Comunicação com o ESP

Para testar a comunicação com o ESP via interface web:

```
http://localhost:3000/esp-test
```

Esta página permite testar a comunicação com o ESP em tempo real.

## Testes Unitários

- Testes unitários com Jest e Testing Library
- Scripts de teste para comunicação com ESP (`npm run test:esp`)

---

## 🧪 Scripts Úteis

```bash
npm run dev         # Inicia o servidor Next.js em modo desenvolvimento
npm run build       # Build de produção
npm run start       # Inicia o servidor em produção
npm run lint        # Checa padrões de código com ESLint
npm run format      # Formata o código com Prettier
npm run test        # Executa os testes unitários (Jest)
npx prisma studio   # Abre o Prisma Studio (interface visual do banco)
```

---

## 🛰️ Mock do ESP

O projeto inclui scripts Python para simular o hardware ESP32, servindo dados de telemetria em `/data.json`:

```bash
python3 scripts/mock-esp-server.py
```

---

## 🗄️ Banco de Dados

- **ORM:** Prisma
- **Banco:** SQLite (local)
- **Modelos:** Foguete, Lançamento, Dados Coletados
- **Migrations:** `npx prisma migrate deploy`
- **Seed:** `npx prisma db seed`
- **Interface visual:** `npx prisma studio`

---

## 🔌 APIs Disponíveis

- `GET /api/esp/data` — Busca dados do ESP (mock ou real)
- `GET /api/esp/status` — Status do ESP
- `GET /api/v1/rocket/[id]/launches` — Lista lançamentos do foguete
- `POST /api/v1/rocket/[id]/launches/new` — Cria novo lançamento
- `GET /api/v1/rocket/[id]/launches/[launchId]` — Detalhes do lançamento

---

## 🛠️ Convenções e Qualidade

- **Commits:** Padronizados com CommitLint
- **Lint:** ESLint + Prettier
- **Hooks:** Husky + lint-staged

---

## 🤝 Contribuindo

Contribuições são bem-vindas!  
Abra uma issue, envie um PR ou sugira melhorias.

---

## 📄 Licença

MIT

```
