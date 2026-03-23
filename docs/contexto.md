# Introdução

A organização financeira pessoal é um tema de crescente relevância na sociedade contemporânea. Com a expansão do acesso a serviços bancários digitais, a facilidade de crédito e a diversidade de meios de pagamento disponíveis, torna-se cada vez mais desafiador para o cidadão comum manter o controle de suas finanças, planejar gastos e desenvolver o hábito da poupança.

No Brasil, esse desafio é amplificado por um contexto histórico de instabilidade econômica, elevadas taxas de juros e baixos índices de educação financeira na população. A falta de controle sobre receitas e despesas contribui diretamente para o endividamento e a dificuldade de construir reservas financeiras, afetando a qualidade de vida de milhões de pessoas.

Nesse cenário, soluções digitais voltadas à gestão financeira pessoal representam uma oportunidade concreta de transformação. O acesso crescente a smartphones e à internet permite que ferramentas de controle financeiro cheguem a um público amplo, promovendo maior consciência sobre hábitos de consumo e incentivando o planejamento financeiro de curto, médio e longo prazo.

É nesse contexto que surge o PoupaBem, um sistema web de organização financeira pessoal desenvolvido como projeto acadêmico interdisciplinar, com o objetivo de oferecer ao usuário uma plataforma intuitiva para o controle de suas finanças do dia a dia.

## Problema

Grande parcela da população brasileira ainda não dispõe de ferramentas adequadas, nem possui o hábito consolidado de registrar e acompanhar suas movimentações financeiras de maneira organizada e sistemática. Quando esse controle é realizado, muitas vezes ocorre de forma informal, por meio de anotações dispersas, planilhas pouco estruturadas ou até mesmo com base apenas na percepção subjetiva do valor disponível em conta.

A ausência de um método consistente para o gerenciamento das finanças pessoais produz impactos diretos no cotidiano. Entre eles, destacam-se a dificuldade de compreender com clareza para onde os recursos estão sendo direcionados, a limitação para economizar com foco em objetivos específicos, os imprevistos causados por compromissos financeiros esquecidos e a maior fragilidade diante de despesas inesperadas.

Nesse contexto, o problema central que fundamenta este projeto pode ser expresso da seguinte maneira: como desenvolver uma solução digital acessível, intuitiva e eficiente, capaz de auxiliar o usuário no registro de receitas e despesas, no acompanhamento de metas de economia e na adoção de decisões financeiras mais conscientes no dia a dia?
## Objetivos

**Objetivo Geral**

Desenvolver um sistema web de organização financeira pessoal, denominado PoupaBem, que permita ao usuário registrar receitas e despesas, categorizar transações, criar metas de economia por meio de cofrinhos virtuais e visualizar relatórios de desempenho financeiro de forma simples e acessível.

**Objetivos Específicos**

- Implementar um módulo de cadastro e autenticação de usuários com segurança adequada.
- Desenvolver funcionalidades de registro e categorização de transações financeiras (receitas e despesas).
- Criar um sistema de cofrinhos virtuais para definição e acompanhamento de metas financeiras personalizadas.
- Disponibilizar relatórios e gráficos de desempenho financeiro por período e categoria.
- Projetar uma arquitetura distribuída escalável baseada em microsserviços.
- Garantir acessibilidade e responsividade da interface para uso em dispositivos móveis e desktops.

## Justificativa

O PoupaBem não se limita a ser apenas uma ferramenta de controle financeiro, pois sua relevância se estende a diferentes dimensões. Entre elas, destacam-se os impactos sociais, os benefícios econômicos e as contribuições tecnológicas envolvidas em sua concepção e utilização.

Sob a perspectiva social, a plataforma atua como um recurso de apoio à educação financeira, principalmente para jovens adultos que estão iniciando sua independência financeira. Ao permitir o acompanhamento detalhado dos gastos, o sistema promove maior percepção sobre o comportamento de consumo e incentiva a adoção de práticas financeiras mais saudáveis no cotidiano.

Do ponto de vista econômico, a utilização de um recurso como esse pode auxiliar os usuários a administrar melhor seu dinheiro, reduzindo situações de endividamento e ampliando a possibilidade de economizar. Esse acompanhamento mais organizado das finanças também favorece o planejamento e a realização de objetivos de médio e longo prazo, gerando efeitos positivos no bem-estar e na qualidade de vida.

Ao mesmo tempo, o projeto possui relevância tecnológica por representar uma oportunidade concreta de aplicação prática dos conhecimentos desenvolvidos durante a formação acadêmica. A construção do sistema envolve conceitos importantes, como arquitetura de sistemas distribuídos, microsserviços, APIs RESTful e front-end moderno, contribuindo para o fortalecimento das competências necessárias no mercado de tecnologia.

