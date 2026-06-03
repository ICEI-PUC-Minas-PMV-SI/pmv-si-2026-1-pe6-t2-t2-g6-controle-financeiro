# Front-end Movel

O front-end movel do PoupaBem tem como objetivo permitir que o usuario acompanhe suas financas pessoais diretamente pelo smartphone, mantendo acesso rapido aos mesmos recursos principais da aplicacao web: cadastro, login, dashboard financeiro, registro de receitas e despesas, categorias, relatorios e cofrinhos.

A proposta mobile prioriza consultas e lancamentos rapidos, pois o uso em celular normalmente acontece em momentos curtos do dia, como logo apos uma compra, ao receber uma receita ou ao acompanhar o progresso de uma meta financeira. Por isso, a interface foi planejada para ser objetiva, responsiva e orientada a tarefas frequentes.

## Projeto da Interface

A aplicacao movel sera organizada em uma navegacao simples, com telas focadas em uma acao principal por vez. O usuario deve conseguir entrar no sistema, visualizar sua situacao financeira e registrar movimentacoes com poucos toques.

Telas previstas:

| Tela | Objetivo | Funcionalidades principais |
| --- | --- | --- |
| Login | Autenticar usuario cadastrado | Entrada de e-mail e senha, validacao de campos e acesso ao app |
| Cadastro | Criar uma nova conta | Nome, sobrenome, e-mail, senha, confirmacao de senha e aceite dos termos |
| Dashboard | Exibir resumo financeiro | Saldo atual, receitas, despesas, ultimas transacoes e progresso dos cofrinhos |
| Transacoes | Registrar e consultar movimentacoes | Listagem, filtros por tipo/categoria, criacao e exclusao de transacoes |
| Nova transacao | Inserir receita ou despesa | Tipo, titulo, valor, categoria, data e descricao opcional |
| Cofrinhos | Acompanhar metas financeiras | Listagem de metas, percentual de progresso, novo cofrinho e aporte |
| Perfil | Gerenciar sessao | Dados basicos do usuario e opcao de sair |

A navegacao principal sera feita por abas inferiores, adequadas ao uso com uma mao:

- Dashboard
- Transacoes
- Cofrinhos
- Perfil

As acoes de criacao, como nova transacao e novo cofrinho, devem aparecer como botoes de destaque nas telas correspondentes, evitando menus profundos.

### Wireframes

Os wireframes abaixo descrevem a estrutura planejada para as principais telas mobile.

#### Login

```text
+----------------------------------+
| PoupaBem                         |
| Organize suas financas           |
|                                  |
| [ E-mail                       ] |
| [ Senha                       ] |
|                                  |
| [ Entrar                       ] |
| Criar conta                      |
+----------------------------------+
```

#### Dashboard

```text
+----------------------------------+
| Ola, Maryana                     |
|                                  |
| Saldo atual                      |
| R$ 2.350,00                      |
|                                  |
| [ Receitas ] [ Despesas ]        |
|                                  |
| Ultimas transacoes               |
| - Mercado             -R$ 80,00  |
| - Salario           +R$ 2500,00  |
|                                  |
| Cofrinhos                        |
| Viagem internacional       45%   |
|                                  |
| Dashboard | Transacoes | Metas   |
+----------------------------------+
```

#### Transacoes

```text
+----------------------------------+
| Transacoes                    +  |
| [ Todas ] [ Receitas ] [ Desp ] |
| [ Categoria                  v ] |
|                                  |
| 14/05  Alimentacao   -R$ 42,90  |
| 13/05  Transporte    -R$ 12,00  |
| 10/05  Freelance    +R$ 600,00  |
|                                  |
| Dashboard | Transacoes | Metas   |
+----------------------------------+
```

#### Nova Transacao

```text
+----------------------------------+
| Nova transacao                   |
|                                  |
| ( ) Receita   ( ) Despesa        |
| [ Titulo                      ]  |
| [ Valor                       ]  |
| [ Categoria                  v ] |
| [ Data                        ]  |
| [ Descricao opcional          ]  |
|                                  |
| [ Salvar transacao             ] |
+----------------------------------+
```

