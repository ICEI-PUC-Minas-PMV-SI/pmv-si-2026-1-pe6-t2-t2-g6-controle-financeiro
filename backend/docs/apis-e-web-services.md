# APIs e Web Services

O planejamento de uma aplicação de APIs Web é uma etapa fundamental para o sucesso do projeto. Ao planejar adequadamente, é possível reduzir riscos de retrabalho e garantir uma API mais segura, escalável e eficiente.

O projeto PoupaBem é um sistema web de organização financeira pessoal. O backend atual foi implementado em ASP.NET Core, com foco em cadastro e autenticação de usuários, registro de receitas e despesas, categorização de transações, metas de economia (cofrinhos virtuais) e relatórios financeiros.

A solução está organizada em camadas (Domain, Application, Infrastructure e API), com uma única API backend consolidando os módulos de negócio.

## Objetivos da API

Objetivo geral da API:
- Disponibilizar endpoints REST para suportar as funcionalidades principais do PoupaBem com autenticação segura, isolamento de dados por usuário e operações financeiras do dia a dia.

Objetivos específicos da API:
- Permitir cadastro, login, refresh de token e consulta do usuário autenticado.
- Permitir CRUD de categorias financeiras por usuário.
- Permitir CRUD de transações (receitas e despesas), com filtros por período, categoria e tipo.
- Permitir CRUD de metas de economia (cofrinhos) e registro de aportes.
- Disponibilizar relatórios de resumo financeiro, despesas por categoria e exportação de transações em CSV.
- Garantir validação de dados de entrada e padronização de erros em tempo de execução.

## Modelagem da Aplicação

### Arquitetura lógica (estado atual)

- Domain:
  - Entidades e regras de negócio centrais.
  - Entidades principais: Category, Transaction, SavingsGoal.
  - Enum principal: TransactionType (Income, Expense).
- Application:
  - DTOs de entrada e saída.
  - Interfaces de repositórios e serviços de segurança.
- Infrastructure:
  - Persistência com EF Core + PostgreSQL.
  - Implementação dos repositórios.
  - Integração com ASP.NET Identity e JWT.
- API:
  - Controllers REST, middleware global de exceção e pipeline HTTP.

### Estrutura de dados principal

- Usuário (ApplicationUser)
  - Campos relevantes: FirstName, LastName, Email, PasswordHash, RefreshToken, RefreshTokenExpiryTime, IsActive.
- Categoria (Category)
  - Campos: Id, Name, Type, UserId (nullable), CreatedAt.
- Transação (Transaction)
  - Campos: Id, Title, Description, Amount, TransactionType, CategoryId, UserId, OcurredAt, CreatedAt, UpdatedAt.
- Meta de economia (SavingsGoal)
  - Campos: Id, UserId, Name, TargetAmount, CurrentAmount, CreatedAt, UpdatedAt.

### Relacionamentos

- Um usuário possui várias categorias próprias.
- Um usuário possui várias transações.
- Uma categoria pode estar ligada a várias transações.
- Um usuário possui várias metas de economia.
- Exclusão de categoria em uso por transações é bloqueada por regra de negócio.

### Observações de modelagem

- A API usa validações em dois níveis:
  - DTOs com DataAnnotations (camada de entrada).
  - Entidades de domínio com regras no construtor e métodos de atualização.
- O isolamento de dados por usuário é aplicado nos repositórios e controllers.

## Tecnologias Utilizadas

Backend e arquitetura:
- C#
- ASP.NET Core Web API
- Arquitetura em camadas (Domain, Application, Infrastructure, API)

Persistência e dados:
- Entity Framework Core
- Npgsql (PostgreSQL provider)
- PostgreSQL 16 (container local via Docker Compose)
- ASP.NET Core Identity

Segurança:
- JWT Bearer Authentication
- Refresh Token
- Autorização com [Authorize]

Documentação e desenvolvimento:
- Swagger / OpenAPI
- Docker Compose
- Git e GitHub

Testes e CI:
- xUnit
- Moq
- Microsoft.AspNetCore.Mvc.Testing
- Microsoft.EntityFrameworkCore.InMemory
- Coverlet (collector)
- GitHub Actions

## API Endpoints

Base URL (desenvolvimento):
- https://localhost:{porta}/api

Padrão de autenticação:
- Endpoints protegidos exigem header Authorization: Bearer {access_token}.

Padrão de erros:
- Erros de regra de negócio e exceções tratadas pelo middleware global retornam JSON no formato:

```json
{
  "statusCode": 400,
  "error": "business_error",
  "message": "Mensagem de erro",
  "details": null,
  "timestamp": "2026-04-09T12:00:00Z"
}
```

