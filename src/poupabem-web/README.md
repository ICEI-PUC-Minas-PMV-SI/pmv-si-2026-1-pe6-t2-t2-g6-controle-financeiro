# PoupaBem — Front-end Web

Front-end web do PoupaBem (sistema de organização financeira pessoal), construído em React + Vite e consumindo a Web API em `.NET` deste repositório (`backend/PoupaBem.API`).

## Stack

- **React 18** + **Vite 5**
- **React Router 6** — roteamento (rotas públicas e protegidas)
- **Axios** — cliente HTTP com interceptor de JWT
- **Tailwind CSS** — estilização baseada nos design tokens das telas
- **Recharts** — gráfico de evolução do saldo
- **Lucide React** — ícones
- **Vitest** + **@testing-library/react** — testes unitários

## Estrutura

```
src/
├── api/                 Camada de integração com a Web API
│   ├── client.js        Axios + interceptor JWT + tratamento 401
│   ├── auth.js          POST /api/auth/{register,login,refresh}, GET /me
│   ├── categories.js    CRUD /api/categories
│   ├── transactions.js  CRUD /api/transactions (+ filtros)
│   ├── savingsGoals.js  CRUD /api/savings-goals (+ deposit)
│   └── reports.js       /api/reports/{summary,expenses-by-category,transactions-export}
├── contexts/
│   └── AuthContext.jsx  Estado global de autenticação (token + usuário)
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx
│   ├── Cadastro.jsx
│   ├── Dashboard.jsx
│   ├── Transacoes.jsx   (inclui modal de nova transação)
│   └── Cofrinhos.jsx    (inclui modais de novo cofrinho e aporte)
├── utils/
│   └── format.js        Helpers (BRL, datas, iniciais, enum TransactionType)
└── test/                Testes unitários (Vitest)
```

## Configuração

1. Instalar dependências:

```bash
npm install
```

2. Criar arquivo `.env` na raiz a partir do `.env.example`:

```
VITE_API_URL=http://localhost:5050
```

> Ajuste a porta para a do seu backend (no `appsettings.json` o padrão é `5050` ou `7202` para HTTPS — confirme em `backend/PoupaBem.API/Properties/launchSettings.json`).

3. Subir a API .NET:

```bash
cd ../backend
dotnet run --project PoupaBem.API
```

4. Rodar o front em outro terminal:

```bash
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## ⚠️ Habilitar CORS no back-end

O back-end ainda não tem CORS configurado. Para o front conseguir se comunicar com a API em outra porta, adicione em `backend/PoupaBem.API/Program.cs`:

```csharp
// Após builder.Services.AddControllers();
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

// Após app.UseHttpsRedirection();
app.UseCors();
```

## Mapeamento de funcionalidades → User Stories

| Tela        | Funcionalidades                                    | US atendidas         |
| ----------- | -------------------------------------------------- | -------------------- |
| Login       | Autenticação por e-mail e senha (JWT)              | US-02                |
| Cadastro    | Criação de conta com validação de senha            | US-01                |
| Dashboard   | Saldo, receitas, despesas, evolução, atalhos       | US-09, US-11         |
| Transações  | Listar, filtrar, criar, excluir, exportar CSV      | US-03, US-04, US-05, US-06, US-13 |
| Cofrinhos   | Listar metas, criar, aportar, excluir              | US-07, US-08         |

## Convenções importantes

- **TransactionType**: o enum do backend é `Income = 1, Expense = 2`. Sempre use a constante `TransactionType` de `src/utils/format.js`.
- **Datas**: o backend trabalha em UTC (`DateTime`). O front converte com `new Date(...).toISOString()` no envio e `new Date(iso).toLocaleDateString('pt-BR')` na exibição.
- **Categoria × Tipo**: o back valida que `transaction.transactionType === category.type`. O modal de nova transação só lista as categorias do tipo selecionado.

## Testes

```bash
npm run test
```

Cobre: `formatCurrency`, `formatDate`, `getInitials`, valores do enum `TransactionType`, e o ciclo de vida do `AuthContext` (hidratação a partir do localStorage e logout).

## Build de produção

```bash
npm run build
```

Gera os assets estáticos em `dist/`. Pode ser servido por qualquer host estático (Nginx, Vercel, S3+CloudFront).
