# CONTROLE FINANCEIRO

`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Arquitetura de Sistemas Distribuídos`

`SEMESTRE: 6º`

Descrever resumidamente, em um ou dois parágrafos, o projeto que está sendo desenvolvido.

## Integrantes

* [Ana Clara Pinheiro Campos](docs/atas/aluno1.md)
* [Gabriel Ferreira dos Santos](docs/atas/aluno2.md)
* [Gustavo Henrique de Moura Luz](docs/atas/aluno3.md)
* [João Pedro Lindenberg Pimenta](docs/atas/aluno4.md)
* [Joao Vitor Jangola Mendes](docs/atas/aluno5.md)
* [Maryana Nunes Morato](docs/atas/aluno6.md)

## Orientador

* Kleber Jacques Ferreira de Souza

## 📊 Relatório de Contribuições

Este projeto possui rastreamento automático de contribuições individuais. O relatório é atualizado automaticamente toda segunda-feira e a cada push no repositório.

**[📈 Ver Relatório Completo de Contribuições](docs/CONTRIBUTION_REPORT.md)**

O relatório inclui:
- Commits por autor
- Linhas de código adicionadas/removidas
- Arquivos modificados
- Contribuições em documentação
- Gráficos de participação semanal

# Planejamento

| Etapa         | Atividades |
|  :----:   | ----------- |
| ETAPA 1         |[Documentação de Contexto](docs/contexto.md) <br> |
| ETAPA 2         |[Planejar, desenvolver e gerenciar APIs e Web Services](docs/backend-apis.md) <br> |
| ETAPA 3         |[Planejar, desenvolver e gerenciar uma aplicação Web](docs/frontend-web.md) |
| ETAPA 4        |[Planejar, desenvolver e gerenciar uma aplicação Móvel](docs/frontend-mobile.md) <br>  |
| ETAPA 5         | [Apresentação](presentation/README.md) |

## Instruções de utilização

O projeto é composto por três partes que precisam estar rodando simultaneamente: **banco de dados** (PostgreSQL), **backend** (.NET) e **front-end web** (React).

### Pré-requisitos

Instale as seguintes ferramentas (uma vez por máquina):

| Ferramenta | Versão | Link |
|---|---|---|
| Node.js | 18 ou superior | https://nodejs.org |
| Visual Studio 2022/2026 Community | com workloads "ASP.NET e desenvolvimento Web" e "Desenvolvimento para desktop com .NET" | https://visualstudio.microsoft.com |
| PostgreSQL | 16 ou 17 | https://www.postgresql.org/download/windows/ |

> ⚠️ **Importante:** durante a instalação do PostgreSQL, defina a senha do usuário `postgres` como `123` para bater com a connection string padrão do projeto. Caso use outra senha, ajuste o arquivo `backend/PoupaBem.API/appsettings.Development.json`.

### 1. Clonar o repositório

```bash
git clone https://github.com/<usuario>/pmv-si-2026-1-pe6-t2-t2-g6-controle-financeiro.git
cd pmv-si-2026-1-pe6-t2-t2-g6-controle-financeiro
```

### 2. Subir o backend (primeira vez)

1. Abra o arquivo `pmv-si-2026-1-pe6-t2-t2-g6-controle-financeiro.sln` no **Visual Studio**.
2. No **Solution Explorer**, clique com o botão direito em `PoupaBem.API` → **Definir como Projeto de Inicialização**.
3. Crie o banco e aplique as migrations:
   - Menu **Ferramentas → Gerenciador de Pacotes do NuGet → Console do Gerenciador de Pacotes**
   - No **Projeto padrão** do console, selecione `Infrastructure`
   - Execute:
```
     Update-Database
```
   - Aguarde até aparecer `Done.` no final.
4. Clique no botão verde ▶ (ou pressione F5) para iniciar o backend.
5. A janela de terminal vai mostrar:
```
   Now listening on: http://localhost:5043
   Now listening on: https://localhost:7173
```
6. **Mantenha essa janela aberta** — ela é o backend rodando. A documentação interativa Swagger fica em [http://localhost:5043/swagger](http://localhost:5043/swagger).

### 3. Subir o front-end web

Em um **outro terminal** (Prompt de Comando ou PowerShell):

```bash
cd src/poupabem-web
npm install   # apenas na primeira vez
npm run dev
```

Vai aparecer:
```
➜  Local:   http://localhost:5173/
```

Abra essa URL no navegador. Crie sua conta em "Cadastre-se" e comece a usar.

> ⚠️ **Senha forte obrigatória:** o cadastro exige senha com letra maiúscula, minúscula, número e caractere especial (ex.: `Senha@123`).

### Próximas execuções

Após o setup inicial, o ciclo diário fica simples:

| Componente | Como subir |
|---|---|
| PostgreSQL | já roda como serviço do Windows automaticamente |
| Backend | abre a solution no Visual Studio → ▶ |
| Front-end | `cd src/poupabem-web && npm run dev` |

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>