- Erros de validação de modelo (DataAnnotations com [ApiController]) retornam 400 no formato ValidationProblemDetails.

### 1) Autenticação

#### Endpoint 1.1 - Registrar usuário
- Método: POST
- URL: /auth/register
- Autenticação: Não
- Body:
  - firstName: string (2-15)
  - lastName: string (2-20)
  - email: string (email válido)
  - password: string (8-100)
  - confirmPassword: string (igual a password)
- Resposta:
  - Sucesso (200 OK)

```json
{
  "accessToken": "jwt",
  "expiresAt": "2026-04-09T13:00:00Z",
  "refreshToken": "token",
  "userId": "guid",
  "email": "user@email.com",
  "fullName": "Nome Sobrenome"
}
```

  - Erro (400)
    - Validação de entrada
    - Regra de negócio (email duplicado, senhas diferentes)

#### Endpoint 1.2 - Login
- Método: POST
- URL: /auth/login
- Autenticação: Não
- Body:
  - email: string
  - password: string
- Resposta:
  - Sucesso (200 OK): AuthResponse
  - Erro (400/401)

#### Endpoint 1.3 - Refresh token
- Método: POST
- URL: /auth/refresh
- Autenticação: Não
- Body:
  - refreshToken: string (mínimo 10)
- Resposta:
  - Sucesso (200 OK): AuthResponse
  - Erro (400/401)

#### Endpoint 1.4 - Usuário autenticado
- Método: GET
- URL: /auth/me
- Autenticação: Sim
- Parâmetros: nenhum
- Resposta:
  - Sucesso (200 OK)

```json
{
  "userId": "guid",
  "email": "user@email.com",
  "userName": "user@email.com",
  "claims": [
    { "type": "sub", "value": "guid" }
  ]
}
```

### 2) Categorias

#### Endpoint 2.1 - Criar categoria
- Método: POST
- URL: /categories
- Autenticação: Sim
- Body:
  - name: string (2-100)
  - type: enum (Income ou Expense)
- Resposta:
  - Sucesso (200 OK)

```json
{
  "id": "guid",
  "name": "Alimentação",
  "type": "Expense"
}
```

  - Erro (400)
    - Nome duplicado para o mesmo usuário

#### Endpoint 2.2 - Listar categorias do usuário
- Método: GET
- URL: /categories
- Autenticação: Sim
- Parâmetros: nenhum
- Resposta:
  - Sucesso (200 OK): lista de CategoryResponse

#### Endpoint 2.3 - Atualizar categoria
- Método: PUT
- URL: /categories/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid (route)
- Body:
  - name: string
  - type: enum
- Resposta:
  - Sucesso (200 OK): CategoryResponse
  - Erro (400/404)

#### Endpoint 2.4 - Excluir categoria
- Método: DELETE
- URL: /categories/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid (route)
- Resposta:
  - Sucesso (204 No Content)
  - Erro (400)
    - Quando existir transação vinculada à categoria

### 3) Transações Financeiras

#### Endpoint 3.1 - Criar transação
- Método: POST
- URL: /transactions
- Autenticação: Sim
- Body:
  - title: string (2-150)
  - description: string opcional (max 500)
  - amount: decimal (> 0)
  - transactionType: enum (Income ou Expense)
  - categoryId: guid (obrigatório)
  - ocurredAt: datetime
- Resposta:
  - Sucesso (200 OK)

```json
{
  "id": "guid",
  "title": "Salário",
  "description": "Pagamento mensal",
  "amount": 4500.00,
  "transactionType": "Income",
  "categoryId": "guid",
  "ocurredAt": "2026-04-01T10:00:00Z"
}
```

  - Erro (400)
    - Categoria inexistente ou sem permissão
    - Tipo da transação diferente do tipo da categoria

#### Endpoint 3.2 - Listar transações com filtros
- Método: GET
- URL: /transactions
- Autenticação: Sim
- Query params (todos opcionais):
  - fromUtc: datetime
  - toUtc: datetime
  - categoryId: guid
  - transactionType: enum
- Resposta:
  - Sucesso (200 OK): lista de TransactionResponse ordenada por ocurredAt desc

#### Endpoint 3.3 - Atualizar transação
- Método: PUT
- URL: /transactions/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid (route)
- Body: UpdateTransactionRequest
- Resposta:
  - Sucesso (200 OK): TransactionResponse
  - Erro (400/404)

#### Endpoint 3.4 - Excluir transação
- Método: DELETE
- URL: /transactions/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid (route)
- Resposta:
  - Sucesso (204 No Content)
  - Erro (400/404)

### 4) Metas Financeiras (Cofrinhos)

#### Endpoint 4.1 - Criar meta
- Método: POST
- URL: /savings-goals
- Autenticação: Sim
- Body:
  - name: string (2-120)
  - targetAmount: decimal (> 0)
