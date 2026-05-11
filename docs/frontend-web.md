# Front-end Web

O PoupaBem é uma plataforma de gestão financeira pessoal focada em simplicidade, clareza e versatilidade. Seu principal objetivo é ajudar os usuários a organizarem suas finanças, monitorarem receitas e despesas com facilidade e alcançarem objetivos financeiros através da funcionalidade de "Cofrinhos". A aplicação visa proporcionar uma experiência de usuário (UX) fluida e intuitiva, entregando uma visão geral e instantânea da saúde financeira para permitir tomadas de decisão mais conscientes.

## Projeto da Interface Web

A interface web do PoupaBem foi projetada para ser limpa, moderna e orientada aos dados do usuário. Ela utiliza um layout de dashboard clássico e totalmente responsivo.

Layout:

Navegação Lateral (Sidebar): Uma barra lateral fixa à esquerda contém o logotipo e os links de navegação ("Dashboard", "Transações" e "Cofrinhos"). O estado ativo da rota é destacado visualmente. O rodapé da sidebar gerencia o perfil do usuário e a ação de logout.

Área de Conteúdo Principal: Ocupa a maior parte da tela, com um fundo off-white para contraste. No topo, há uma saudação dinâmica baseada no estado de autenticação e um botão primário de Call to Action ("+ Nova") para adicionar transações rapidamente.

Cards de Resumo: Componentes em formato de cards exibem informações-chave sintetizadas: "Saldo Atual", "Receitas" e "Despesas".

Visualização de Dados: Um componente de gráfico exibe a evolução do saldo ao longo do tempo.

Módulos de Acompanhamento: Um painel lateral lista os cofrinhos do usuário, utilizando barras de progresso alimentadas diretamente pelos dados calculados na interface.

Interações do Usuário (UI/UX): A aplicação prioriza a navegação sem recarregamento de página (Single Page Application). A criação de registros ocorre através de modais sobrepostos à tela atual, mantendo o contexto do usuário. O sistema emprega validações em tempo real nos formulários e fornece feedback visual imediato para ações de sucesso ou erro.

### Wireframes

O wireframe da página do Dashboard (tela principal) segue esta estrutura de componentes estruturais:

<img width="1134" height="689" alt="image" src="https://github.com/user-attachments/assets/65dc703a-a967-45c7-b985-c6fe3c625bfc" />


### Design Visual

Paleta de Cores: Focada na psicologia das cores financeiras e de acessibilidade.

