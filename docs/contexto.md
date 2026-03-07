# Introdução

A organização financeira pessoal é um tema de crescente relevância na sociedade contemporânea. Com a expansão do acesso a serviços bancários digitais, a facilidade de crédito e a diversidade de meios de pagamento disponíveis, torna-se cada vez mais desafiador para o cidadão comum manter o controle de suas finanças, planejar gastos e desenvolver o hábito da poupança.
No Brasil, esse desafio é amplificado por um contexto histórico de instabilidade econômica, elevadas taxas de juros e baixos índices de educação financeira na população. A falta de controle sobre receitas e despesas contribui diretamente para o endividamento e a dificuldade de construir reservas financeiras, afetando a qualidade de vida de milhões de pessoas.
Nesse cenário, soluções digitais voltadas à gestão financeira pessoal representam uma oportunidade concreta de transformação. O acesso crescente a smartphones e à internet permite que ferramentas de controle financeiro cheguem a um público amplo, promovendo maior consciência sobre hábitos de consumo e incentivando o planejamento financeiro de curto, médio e longo prazo.
É nesse contexto que surge o PoupaBem, um sistema web de organização financeira pessoal desenvolvido como projeto acadêmico interdisciplinar, com o objetivo de oferecer ao usuário uma plataforma intuitiva para o controle de suas finanças do dia a dia.


## Problema

Grande parte da população brasileira não possui ferramentas adequadas ou o hábito consolidado de registrar e acompanhar suas transações financeiras de forma sistemática. O controle financeiro, quando feito, ocorre de maneira informal — por meio de anotações avulsas, planilhas improvisadas ou simplesmente pela percepção subjetiva do saldo disponível em conta.
Essa ausência de método gera consequências diretas: dificuldade em identificar para onde o dinheiro está indo, incapacidade de poupar para objetivos específicos, surpresas com compromissos financeiros e vulnerabilidade diante de imprevistos.
O problema central que motiva este projeto pode ser formulado da seguinte forma: como desenvolver uma ferramenta digital acessível e intuitiva que auxilie o usuário a registrar suas receitas e despesas, acompanhar metas de poupança e tomar decisões financeiras mais conscientes no cotidiano?



## Objetivos

**Objetivo Geral**
Desenvolver um sistema web de organização financeira pessoal, denominado PoupaBem, que permita ao usuário registrar receitas e despesas, categorizar transações, criar metas de economia por meio de cofrinhos virtuais e visualizar relatórios de desempenho financeiro de forma simples e acessível.

**Objetivos Específicos**
Implementar um módulo de cadastro e autenticação de usuários com segurança adequada.
Desenvolver funcionalidades de registro e categorização de transações financeiras (receitas e despesas).
Criar um sistema de cofrinhos virtuais para definição e acompanhamento de metas financeiras personalizadas.
Disponibilizar relatórios e gráficos de desempenho financeiro por período e categoria.
Projetar uma arquitetura distribuída escalável baseada em microsserviços.
Garantir acessibilidade e responsividade da interface para uso em dispositivos móveis e desktops.

 

## Justificativa

A relevância do PoupaBem se sustenta em três dimensões complementares: social, econômica e tecnológica.
Do ponto de vista social, o sistema contribui para a promoção da educação financeira, especialmente entre jovens adultos que estão iniciando sua vida financeira de forma independente. Ao facilitar o registro e a visualização de gastos, o PoupaBem estimula a reflexão sobre hábitos de consumo e o desenvolvimento de comportamentos financeiros mais saudáveis.
No aspecto econômico, uma ferramenta eficiente de controle financeiro pode reduzir o endividamento dos usuários, ampliar sua capacidade de poupança e contribuir para o alcance de objetivos financeiros de médio e longo prazo, impactando positivamente sua qualidade de vida.
Do ponto de vista tecnológico, o projeto proporciona à equipe de desenvolvimento a oportunidade de aplicar na prática os conceitos estudados ao longo do curso, como arquitetura de sistemas distribuídos, desenvolvimento de APIs RESTful, microsserviços e desenvolvimento front-end moderno, consolidando competências essenciais para a atuação profissional na área.


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
|---|---|
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
|---|---|
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
|---|---|
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
|---|---|---|---|
| US-01 | usuário cadastrado | registrar receita ou despesa informando valor, categoria e data | eu possa acompanhar meu histórico financeiro com precisão |
| US-02 | usuário cadastrado | categorizar minhas transações (alimentação, transporte, lazer, saúde etc.) | eu identifique em quais áreas estou gastando mais |
| US-03 | usuário cadastrado | criar um cofrinho virtual com nome e valor-alvo definidos por mim | eu possa guardar dinheiro para objetivos específicos |
| US-04 | usuário cadastrado | registrar aportes progressivos no meu cofrinho | eu acompanhe visualmente a evolução da minha meta de poupança |
| US-05 | usuário cadastrado | visualizar um dashboard com resumo financeiro do mês atual | eu tenha uma visão geral rápida das minhas receitas, despesas e saldo |
| US-06 | usuário cadastrado | visualizar gráficos de gastos por categoria | eu identifique padrões de consumo e oportunidades de economia |
| US-07 | novo usuário | me cadastrar na plataforma com e-mail e senha | eu tenha acesso seguro e personalizado ao sistema |
| US-08 | usuário cadastrado | editar ou excluir transações já registradas | eu possa corrigir erros de lançamento sem precisar de suporte |
| US-09 | usuário cadastrado | definir um limite de gastos mensais por categoria | eu planeje meu orçamento com antecedência e evite excessos |
| US-10 | usuário cadastrado | receber alertas quando meus gastos se aproximarem ou ultrapassarem o limite | eu tome decisões financeiras mais conscientes no momento certo |
| US-11 | usuário cadastrado | exportar meu extrato financeiro em PDF ou CSV | eu guarde um histórico ou compartilhe com terceiros quando necessário |
| US-12 | usuário cadastrado | acessar o sistema pelo smartphone com a mesma experiência do desktop | eu registre transações de qualquer lugar, a qualquer momento |
| US-13 | usuário cadastrado | visualizar o histórico de transações com filtros por período e categoria | eu encontre rapidamente informações sobre gastos passados |
| US-14 | usuário cadastrado | recuperar minha senha por e-mail em caso de esquecimento | eu não perca acesso à minha conta |