## Público-Alvo

O PoupaBem é destinado a pessoas físicas que desejam organizar e acompanhar suas finanças pessoais de forma prática e acessível. O sistema foi concebido para ser utilizado sem exigência de conhecimento financeiro avançado, atendendo a diferentes perfis de usuário:

- Jovens adultos (18 a 35 anos): estudantes e profissionais em início de carreira que buscam criar os primeiros hábitos de controle financeiro e poupança.
- Adultos economicamente ativos (25 a 55 anos): profissionais com renda consolidada que desejam acompanhar seus gastos mensais de forma mais organizada e atingir metas financeiras - específicas.
- Famílias: grupos que precisam gerenciar um orçamento doméstico compartilhado, acompanhando despesas coletivas e planejando gastos futuros.
- Microempreendedores individuais (MEI): pequenos empreendedores que necessitam separar suas finanças pessoais das empresariais e controlar seu fluxo de caixa pessoal.

Em termos de perfil tecnológico, o público-alvo é composto por usuários com familiaridade básica a intermediária com dispositivos digitais, habituados ao uso de smartphones e navegadores web. O sistema foi projetado para ser intuitivo e não exigir treinamento prévio para sua utilização.

Com base no público-alvo definido, foram elaboradas as seguintes personas, representando perfis reais de potenciais usuários do PoupaBem.

---

## 2.1 Personas

Com base no público-alvo definido, foram elaboradas as seguintes personas, representando perfis reais de potenciais usuários do PoupaBem.

---

### Persona 1 — Ana Luíza, a Estudante Organizada

| Atributo | Descrição |
| --- | --- |
| **Nome** | Ana Luíza Ferreira |
| **Idade** | 22 anos |
| **Ocupação** | Estudante universitária de Administração / Estagiária |
| **Renda mensal** | R$ 1.200,00 (bolsa estágio) |
| **Localização** | São Paulo — SP |
| **Perfil tecnológico** | Usuária frequente de smartphone Android; acessa internet diariamente para redes sociais e serviços bancários digitais |
| **Objetivo principal** | Poupar R$ 5.000,00 para uma viagem internacional em até 18 meses |
| **Principal frustração** | Perde o controle dos gastos realizados via cartão e Pix sem perceber o acúmulo ao longo do mês |
| **Necessidade** | Uma ferramenta que mostre claramente para onde o dinheiro vai e permita reservar valores para um objetivo específico |

---

### Persona 2 — Carlos Eduardo, o Pai de Família

| Atributo | Descrição |
| --- | --- |
| **Nome** | Carlos Eduardo Souza |
| **Idade** | 38 anos |
| **Ocupação** | Técnico de TI em empresa privada |
| **Renda mensal** | R$ 4.500,00 |
| **Localização** | Belo Horizonte — MG |
| **Perfil tecnológico** | Usa smartphone e notebook no dia a dia; tem conta em banco digital e realiza transações online com frequência |
| **Objetivo principal** | Controlar as despesas da família e criar uma reserva para reforma da casa nos próximos dois anos |
| **Principal frustração** | As planilhas que monta manualmente são trabalhosas de manter atualizadas e não oferecem visão clara do saldo disponível |
| **Necessidade** | Uma solução simples para lançar os gastos da família e acompanhar o progresso de uma meta de poupança de forma visual |

---

### Persona 3 — Rafaela, a Empreendedora Autônoma

| Atributo | Descrição |
| --- | --- |
| **Nome** | Rafaela Monteiro |
| **Idade** | 29 anos |
| **Ocupação** | MEI — Designer Freelancer |
| **Renda mensal** | R$ 3.000,00 a R$ 6.000,00 (variável conforme projetos) |
| **Localização** | Rio de Janeiro — RJ |
| **Perfil tecnológico** | Usuária avançada de smartphones e ferramentas digitais; utiliza diversas plataformas online para trabalho e comunicação |
| **Objetivo principal** | Separar as finanças pessoais das do MEI e constituir uma reserva de emergência equivalente a seis meses de despesas |
| **Principal frustração** | A renda irregular dificulta o planejamento mensal e frequentemente não sabe se pode realizar um gasto maior sem comprometer compromissos futuros |
| **Necessidade** | Visão clara do saldo disponível, alertas ao aproximar-se do limite de gastos e acompanhamento de uma meta de reserva de emergência |

---

### Histórias de Usuário