#### Cofrinhos

```text
+----------------------------------+
| Cofrinhos                     +  |
|                                  |
| Viagem internacional             |
| R$ 1.500,00 de R$ 5.000,00       |
| [==========------] 30%           |
| [ Aportar ]                      |
|                                  |
| Reserva de emergencia            |
| R$ 800,00 de R$ 3.000,00         |
| [=====-----------] 26%           |
| [ Aportar ]                      |
|                                  |
| Dashboard | Transacoes | Metas   |
+----------------------------------+
```

### Design Visual

O design visual da aplicacao movel segue a identidade definida para o PoupaBem na aplicacao web, mantendo consistencia entre plataformas.

Paleta de cores:

| Cor                    | Uso                                                     |
| ---------------------- | ------------------------------------------------------- |
| Verde escuro `#023020` | Cabecalhos, botoes principais e elementos de identidade |
| Verde medio `#3EB37C`  | Receitas, progresso positivo e confirmacoes             |
| Vermelho `#C53030`     | Despesas, alertas e acoes destrutivas                   |
| Off-white `#F5F7FA`    | Fundo geral da aplicacao                                |
| Branco `#FFFFFF`       | Cartoes, formularios e areas de conteudo                |

A tipografia deve usar fonte sans-serif, com boa leitura em telas pequenas. Valores monetarios terao maior peso visual, pois sao as informacoes mais consultadas pelo usuario.

Diretrizes de interface:

- Botoes principais com area de toque confortavel.
- Textos curtos e objetivos.
- Cards compactos para resumo financeiro e cofrinhos.
- Indicadores de carregamento nas consultas a API.
- Mensagens de erro claras em formularios e operacoes.
- Contraste adequado para leitura em ambientes externos.

## Fluxo de Dados

O aplicativo movel consumira a mesma API REST utilizada pelo front-end web. A base de comunicacao sera a API ASP.NET Core localizada no backend do projeto.

Fluxo de autenticacao:

1. O usuario informa e-mail e senha na tela de login.
2. O aplicativo envia `POST /api/auth/login`.
3. A API retorna `accessToken`, `refreshToken` e dados basicos do usuario.
4. O app armazena os tokens de forma segura no dispositivo.
5. As proximas requisicoes enviam o header `Authorization: Bearer {accessToken}`.
6. Em caso de sessao expirada, o app pode usar `POST /api/auth/refresh` ou redirecionar o usuario para login.

Fluxo de dados financeiros:

```text
Usuario
  -> App Mobile
    -> API PoupaBem
      -> Repositorios
        -> PostgreSQL
      <- Dados financeiros do usuario
    <- JSON
  <- Interface atualizada
```

Endpoints consumidos:

| Modulo | Endpoints |
| --- | --- |
| Autenticacao | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me` |
| Categorias | `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}` |
| Transacoes | `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/{id}`, `DELETE /api/transactions/{id}` |
| Cofrinhos | `GET /api/savings-goals`, `POST /api/savings-goals`, `PUT /api/savings-goals/{id}`, `POST /api/savings-goals/{id}/deposit`, `DELETE /api/savings-goals/{id}` |
| Relatorios | `GET /api/reports/summary`, `GET /api/reports/expenses-by-category`, `GET /api/reports/transactions-export` |

## Tecnologias Utilizadas

A implementacao mobile podera ser desenvolvida com React Native, mantendo proximidade com o ecossistema React ja utilizado no front-end web.

Tecnologias propostas:

| Tecnologia                             | Finalidade                                                  |
| -------------------------------------- | ----------------------------------------------------------- |
| React Native                           | Desenvolvimento da interface mobile multiplataforma         |
| Expo                                   | Ambiente de desenvolvimento, build e testes em dispositivos |
| React Navigation                       | Navegacao por abas e pilhas de telas                        |
| Axios ou Fetch API                     | Comunicacao HTTP com a API do PoupaBem                      |
| SecureStore ou AsyncStorage            | Armazenamento local de tokens e dados de sessao             |
| React Hook Form                        | Controle e validacao de formularios                         |
| Victory Native ou Recharts equivalente | Graficos e visualizacoes financeiras                        |

A escolha por React Native favorece reaproveitamento de conhecimento da equipe, pois o projeto web ja utiliza React, componentes reutilizaveis em conceito, consumo de APIs REST e gerenciamento de estado por contexto.

## Consideracoes de Seguranca

A aplicacao movel deve seguir os mesmos principios de seguranca definidos para o sistema web e backend, com atencao especial ao armazenamento local no dispositivo.

Medidas previstas:

- Uso de JWT para autenticar as requisicoes protegidas.
- Armazenamento seguro do token de acesso e refresh token.
- Remocao dos tokens ao realizar logout.
- Redirecionamento para login quando a API retornar `401 Unauthorized`.
- Validacao de formularios antes do envio para reduzir erros de entrada.
- Uso de HTTPS em ambiente de producao.
- Isolamento de dados por usuario garantido pelo backend.
- Exibicao de mensagens de erro sem revelar dados sensiveis.

Como o aplicativo manipula dados financeiros pessoais, nenhuma senha deve ser armazenada localmente. O app tambem nao deve registrar tokens ou dados sensiveis em logs.

## Implantacao

A implantacao da aplicacao movel devera considerar ambientes de desenvolvimento, homologacao e producao.

Passos previstos:

1. Configurar as variaveis de ambiente com a URL da API.
2. Validar a comunicacao com o backend em ambiente local.
3. Gerar builds de teste usando Expo ou ferramenta equivalente.
4. Testar o aplicativo em dispositivos Android e iOS, quando disponivel.
5. Ajustar permissoes e configuracoes de rede.
6. Gerar versao final para distribuicao conforme a plataforma escolhida.

Durante o desenvolvimento local, a API deve estar acessivel pelo dispositivo ou emulador. Em celulares fisicos, pode ser necessario usar o IP da maquina na rede local em vez de `localhost`.

## Testes

A estratégia de testes do front-end mobile combina **testes unitários** (utilitários, mapeamento de dados da API, módulos HTTP e componentes React Native isolados) com **testes manuais e exploratórios** em dispositivo ou emulador para fluxos completos de tela (login, cadastro, dashboard e navegação por abas). A suíte automatizada roda localmente via Jest e pode ser integrada a pipelines de CI.

Os requisitos funcionais (RF-001 a RF-010) e não funcionais (RNF-001 e RNF-002) definidos em [contexto.md](contexto.md) orientam a cobertura. Nesta etapa, a automação prioriza a **camada de integração com a API** e os **componentes reutilizáveis**, garantindo contrato estável com o backend ASP.NET Core antes de expandir testes de tela completas.

### Ferramentas

| Ferramenta | Função |
| --- | --- |
| [Jest](https://jestjs.io/) | Test runner e asserções |
| [jest-expo](https://docs.expo.dev/develop/unit-testing/) | Preset do Jest adaptado ao ecossistema Expo/React Native |
| [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/) | Renderização de componentes e interações (`fireEvent.press`) |
| [react-test-renderer](https://react.dev/reference/react-dom/test-utils) | Renderização de árvore React Native nos testes de componentes |
| `global.fetch` (mock) | Simulação de requisições HTTP no client sem rede real |

A configuração fica em [jest.config.js](../src/poupabem-mobile/jest.config.js) (`preset: jest-expo`, `setupFilesAfterEnv`, `testMatch` e `collectCoverageFrom`) e o setup global em [src/test/setup.js](../src/poupabem-mobile/src/test/setup.js), que executa `jest.clearAllMocks()` antes de cada teste.

### Como executar

```bash
cd src/poupabem-mobile
npm install
npm test              # execução única
npm run test:watch    # modo watch (desenvolvimento)
```

### Estrutura da suíte

Os testes ficam em `src/test/`, espelhando a estrutura do `src/`:

```
src/test/
├── setup.js                          # Limpeza de mocks entre testes
├── utils/
│   ├── format.test.js                # Formatação monetária (BRL)
│   └── mappers.test.js               # Conversão API ↔ mobile + enum TransactionType
├── api/
│   ├── client.test.js                # HTTP client (fetch), token, erros
│   ├── auth.test.js                  # login e register
│   ├── transactions.test.js          # listagem com filtros e criação
│   ├── savingsGoals.test.js          # metas, criação e aporte
│   └── reports.test.js               # resumo financeiro
├── components/
│   ├── BalanceCard.test.js           # Saldo no dashboard
│   ├── SummaryCard.test.js           # Cards de receitas/despesas
│   ├── TransactionItem.test.js       # Item de transação (sinal +/-)
│   ├── FilterChip.test.js            # Chips de filtro por tipo
│   ├── GoalCard.test.js              # Cofrinho com progresso e aporte
│   └── BottomNav.test.js             # Navegação por abas
└── screens/
    ├── LoginScreen.test.js           # Integração de login
    ├── SignUpScreen.test.js          # Integração de cadastro
    ├── DashboardScreen.test.js       # Integração do dashboard
    └── TransactionsScreen.test.js    # Integração de transações + modal