Verde Escuro (#023020): Cor primária, utilizada na barra de navegação e em componentes de destaque (como o Saldo).

Verde Médio (#3EB37C): Cor semântica de sucesso, usada para receitas, gráficos de crescimento e barras de progresso concluídas.

Vermelho (#C53030): Cor semântica de alerta, reservada estritamente para despesas e ações destrutivas na interface (como exclusão de registros).

Off-White (#F5F7FA) e Branco (#FFFFFF): Utilizados para fundos estruturais e cards, garantindo alto contraste com os textos e componentes coloridos.

Tipografia: Uso exclusivo de fontes sans-serif limpas (como Inter ou Roboto) para garantir a legibilidade de dados numéricos e tabelas.

Composição Visual: A interface abusa de espaços em branco (respiro visual) e cantos arredondados suaves (border-radius) para criar um ambiente menos burocrático e mais amigável. Sombras sutis (box-shadow) são aplicadas para criar profundidade e hierarquia entre o fundo e os cards de dados.

## Fluxo de Dados

O gerenciamento de dados na interface segue o ciclo de vida e a reatividade de uma Single Page Application (SPA):

Autenticação e Sessão: O usuário realiza login. O front-end captura o token de acesso, armazena-o no localStorage do navegador e inicializa o contexto global de usuário (AuthContext).

Navegação e Requisição (Mounting): Ao acessar uma rota protegida (como o Dashboard), os componentes são montados na tela e disparam requisições assíncronas via HTTP (utilizando Fetch API ou biblioteca equivalente) para consumir os endpoints do back-end. Enquanto aguarda a resposta, a interface exibe indicadores de carregamento (loaders ou skeletons).

Gerenciamento de Estado: Os dados JSON recebidos são armazenados no estado local dos componentes ou em contextos globais. Funções utilitárias do front-end formatam valores brutos (ex: convertendo "5000" para "R$ 5.000,00").

Reatividade (Renderização): O React reage às mudanças de estado e desenha a interface na tela, populando os gráficos, tabelas e barras de progresso.

Ações do Usuário (Mutation): Quando o usuário preenche o formulário de "Nova Transação" e clica em salvar, o front-end valida os dados em tela e envia um POST para a API. Em caso de sucesso, o estado da aplicação é atualizado e o React re-renderiza apenas os componentes necessários (como os valores totais dos cards), sem a necessidade de atualizar a página inteira.

## Tecnologias Utilizadas

A pilha tecnológica está concentrada em ferramentas modernas de desenvolvimento Web:

Ecossistema Front-end:

React.js: Biblioteca principal para construção da interface de usuário em componentes.

Vite: Ferramenta de build para um empacotamento rápido e otimizado da aplicação.

React Router: Gerenciamento de rotas e navegação do lado do cliente (SPA).

Context API: Gerenciamento de estado global e compartilhamento de dados (ex: dados do usuário logado e temas).

Consumo de Dados: Requisições HTTP baseadas em Promises para comunicação com a API RESTful do sistema.

Qualidade e Testes de Interface:

Jest e React Testing Library: Para testes unitários de componentes (ex: botões, formatações) e testes de integração de páginas (com API mockada).

Playwright: Para testes de regressão visual, garantindo a integridade do layout do dashboard e modais.

## Considerações de Segurança

Embora o back-end seja o principal responsável pela segurança e integridade dos dados, a interface web implementa diversas camadas de proteção para garantir uma navegação segura e mitigar vulnerabilidades no lado do cliente (navegador):

Autenticação e Gerenciamento de Sessão: A aplicação utiliza tokens JWT (JSON Web Tokens) para controle de sessão. O token recebido após o login é armazenado no localStorage (ou sessionStorage). O contexto global (AuthContext) monitora a presença e a validade desse token para manter o usuário logado.

Autorização e Proteção de Rotas: O sistema de roteamento (React Router) implementa Protected Routes (Rotas Protegidas). Se um usuário tentar acessar diretamente a URL do Dashboard ou qualquer outra página interna sem um token válido, a interface intercepta a navegação e o redireciona automaticamente para a tela de Login (/login), impedindo o acesso não autorizado à interface.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

A estratégia de testes do front-end web combina **testes unitários** (funções utilitárias, módulos da camada de API e componentes isolados) e **testes de integração** (páginas completas com a camada de API mockada e roteamento simulado), todos automatizados e executados localmente e em CI.

### Ferramentas

| Ferramenta | Função |
| --- | --- |
| [Vitest](https://vitest.dev/) | Test runner com API compatível com Jest, integrado ao Vite |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | Renderização de componentes e queries acessíveis |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) | Simulação realista de interações do usuário (clique, digitação, seleção) |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Matchers semânticos (`toBeInTheDocument`, `toHaveAttribute`, etc.) |
| [jsdom](https://github.com/jsdom/jsdom) | Ambiente DOM virtual para execução headless |

A configuração fica em [vite.config.js](../src/poupabem-web/vite.config.js) (`environment: 'jsdom'` + `setupFiles`) e o setup global em [src/test/setup.js](../src/poupabem-web/src/test/setup.js), que limpa `localStorage`, mocka `window.confirm`, `window.alert` e `URL.createObjectURL` entre testes.

### Como executar

```bash
cd src/poupabem-web
npm install
npm test            # modo watch (desenvolvimento)
npm test -- --run   # execução única (CI)
```

### Estrutura da suíte

Os testes ficam em `src/test/`, espelhando a estrutura do `src/`:

```
src/test/
├── setup.js                       # Hooks globais (cleanup, mocks de window)
├── utils/renderWithProviders.jsx  # Helper: renderiza com Router + AuthProvider
├── format.test.js                 # Utilitários de formatação
├── AuthContext.test.jsx           # Contexto de autenticação
├── api/
│   ├── client.test.js             # extractError + contrato do client Axios
│   ├── auth.test.js               # login, register, refresh, me
│   ├── categories.test.js         # CRUD de categorias
│   ├── transactions.test.js       # CRUD + filtros
│   ├── savingsGoals.test.js       # CRUD + aporte
│   └── reports.test.js            # summary, expenses-by-category, exportCSV
├── components/
│   ├── ProtectedRoute.test.jsx    # Redirecionamento por sessão
│   ├── Sidebar.test.jsx           # Navegação, perfil, logout, item ativo
│   └── Layout.test.jsx            # Sidebar + Outlet
└── pages/
    ├── Login.test.jsx             # Integração de Login
    ├── Cadastro.test.jsx          # Integração de Cadastro
    ├── Dashboard.test.jsx         # Integração de Dashboard
    ├── Transacoes.test.jsx        # Integração de Transações + modal
    └── Cofrinhos.test.jsx         # Integração de Cofrinhos + modais
```

### Estratégia de mock

- **API client (`src/api/client.js`)**: cada arquivo de teste de módulo de API faz `vi.mock('../../api/client')` e injeta um objeto `api` com `get/post/put/delete` mockados, validando URL, payload e parâmetros enviados.
- **Páginas**: cada teste de página mocka os módulos de API consumidos por ela (`vi.mock('../../api/transactions')`, etc.) e controla as respostas, permitindo verificar tanto o caminho feliz quanto o tratamento de erros.
- **Recharts**: o `ResponsiveContainer` é substituído por um wrapper com dimensões fixas no teste do Dashboard, contornando a falta de medição de layout no jsdom.
- **`localStorage`** é fornecido nativamente pelo jsdom e limpo a cada teste no `setup.js`.

### Tipos de testes implementados

#### 1. Testes unitários — utilitários e contrato com o backend

[src/test/format.test.js](../src/poupabem-web/src/test/format.test.js): valida `formatCurrency`, `formatDate`, `getInitials` e garante que o enum `TransactionType` permanece **alinhado ao enum `TransactionType` do backend** (Income=1, Expense=2). Esse teste protege contra divergências de contrato.

#### 2. Testes unitários — camada de API

Verificam que cada função da pasta `src/api/` envia o método HTTP correto, a URL exata, o corpo esperado e devolve `data`:

- [`api/auth.test.js`](../src/poupabem-web/src/test/api/auth.test.js)
- [`api/categories.test.js`](../src/poupabem-web/src/test/api/categories.test.js)
- [`api/transactions.test.js`](../src/poupabem-web/src/test/api/transactions.test.js)
- [`api/savingsGoals.test.js`](../src/poupabem-web/src/test/api/savingsGoals.test.js)
- [`api/reports.test.js`](../src/poupabem-web/src/test/api/reports.test.js) (inclui o caso de `exportTransactionsCsv` que cria um `Blob` e dispara o download)
- [`api/client.test.js`](../src/poupabem-web/src/test/api/client.test.js) cobre o helper `extractError`, garantindo a precedência `data.message → data.title → err.message → "Erro inesperado"`.

#### 3. Testes unitários — componentes

- [`ProtectedRoute.test.jsx`](../src/poupabem-web/src/test/components/ProtectedRoute.test.jsx): redireciona para `/login` quando não há usuário e renderiza o filho quando há.
- [`Sidebar.test.jsx`](../src/poupabem-web/src/test/components/Sidebar.test.jsx): exibe os links principais, mostra nome/email/iniciais do usuário, marca o item ativo e o botão "Sair" limpa o `localStorage`.
- [`Layout.test.jsx`](../src/poupabem-web/src/test/components/Layout.test.jsx): renderiza a sidebar junto com o `Outlet` da rota filha.

#### 4. Testes de integração — contexto de autenticação

[`AuthContext.test.jsx`](../src/poupabem-web/src/test/AuthContext.test.jsx): inicia sem usuário, hidrata a partir do `localStorage` e o `logout()` reseta estado e storage.

#### 5. Testes de integração — páginas

Cada página é renderizada com Router + `AuthProvider` e a API é mockada:

- [`pages/Login.test.jsx`](../src/poupabem-web/src/test/pages/Login.test.jsx): renderização dos campos, login com sucesso (verifica persistência no `localStorage`) e exibição de erro do backend.
- [`pages/Cadastro.test.jsx`](../src/poupabem-web/src/test/pages/Cadastro.test.jsx): validações cliente (senhas diferentes, senha curta, termos não aceitos), cadastro com sucesso e tratamento de erro de e-mail duplicado.
- [`pages/Dashboard.test.jsx`](../src/poupabem-web/src/test/pages/Dashboard.test.jsx): saudação personalizada, valores formatados em BRL, listagem das últimas transações, mensagem de erro quando o backend falha e estado vazio dos cofrinhos.
- [`pages/Transacoes.test.jsx`](../src/poupabem-web/src/test/pages/Transacoes.test.jsx): listagem, filtro por tipo, filtro por categoria, exclusão com `confirm`, exportação de CSV, criação de transação via modal, validação de valor inválido e criação de categoria inline.
- [`pages/Cofrinhos.test.jsx`](../src/poupabem-web/src/test/pages/Cofrinhos.test.jsx): listagem com progresso, total guardado, estado vazio, criação de cofrinho via modal, validação de valor inválido, aporte e exclusão.

### Casos de teste por requisito

| ID | Requisito | Cenário | Tipo | Arquivo |
| --- | --- | --- | --- | --- |
| CT-WEB-01 | RF-001 | Cadastro com payload válido | Integração | `pages/Cadastro.test.jsx` |
| CT-WEB-02 | RF-001 | Cadastro bloqueado por senhas divergentes | Integração | `pages/Cadastro.test.jsx` |
| CT-WEB-03 | RF-001 | Cadastro bloqueado por senha curta | Integração | `pages/Cadastro.test.jsx` |
| CT-WEB-04 | RF-001 | Cadastro bloqueado por termos não aceitos | Integração | `pages/Cadastro.test.jsx` |
| CT-WEB-05 | RF-001 | E-mail duplicado retornado pelo backend | Integração | `pages/Cadastro.test.jsx` |
| CT-WEB-06 | RF-002 | Login com sucesso e persistência da sessão | Integração | `pages/Login.test.jsx` |
| CT-WEB-07 | RF-002 | Login com credenciais inválidas | Integração | `pages/Login.test.jsx` |
| CT-WEB-08 | RF-003 / RF-004 | Criar transação (despesa) via modal | Integração | `pages/Transacoes.test.jsx` |
| CT-WEB-09 | RF-005 | Criar nova categoria inline a partir do modal | Integração | `pages/Transacoes.test.jsx` |
| CT-WEB-10 | RF-005 | Filtrar transações por categoria | Integração | `pages/Transacoes.test.jsx` |
| CT-WEB-11 | RF-006 | Criar cofrinho via modal | Integração | `pages/Cofrinhos.test.jsx` |
| CT-WEB-12 | RF-006 | Validação de valor de meta inválido | Integração | `pages/Cofrinhos.test.jsx` |
| CT-WEB-13 | RF-007 | Aportar valor em um cofrinho existente | Integração | `pages/Cofrinhos.test.jsx` |
| CT-WEB-14 | RF-008 | Exibir resumo financeiro no dashboard | Integração | `pages/Dashboard.test.jsx` |
| CT-WEB-15 | RF-008 | Exportar transações em CSV | Unitário + Integração | `api/reports.test.js`, `pages/Transacoes.test.jsx` |
| CT-WEB-16 | RF-009 | Listar últimas transações no dashboard | Integração | `pages/Dashboard.test.jsx` |
| CT-WEB-17 | RF-010 | Excluir transação após confirmação | Integração | `pages/Transacoes.test.jsx` |
| CT-WEB-18 | RF-010 | Excluir cofrinho após confirmação | Integração | `pages/Cofrinhos.test.jsx` |
| CT-WEB-19 | RNF-002 | Rotas protegidas redirecionam usuário sem sessão | Unitário | `components/ProtectedRoute.test.jsx` |
| CT-WEB-20 | RNF-002 | Logout limpa sessão e tokens | Unitário | `components/Sidebar.test.jsx`, `AuthContext.test.jsx` |
| CT-WEB-21 | — | Compatibilidade do enum `TransactionType` com o backend | Unitário | `format.test.js` |
| CT-WEB-22 | — | Contrato HTTP de cada módulo da camada de API | Unitário | `api/*.test.js` |
| CT-WEB-23 | — | Padronização de mensagens de erro (`extractError`) | Unitário | `api/client.test.js` |

### Resultado atual

Execução em 09/05/2026:

<img width="1066" height="430" alt="image" src="https://github.com/user-attachments/assets/462f5e23-a74f-4135-8654-b36d9a227e73" />

A suíte cobre os 10 requisitos funcionais (RF-001 a RF-010) e o requisito não funcional de segurança (RNF-002) na perspectiva do front-end web.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