- Resposta:
  - Sucesso (200 OK): SavingsGoalResponse

#### Endpoint 4.2 - Listar metas
- Método: GET
- URL: /savings-goals
- Autenticação: Sim
- Resposta:
  - Sucesso (200 OK): lista de SavingsGoalResponse

#### Endpoint 4.3 - Obter meta por id
- Método: GET
- URL: /savings-goals/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid
- Resposta:
  - Sucesso (200 OK): SavingsGoalResponse
  - Erro (400/404)

#### Endpoint 4.4 - Atualizar meta
- Método: PUT
- URL: /savings-goals/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid
- Body:
  - name: string
  - targetAmount: decimal
- Resposta:
  - Sucesso (200 OK): SavingsGoalResponse

#### Endpoint 4.5 - Registrar aporte em meta
- Método: POST
- URL: /savings-goals/{id}/deposit
- Autenticação: Sim
- Parâmetros:
  - id: guid
- Body:
  - amount: decimal (> 0)
- Resposta:
  - Sucesso (200 OK): SavingsGoalResponse com currentAmount e progressPercent atualizados

#### Endpoint 4.6 - Excluir meta
- Método: DELETE
- URL: /savings-goals/{id}
- Autenticação: Sim
- Parâmetros:
  - id: guid
- Resposta:
  - Sucesso (204 No Content)

### 5) Relatórios

#### Endpoint 5.1 - Resumo financeiro
- Método: GET
- URL: /reports/summary
- Autenticação: Sim
- Query params opcionais:
  - fromUtc: datetime
  - toUtc: datetime
- Resposta:
  - Sucesso (200 OK)

```json
{
  "totalIncome": 6500.00,
  "totalExpense": 3200.00,
  "balance": 3300.00
}
```

#### Endpoint 5.2 - Despesas por categoria
- Método: GET
- URL: /reports/expenses-by-category
- Autenticação: Sim
- Query params opcionais:
  - fromUtc: datetime
  - toUtc: datetime
- Resposta:
  - Sucesso (200 OK)

```json
[
  {
    "categoryId": "guid",
    "categoryName": "Alimentação",
    "totalAmount": 1200.50
  }
]
```

#### Endpoint 5.3 - Exportar transações em CSV
- Método: GET
- URL: /reports/transactions-export
- Autenticação: Sim
- Query params opcionais:
  - fromUtc: datetime
  - toUtc: datetime
  - categoryId: guid
  - transactionType: enum
- Resposta:
  - Sucesso (200 OK)
  - Content-Type: text/csv; charset=utf-8
  - Download de arquivo: transacoes_yyyyMMdd_HHmmss.csv

## Considerações de Segurança

Aspectos implementados:
- Autenticação com JWT Bearer.
- Refresh token armazenado por usuário com expiração.
- ASP.NET Identity para gestão de usuários e senha com regras fortes:
  - mínimo 8 caracteres
  - exige maiúscula, minúscula, número e caractere especial
- Lockout por tentativas falhas:
  - 5 tentativas
  - bloqueio de 15 minutos
- Isolamento de dados por usuário autenticado em consultas e comandos.
- Middleware global para tratamento de exceções e padronização de erros.
- HTTPS redirection no pipeline HTTP.

## Implantação

Fluxo atual de implantação:

1. Definir requisitos de ambiente:
   - .NET SDK 10.0
   - Docker e Docker Compose
   - PostgreSQL 16 (local com compose ou gerenciado em nuvem)
2. Provisionar banco de dados PostgreSQL.
3. Configurar variáveis de ambiente da API:
   - ConnectionStrings__DefaultConnection
   - Jwt__Issuer
   - Jwt__Audience
   - Jwt__SecretKey
   - Jwt__AccessTokenExpirationMinutes
   - Jwt__RefreshTokenExpirationDays
4. Aplicar migrations do EF Core no ambiente alvo.
5. Publicar a API e iniciar o serviço.
6. Executar smoke tests de autenticação e endpoints principais.

Exemplo de ambiente local:

```bash
docker compose up -d
dotnet restore PoupaBem.API.slnx
dotnet build PoupaBem.API.slnx
dotnet test PoupaBem.API.slnx
```

Observações de estado atual:
- O repositório possui docker-compose para banco PostgreSQL.
- O pipeline de CI (GitHub Actions) já executa restore, build e testes automatizados com PostgreSQL em serviço.

## Testes

A estratégia de testes foi estruturada para cobrir requisitos funcionais (RF) e não funcionais (RNF), combinando validações automatizadas e manuais.