```

### Estratégia de mock

- **API client (`src/api/client.js`)**: os testes de `client.test.js` mockam `global.fetch` e validam montagem de URL (`API_BASE_URL`), query params, header `Authorization: Bearer`, body JSON, resposta `204` e propagação de `message` em erros HTTP.
- **Módulos de API (`src/api/*.js`)**: cada arquivo de teste faz `jest.mock('../../api/client')` e injeta `request` mockado, verificando método, path, token e payload.
- **Mapeadores (`src/utils/mappers.js`)**: testes isolados sem rede, com `jest.useFakeTimers()` em `toCreateTransactionRequest` para fixar `ocurredAt`.
- **Componentes**: renderizados com `@testing-library/react-native`; callbacks (`onChangeTab`, `onPress`, `onDeposit`) validados com `fireEvent.press`.
- **Telas (`src/screens/*.js`)**: cada teste de integração mocka os módulos de API consumidos pela tela (`jest.mock('../../api/auth')`, etc.) e controla as respostas, permitindo verificar caminho feliz, validações locais e tratamento de erros.

### Tipos de testes implementados

#### 1. Testes unitários — utilitários e contrato com o backend

- [`utils/format.test.js`](../src/poupabem-mobile/src/test/utils/format.test.js): valida `formatCurrency` para valores positivos, zero e negativos em real brasileiro.
- [`utils/mappers.test.js`](../src/poupabem-mobile/src/test/utils/mappers.test.js): valida `normalizeType`, `toMobileCategory`, `toMobileTransaction` (receita/despesa, fallback de categoria), `toCreateTransactionRequest` (payload Income/Expense) e `toMobileGoal`. O bloco `TransactionType` garante alinhamento com o backend (**Income=1, Expense=2**).

#### 2. Testes unitários — camada de API

Verificam que cada função da pasta `src/api/` envia a requisição correta e devolve o resultado esperado:

- [`api/auth.test.js`](../src/poupabem-mobile/src/test/api/auth.test.js): `POST /api/auth/login` e `POST /api/auth/register`.
- [`api/transactions.test.js`](../src/poupabem-mobile/src/test/api/transactions.test.js): `GET /api/transactions` com token e filtros (`categoryId`, `transactionType`); `POST /api/transactions` com payload completo.
- [`api/savingsGoals.test.js`](../src/poupabem-mobile/src/test/api/savingsGoals.test.js): listagem, criação de meta e `POST /api/savings-goals/{id}/deposit`.
- [`api/reports.test.js`](../src/poupabem-mobile/src/test/api/reports.test.js): `GET /api/reports/summary` com token.
- [`api/client.test.js`](../src/poupabem-mobile/src/test/api/client.test.js): GET com query string (ignorando params vazios), POST com body, DELETE `204`, erros da API e helper `extractErrorMessage`.

#### 3. Testes unitários — componentes

- [`BalanceCard.test.js`](../src/poupabem-mobile/src/test/components/BalanceCard.test.js): exibe label "SALDO ATUAL" e valor formatado em BRL.
- [`SummaryCard.test.js`](../src/poupabem-mobile/src/test/components/SummaryCard.test.js): renderiza receitas e despesas com helper textual.
- [`TransactionItem.test.js`](../src/poupabem-mobile/src/test/components/TransactionItem.test.js): sinal positivo para receitas e negativo para despesas.
- [`FilterChip.test.js`](../src/poupabem-mobile/src/test/components/FilterChip.test.js): label do filtro e callback `onPress` (base para RF-005 / filtros por tipo).
- [`GoalCard.test.js`](../src/poupabem-mobile/src/test/components/GoalCard.test.js): percentual, valores formatados, botão "Adicionar valor" e limite de 100% quando a meta é superada.
- [`BottomNav.test.js`](../src/poupabem-mobile/src/test/components/BottomNav.test.js): abas visíveis e troca para `transactions` via `onChangeTab`.

#### 4. Testes de integração — telas

Cada tela é renderizada com `@testing-library/react-native` e a API é mockada:

- [`screens/LoginScreen.test.js`](../src/poupabem-mobile/src/test/screens/LoginScreen.test.js): renderização dos campos, validação de campos vazios, login com sucesso (verifica callback `onLogin`) e exibição de erro do backend.
- [`screens/SignUpScreen.test.js`](../src/poupabem-mobile/src/test/screens/SignUpScreen.test.js): renderização dos campos, validações cliente (campos vazios, senhas diferentes via `Alert`), cadastro com sucesso (navegação para login) e tratamento de erro de e-mail duplicado.
- [`screens/DashboardScreen.test.js`](../src/poupabem-mobile/src/test/screens/DashboardScreen.test.js): saudação personalizada, valores formatados em BRL, listagem das últimas transações, mensagem de erro quando o backend falha, estado vazio dos cofrinhos e ação "Ver todas".
- [`screens/TransactionsScreen.test.js`](../src/poupabem-mobile/src/test/screens/TransactionsScreen.test.js): listagem, tratamento de erros de API, filtros por tipo e categoria, abertura do modal, validação de campos obrigatórios e valor inválido, e criação de transação via modal.

#### 5. Testes manuais, de segurança e de carga

| Tipo | Objetivo | Status |
| --- | --- | --- |
| Testes manuais | Navegação por abas, formulários, legibilidade e uso em dispositivo físico/emulador | Previsto na homologação |
| Testes de segurança | Logout, expiração de token (`401`), ausência de senha em storage local | Parcialmente coberto pelo contrato HTTP com `Authorization` em `client.test.js`; demais cenários manuais |
| Testes de carga | Desempenho do app sob muitas requisições simultâneas | Não aplicável ao client mobile nesta etapa; carga avaliada no backend ([backend-apis.md](backend-apis.md)) |

### Casos de teste por requisito

| ID | Requisito | Cenário | Tipo | Arquivo |
| --- | --- | --- | --- | --- |
| CT-MOB-01 | RF-001 | `registerUser` envia payload completo para `/api/auth/register` | Unitário | `api/auth.test.js` |
| CT-MOB-02 | RF-002 | `login` envia credenciais para `/api/auth/login` | Unitário | `api/auth.test.js` |
| CT-MOB-03 | RF-003 | `toCreateTransactionRequest` monta payload de receita (Income) | Unitário | `utils/mappers.test.js` |
| CT-MOB-04 | RF-004 | `toCreateTransactionRequest` monta payload de despesa com amount absoluto | Unitário | `utils/mappers.test.js` |
| CT-MOB-05 | RF-004 | `createTransaction` envia POST com token e body | Unitário | `api/transactions.test.js` |
| CT-MOB-06 | RF-005 | `toMobileTransaction` mapeia categoria e sinal da transação | Unitário | `utils/mappers.test.js` |
| CT-MOB-07 | RF-005 | `listTransactions` repassa filtros `categoryId` e `transactionType` | Unitário | `api/transactions.test.js` |
| CT-MOB-08 | RF-005 | `FilterChip` dispara `onPress` ao selecionar filtro | Unitário | `components/FilterChip.test.js` |
| CT-MOB-09 | RF-006 | `createGoal` envia POST para `/api/savings-goals` | Unitário | `api/savingsGoals.test.js` |
| CT-MOB-10 | RF-007 | `depositGoal` envia aporte em `/deposit` | Unitário | `api/savingsGoals.test.js` |
| CT-MOB-11 | RF-007 | `GoalCard` exibe progresso e aciona `onDeposit` | Unitário | `components/GoalCard.test.js` |
| CT-MOB-12 | RF-008 | `getSummary` consulta `/api/reports/summary` | Unitário | `api/reports.test.js` |
| CT-MOB-13 | RF-008 | `BalanceCard` e `SummaryCard` exibem valores formatados | Unitário | `components/BalanceCard.test.js`, `components/SummaryCard.test.js` |
| CT-MOB-14 | RF-009 | `TransactionItem` renderiza receita e despesa com formatação correta | Unitário | `components/TransactionItem.test.js` |
| CT-MOB-15 | RF-010 | Exclusão/edição de transação via UI | Manual / futuro | Telas (`TransactionsScreen`) |
| CT-MOB-16 | RNF-002 | Requisições autenticadas incluem `Authorization: Bearer` | Unitário | `api/client.test.js` |
| CT-MOB-17 | RNF-002 | Erros HTTP propagam `message` da API | Unitário | `api/client.test.js` |
| CT-MOB-18 | RNF-001 | Layout responsivo e navegação por abas | Unitário + Manual | `components/BottomNav.test.js` + dispositivo |
| CT-MOB-19 | — | Enum `TransactionType` alinhado ao backend | Unitário | `utils/mappers.test.js` |
| CT-MOB-20 | — | Contrato HTTP dos módulos `auth`, `transactions`, `savingsGoals`, `reports` | Unitário | `api/*.test.js` |
| CT-MOB-21 | — | Padronização de mensagens (`extractErrorMessage`) | Unitário | `api/client.test.js` |
| CT-MOB-22 | — | Formatação monetária em BRL (`formatCurrency`) | Unitário | `utils/format.test.js` |
| CT-MOB-23 | RF-002 | Login com sucesso repassa sessão via `onLogin` | Integração | `screens/LoginScreen.test.js` |
| CT-MOB-24 | RF-002 | Login com credenciais inválidas exibe erro | Integração | `screens/LoginScreen.test.js` |
| CT-MOB-25 | RF-001 | Cadastro bloqueado por senhas divergentes | Integração | `screens/SignUpScreen.test.js` |
| CT-MOB-26 | RF-001 | Cadastro com sucesso e navegação para login | Integração | `screens/SignUpScreen.test.js` |
| CT-MOB-27 | RF-008 | Exibir resumo financeiro no dashboard | Integração | `screens/DashboardScreen.test.js` |
| CT-MOB-28 | RF-009 | Listar últimas transações no dashboard | Integração | `screens/DashboardScreen.test.js` |
| CT-MOB-29 | RF-004 | Criar transação (despesa) via modal | Integração | `screens/TransactionsScreen.test.js` |
| CT-MOB-30 | RF-005 | Filtrar transações por tipo e categoria | Integração | `screens/TransactionsScreen.test.js` |
| CT-MOB-31 | RF-003 | Impedir envio do formulário com título vazio | Integração | `screens/TransactionsScreen.test.js` |
| CT-MOB-32 | — | Exibir mensagem de erro quando a listagem de transações falha | Integração | `screens/TransactionsScreen.test.js` |

### Resultado atual

Execução em 03/06/2026:

<img width="360" height="98" alt="image" src="https://github.com/user-attachments/assets/ed33b51c-8239-4706-83af-98306b7bd4bb" />

# Referencias

- Documentacao do projeto PoupaBem: `docs/contexto.md`
- Planejamento da API: `docs/backend-apis.md`
- Documentacao do front-end web: `docs/frontend-web.md`
- Codigo do backend ASP.NET Core: `backend/PoupaBem.API`
- Codigo do front-end web React: `src/poupabem-web`
- Codigo do front-end mobile Expo: `src/poupabem-mobile`
