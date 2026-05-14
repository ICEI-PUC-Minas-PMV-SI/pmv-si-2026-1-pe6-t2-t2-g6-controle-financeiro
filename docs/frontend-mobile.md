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

| Cor | Uso |
| --- | --- |
| Verde escuro `#023020` | Cabecalhos, botoes principais e elementos de identidade |
| Verde medio `#3EB37C` | Receitas, progresso positivo e confirmacoes |
| Vermelho `#C53030` | Despesas, alertas e acoes destrutivas |
| Off-white `#F5F7FA` | Fundo geral da aplicacao |
| Branco `#FFFFFF` | Cartoes, formularios e areas de conteudo |

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

| Tecnologia | Finalidade |
| --- | --- |
| React Native | Desenvolvimento da interface mobile multiplataforma |
| Expo | Ambiente de desenvolvimento, build e testes em dispositivos |
| React Navigation | Navegacao por abas e pilhas de telas |
| Axios ou Fetch API | Comunicacao HTTP com a API do PoupaBem |
| SecureStore ou AsyncStorage | Armazenamento local de tokens e dados de sessao |
| React Hook Form | Controle e validacao de formularios |
| Victory Native ou Recharts equivalente | Graficos e visualizacoes financeiras |

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

A estrategia de testes da aplicacao movel deve cobrir tanto a experiencia do usuario quanto a integracao com a API.

Tipos de teste:

| Tipo | Objetivo |
| --- | --- |
| Testes unitarios | Validar funcoes utilitarias, formatacao de valores, validacoes e componentes isolados |
| Testes de integracao | Verificar login, cadastro, listagem de transacoes, criacao de cofrinhos e consumo da API mockada |
| Testes manuais | Conferir navegacao, responsividade, legibilidade e fluxo real em dispositivo movel |
| Testes de seguranca | Validar logout, expiracao de sessao, rotas protegidas e ausencia de dados sensiveis em logs |

Casos de teste iniciais:

| ID | Cenario | Resultado esperado |
| --- | --- | --- |
| CT-MOB-01 | Login com credenciais validas | Usuario acessa o dashboard |
| CT-MOB-02 | Login com credenciais invalidas | App exibe mensagem de erro |
| CT-MOB-03 | Cadastro com senha fraca | App bloqueia envio e orienta o usuario |
| CT-MOB-04 | Criar despesa com categoria valida | Transacao aparece na listagem |
| CT-MOB-05 | Criar receita com categoria valida | Saldo do dashboard e atualizado |
| CT-MOB-06 | Filtrar transacoes por tipo | Lista exibe apenas receitas ou despesas |
| CT-MOB-07 | Criar cofrinho | Novo cofrinho aparece na tela de metas |
| CT-MOB-08 | Realizar aporte em cofrinho | Progresso percentual e atualizado |
| CT-MOB-09 | Encerrar sessao | Tokens sao removidos e usuario volta ao login |
| CT-MOB-10 | Acessar rota protegida sem token | App redireciona para login |

# Referencias

- Documentacao do projeto PoupaBem: `docs/contexto.md`
- Planejamento da API: `docs/backend-apis.md`
- Documentacao do front-end web: `docs/frontend-web.md`
- Codigo do backend ASP.NET Core: `backend/PoupaBem.API`
- Codigo do front-end web React: `src/poupabem-web`
