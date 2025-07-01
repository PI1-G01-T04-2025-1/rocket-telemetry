# 🚀 Oásis Rocket Telemetry System

Sistema de visualização de telemetria para foguetes desenvolvido com Next.js e TypeScript.

---

## 🧰 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [lint-staged](https://github.com/okonet/lint-staged)

---

## 📁 Estrutura do Projeto

```

src/
├── app/              # Páginas e layout principal
│   ├── page.tsx      # Página inicial da aplicação
│   └── layout.tsx    # Layout base compartilhado
├── components/       # Componentes reutilizáveis
│   └── ui/           # Elementos de interface (ex: botões)
├── lib/              # Funções utilitárias
├── views/            # Componentes de alto nível das páginas

````

---

## ▶️ Como Executar Localmente

### 📌 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/rocket-telemetry.git
cd rocket-telemetry
```

### 📦 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 🧪 3. Execute o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

---

## 🧪 Scripts Disponíveis

```bash
npm run dev       # Inicia o servidor local de desenvolvimento
npm run lint      # Verifica o código com ESLint
npm run format    # Formata os arquivos com Prettier
```

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas!
Sinta-se à vontade para:

* 📌 Abrir uma *issue* com sugestões ou problemas encontrados
* 🚀 Criar um *pull request* com melhorias ou correções
* 💡 Discutir ideias para novas funcionalidades

---

## 🛠️ Convenções de Commit

Este projeto utiliza [CommitLint](https://commitlint.js.org/) para padronização de mensagens de commit.

**Exemplos válidos:**

```
feat: adiciona novo botão de envio  
fix: corrige bug na leitura da telemetria  
docs: atualiza o README  
```

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.
Consulte o arquivo `LICENSE` para mais detalhes.

```