| ID | Como... | Quero... | Para que... |
| --- | --- | --- | --- |
| US-01 | novo usuário | me cadastrar na plataforma com e-mail e senha | eu tenha acesso ao sistema e possa registrar minhas finanças |
| US-02 | usuário cadastrado | realizar login no sistema | eu acesse meus dados financeiros de forma segura |
| US-03 | usuário cadastrado | registrar uma receita informando valor, categoria e data | eu acompanhe entradas de dinheiro no meu histórico financeiro |
| US-04 | usuário cadastrado | registrar uma despesa informando valor, categoria e data | eu acompanhe para onde meu dinheiro está sendo gasto |
| US-05 | usuário cadastrado | categorizar minhas transações (alimentação, transporte, lazer etc.) | eu identifique em quais áreas estou gastando mais |
| US-06 | usuário cadastrado | editar ou excluir transações já registradas | eu possa corrigir erros de lançamento |
| US-07 | usuário cadastrado | criar um cofrinho virtual com nome e valor-alvo definidos por mim | eu possa guardar dinheiro para objetivos específicos |
| US-08 | usuário cadastrado | registrar valores economizados no meu cofrinho | eu acompanhe o progresso da minha meta financeira |
| US-09 | usuário cadastrado | visualizar relatórios financeiros por período | eu analise minhas receitas e despesas ao longo do tempo |
| US-10 | usuário cadastrado | visualizar gráficos de gastos por categoria | eu identifique padrões de consumo e oportunidades de economia |
| US-11 | usuário cadastrado | visualizar um resumo das minhas finanças | eu tenha uma visão geral da minha situação financeira |
| US-12 | usuário cadastrado | acessar o sistema por meio de dispositivos móveis ou desktop | eu registre e consulte minhas finanças de qualquer lugar |
| US-13 | usuário cadastrado | visualizar o histórico de transações registradas | eu acompanhe minhas movimentações financeiras anteriores |

# Especificações do Projeto

## Requisitos

### Requisitos Funcionais

| ID     | Descrição do Requisito                                | Prioridade |
| ------ | ----------------------------------------------------- | ---------- |
| RF-001 | Permitir o cadastro de novos usuários no sistema      | ALTA       |
| RF-002 | Permitir autenticação de usuários (login e logout)    | ALTA       |
| RF-003 | Permitir registrar receitas financeiras               | ALTA       |
| RF-004 | Permitir registrar despesas financeiras               | ALTA       |
| RF-005 | Permitir categorizar transações financeiras           | ALTA       |
| RF-006 | Permitir criar metas de economia (cofrinhos)          | MÉDIA      |
| RF-007 | Permitir acompanhar o progresso das metas financeiras | MÉDIA      |
| RF-008 | Exibir relatórios financeiros por período             | MÉDIA      |
| RF-009 | Exibir gráficos de gastos por categoria               | MÉDIA      |
| RF-010 | Permitir edição e exclusão de transações financeiras  | ALTA       |

### Requisitos Não Funcionais

| ID      | Descrição do Requisito                                                         | Prioridade |
| ------- | ------------------------------------------------------------------------------ | ---------- |
| RNF-001 | O sistema deve possuir interface responsiva para dispositivos móveis e desktop | ALTA       |
| RNF-002 | O sistema deve garantir autenticação segura dos usuários                       | ALTA       |
| RNF-003 | O tempo de resposta das requisições deve ser inferior a 3 segundos             | MÉDIA      |
| RNF-004 | A aplicação deve utilizar arquitetura baseada em serviços distribuídos         | ALTA       |
| RNF-005 | A arquitetura deve permitir escalabilidade horizontal dos serviços.            | MÉDIA      |

## Restrições

| ID | Restrição |
| --- | --- |
| R-01 | O projeto deve ser desenvolvido no período do semestre acadêmico |
| R-02 | A aplicação deve utilizar arquitetura distribuída |
| R-03 | O sistema deverá disponibilizar acesso por meio de interfaces cliente, incluindo aplicação web e aplicação mobile. |

# Catálogo de Serviços

A arquitetura do sistema será composta por diferentes serviços responsáveis por funcionalidades específicas.

**Serviço de Autenticação**
Responsável pelo cadastro, login e gerenciamento de sessões de usuários. Permite que o usuário crie uma conta informando e-mail e senha, acesse o sistema mediante autenticação e tenha sua sessão controlada por tokens JWT. Também oferece a funcionalidade de redefinição de senha por e-mail para casos de esquecimento.

**Serviço de Transações Financeiras**
Responsável pelo registro, edição e exclusão de receitas e despesas. Permite que o usuário lance suas movimentações financeiras informando valor, tipo, categoria e data, consulte seu histórico com filtros por período e categoria, e acompanhe o saldo e o resumo financeiro do período selecionado.