Foram criados casos de teste para validar:
- Fluxos de negócio principais (cadastro, autenticação, transações, categorias, metas e relatórios).
- Regras de consistência de dados e segurança.
- Comportamento da aplicação sob carga.
- Experiência de uso em cenários reais (testes manuais).

### Tipos de testes adotados

1. Testes unitários
   - Objetivo: validar regras de negócio isoladas em entidades, serviços e componentes internos.
   - Exemplo: impedir criação de transação com valor menor ou igual a zero.
   - Resultado esperado: exceção de regra de negócio e retorno adequado no fluxo da API.

2. Testes de integração
   - Objetivo: validar a comunicação entre camadas (API, repositórios e banco).
   - Exemplo: criar categoria, lançar transação nessa categoria e consultar no relatório.
   - Resultado esperado: dados persistidos corretamente e retorno consistente entre endpoints.

3. Testes de ponta a ponta (E2E)
   - Objetivo: validar o fluxo completo do usuário da autenticação até os relatórios.
   - Exemplo: registrar usuário, fazer login, criar transação de despesa, consultar resumo financeiro e exportar CSV.
   - Resultado esperado: fluxo completo executado sem falhas, respeitando autenticação e autorização.

4. Testes de carga e desempenho
   - Objetivo: avaliar estabilidade, tempo de resposta e taxa de erro com múltiplas requisições simultâneas.
   - Exemplo de cenário de carga:
     - 100 usuários virtuais simultâneos por 10 minutos consumindo endpoints de transações e relatórios.
   - Exemplo de cenário de pico:
     - rampa de 20 para 200 usuários em 2 minutos no endpoint de login.
   - Métricas observadas:
     - latência média e percentis (p95/p99)
     - throughput (req/s)
     - taxa de erro (%)
   - Critério de aceitação (exemplo): p95 abaixo de 3 segundos e taxa de erro abaixo de 1%.

5. Testes manuais e exploratórios
   - Objetivo: validar usabilidade, mensagens de erro, consistência visual e cenários não cobertos por automação.
   - Exemplo: tentativa de excluir categoria com transações vinculadas e validação da mensagem retornada.
   - Exemplo: uso do sistema com dados limítrofes (valores muito baixos, períodos longos, nomes extensos).

6. Testes de regressão e smoke
   - Objetivo: garantir que novas alterações não quebrem funcionalidades já validadas.
   - Exemplo smoke: login, criação de transação e consulta de resumo.
   - Exemplo regressão: reexecutar suíte de cenários críticos após ajustes em autenticação.

### Exemplos de casos de teste para requisitos funcionais e não funcionais

#### Casos funcionais (RF)

1. CT-RF-001 - Cadastro de usuário
   - Requisito: RF-001
   - Dado: payload válido com nome, email e senha
   - Quando: enviar POST /auth/register
   - Então: retornar 200 e tokens de acesso/refresh

2. CT-RF-004 - Registro de despesa
   - Requisito: RF-004
   - Dado: categoria do tipo Expense e valor positivo
   - Quando: enviar POST /transactions
   - Então: retornar 200 e gravar despesa para o usuário autenticado

3. CT-RF-010 - Edição e exclusão de transação
   - Requisito: RF-010
   - Dado: transação existente do próprio usuário
   - Quando: enviar PUT /transactions/{id} e depois DELETE /transactions/{id}
   - Então: atualização persistida e remoção concluída com 204

#### Casos não funcionais (RNF)

1. CT-RNF-002 - Segurança de autenticação
   - Requisito: RNF-002
   - Cenário: acesso a endpoint protegido sem token
   - Resultado esperado: retorno 401 Unauthorized

2. CT-RNF-003 - Tempo de resposta
   - Requisito: RNF-003
   - Cenário: carga concorrente em endpoints críticos
   - Resultado esperado: p95 menor que 3 segundos, mantendo baixa taxa de erro

3. CT-RNF-001 - Compatibilidade de consumo por clientes
   - Requisito: RNF-001
   - Cenário: chamadas da API realizadas por cliente web e cliente mobile
   - Resultado esperado: respostas consistentes e contratos JSON estáveis para ambos os clientes

### Conclusão da estratégia de testes

A combinação de testes unitários, integração, ponta a ponta, carga, regressão e testes manuais garante uma validação mais robusta da aplicação. Essa abordagem reduz riscos de falhas em produção e aumenta a confiança de que os requisitos funcionais e não funcionais do PoupaBem estão sendo atendidos.

## Referências

- Microsoft Learn. ASP.NET Core Web API.
- Microsoft Learn. ASP.NET Core Identity.
- Microsoft Learn. JWT Bearer Authentication em ASP.NET Core.
- Microsoft Learn. Entity Framework Core com PostgreSQL.
- Swagger/OpenAPI Specification.