# Especificações do Projeto

## Requisitos


### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
|---|---|---|
| RF-001 | Permitir o cadastro de novos usuários com e-mail e senha | ALTA |
| RF-002 | Autenticar usuários via login com e-mail e senha | ALTA |
| RF-003 | Permitir a recuperação de senha por e-mail | ALTA |
| RF-004 | Permitir o registro de transações financeiras informando valor, tipo (receita ou despesa), categoria e data | ALTA |
| RF-005 | Permitir a categorização de transações com categorias padrão e personalizadas | ALTA |
| RF-006 | Permitir a edição e exclusão de transações já registradas | MÉDIA |
| RF-007 | Permitir a criação de cofrinhos virtuais com nome e valor-alvo | ALTA |
| RF-008 | Permitir o registro de aportes progressivos nos cofrinhos | ALTA |
| RF-009 | Exibir um dashboard com resumo financeiro do período atual (receitas, despesas e saldo) | ALTA |
| RF-010 | Gerar gráficos de distribuição de gastos por categoria | MÉDIA |
| RF-011 | Permitir a definição de orçamento mensal por categoria | MÉDIA |
| RF-012 | Emitir alertas quando os gastos se aproximarem ou ultrapassarem o limite definido | MÉDIA |
| RF-013 | Exibir histórico de transações com filtros por período e categoria | ALTA |
| RF-014 | Permitir exportação do extrato financeiro em PDF e CSV | BAIXA |

### Requisitos não Funcionais

| ID | Descrição do Requisito | Prioridade |
|---|---|---|
| RNF-001 | O sistema deve ser responsivo e funcionar em dispositivos móveis e desktops | MÉDIA |
| RNF-002 | O sistema deve responder a requisições da API em no máximo 2 segundos em condições normais de operação | BAIXA |
| RNF-003 | As senhas dos usuários devem ser armazenadas com algoritmo de hash seguro (bcrypt) | ALTA |
| RNF-004 | Toda comunicação entre cliente e servidor deve ser realizada via HTTPS | ALTA |
| RNF-005 | O sistema deve utilizar tokens JWT para autenticação e controle de acesso | ALTA |
| RNF-006 | O sistema deve ser desenvolvido seguindo a arquitetura de microsserviços | MÉDIA |
| RNF-007 | O banco de dados deve suportar o crescimento da base de usuários sem degradação de desempenho | MÉDIA |
| RNF-008 | O sistema deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Safari, Edge) | MÉDIA |
| RNF-009 | O código-fonte deve possuir cobertura mínima de testes automatizados de 70% | BAIXA |
| RNF-010 | O sistema deve estar em conformidade com a Lei Geral de Proteção de Dados (LGPD) | ALTA |

## Restrições

As restrições a seguir delimitam o escopo de desenvolvimento e as condições sob as quais o projeto será executado:

- O projeto deve ser desenvolvido ao longo de um semestre letivo, com entregas parciais conforme cronograma acadêmico estabelecido.
- A equipe é composta por estudantes em formação, sem orçamento disponível para infraestrutura de produção de alto custo.
- Nesta versão, o sistema não integrará APIs bancárias nem Open Finance, limitando-se ao registro manual de transações pelo usuário.
- O sistema não contemplará funcionalidades de pagamento, transferência ou movimentação de valores reais.
- A plataforma será desenvolvida prioritariamente como aplicação web, sem versão nativa para iOS ou Android nesta etapa.
- O uso de tecnologias e ferramentas será restrito a soluções gratuitas ou com planos de acesso para estudantes.


# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.