**Serviço de Categorias**
Responsável pela organização das transações em categorias como alimentação, transporte, moradia e lazer. O sistema disponibiliza categorias padrão e permite que o usuário crie, edite e remova suas próprias categorias personalizadas, tornando a organização financeira mais aderente à sua realidade.

**Serviço de Metas Financeiras**
Permite a criação e acompanhamento de metas de economia, representadas por cofrinhos virtuais. O usuário pode criar um cofrinho com nome e valor-alvo, registrar aportes progressivos ao longo do tempo e acompanhar visualmente o percentual de evolução de cada meta até o seu alcance.

**Serviço de Relatórios**
Responsável por gerar relatórios e gráficos sobre receitas, despesas e progresso de metas. Oferece visões consolidadas mensais e anuais, distribuição de gastos por categoria e dados resumidos para o dashboard principal, além de permitir a exportação do extrato financeiro em PDF ou CSV para consulta externa.

# Arquitetura da Solução

```
                    ┌───────────────┐
                    │    Usuário    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Navegador Web │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Frontend    │
                    │    (React)    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   API Gateway │
                    │    (Express)  │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ Finance API  │   │ Goals API    │
│              │   │              │   │              │
│ Login        │   │ Receitas     │   │ Metas        │
│ Cadastro     │   │ Despesas     │   │ Cofrinhos    │
│ Sessões      │   │ Categorias   │   │ Progresso    │
│              │   │ Relatórios   │   │              │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └───────────────┬──┴──────────────────┘
                       ▼
               ┌───────────────┐
               │   Database    │
               │    MongoDB    │
               └───────────────┘
```

O sistema PoupaBem será desenvolvido utilizando uma arquitetura distribuída baseada em microsserviços.

Nesse modelo, o sistema é dividido em diferentes serviços independentes, cada um responsável por uma parte da lógica da aplicação. Esses serviços se comunicam entre si por meio de APIs REST.

Essa abordagem permite maior escalabilidade, facilidade de manutenção e melhor organização do sistema.

A arquitetura da aplicação será composta pelos seguintes componentes:

- **Cliente (Front-end)**: interface utilizada pelo usuário por meio do navegador ou dispositivo móvel.
- **API Gateway**: responsável por receber as requisições do usuário e encaminhá-las para os serviços adequados.
- **Microsserviços**: responsáveis pelas regras de negócio do sistema.
- **Banco de dados**: responsável pelo armazenamento das informações financeiras.

Fluxo básico de funcionamento:

1. O usuário acessa o sistema através do navegador.
2. O front-end envia uma requisição para a API.
3. A API encaminha a requisição para o microsserviço responsável.
4. O serviço processa a solicitação e consulta o banco de dados.
5. A resposta é enviada de volta ao usuário através do front-end.

Essa arquitetura permite que cada serviço seja desenvolvido, atualizado e escalado de forma independente.

## Tecnologias Utilizadas

Para o desenvolvimento da aplicação serão utilizadas tecnologias modernas amplamente empregadas no desenvolvimento de sistemas distribuídos.

### Front-end

Responsável pela interface com o usuário.

Tecnologias:

- React
- HTML5
- CSS3
- JavaScript

O front-end será responsável por coletar as informações do usuário e apresentar os dados financeiros de forma visual e intuitiva.

### Back-end

Responsável pela lógica de negócio da aplicação e implementação dos microsserviços.

Tecnologias:

- Node.js
- Express
- APIs REST

Cada microsserviço será implementado como uma API independente.

### Banco de Dados

Responsável pelo armazenamento das informações financeiras do sistema.

Tecnologias possíveis:

- MongoDB

O banco de dados armazenará informações como usuários, transações financeiras e metas de economia.

### Ferramentas de Desenvolvimento

- Git
- GitHub
- Postman
- Docker

## Hospedagem

A aplicação poderá ser implantada em serviços de computação em nuvem, como AWS, Microsoft Azure ou Google Cloud Platform, garantindo maior flexibilidade e confiabilidade para o sistema.

O front-end poderá ser publicado em plataformas especializadas, como Vercel ou Netlify, que oferecem praticidade no processo de deploy e bom desempenho na entrega da interface aos usuários. Já o back-end poderá ser executado em servidores na nuvem com o uso de containers Docker, o que facilita a padronização do ambiente, a implantação e a manutenção da aplicação.

Essa estrutura de hospedagem contribui para a escalabilidade do sistema, simplifica sua administração e favorece a alta disponibilidade, permitindo que a aplicação atenda os usuários de forma estável e eficiente.
