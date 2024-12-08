# Introdução

- **Projeto:** **_FinUp (Financial Upgrade)_**
- **Repositório GitHub:** [Grupo 6 - Falta de Gestão Financeira](https://github.com/ICEI-PUC-Minas-PPLCC-TI/ti-1-ppl-cc-m-2024-2-g6-falta-de-gestao-financeira)
- **Membros da equipe:**
  - [Adriano Araújo Domingos dos Santos](https://github.com/adrianoaraujods)
  - [Filipe Nery Rabelo](https://github.com/Filnr)
  - [Gabriel Corrêa Costa](https://github.com/Gabriel00110)
  - [Nikolas Petrick Castro Mendes](https://github.com/nickmiyah)
  - [Rondinelly Martins Silva ](https://github.com/Rondi17)
  - [Victor Rabelo Souza](https://github.com/VictorRS7)

A documentação do projeto é estruturada da seguinte forma:

- [Introdução](#introdução)
- [Contexto](#contexto)
  - [Problema](#problema)
  - [Objetivos](#objetivos)
  - [Justificativa](#justificativa)
  - [Público-Alvo](#público-alvo)
- [Product Discovery](#product-discovery)
  - [Etapa de Entendimento](#etapa-de-entendimento)
    - [Matriz CSD](#matriz-csd)
    - [Mapa de Stakeholders](#mapa-de-stakeholders)
    - [Entrevistas qualitativas](#entrevistas-qualitativas)
    - [Highlight de pesquisa](#highlight-de-pesquisa)
  - [Etapa de Definição](#etapa-de-definição)
    - [Personas](#personas)
      - [João Silva Pereira](#joão-silva-pereira)
      - [Marcos Costa](#marcos-costa)
      - [Anna Ribeiro](#anna-ribeiro)
- [Product Design](#product-design)
  - [Histórias de Usuários](#histórias-de-usuários)
  - [Proposta de Valor](#proposta-de-valor)
    - [Proposta de valor para Persona 1](#proposta-de-valor-para-persona-1)
    - [Proposta de valor para Persona 2](#proposta-de-valor-para-persona-2)
    - [Proposta de valor para Persona 3](#proposta-de-valor-para-persona-3)
  - [Requisitos](#requisitos)
    - [Requisitos Funcionais](#requisitos-funcionais)
    - [Requisitos não Funcionais](#requisitos-não-funcionais)
  - [Projeto de Interface](#projeto-de-interface)
    - [Wireframes](#wireframes)
      - [Conta](#conta)
      - [Registros](#registros)
      - [Categorias](#categorias)
      - [Recorrentes](#recorrentes)
      - [Relatórios](#relatórios)
      - [Evolução](#evolução)
      - [Investimentos](#investimentos)
      - [Ações](#ações)
    - [User Flow](#user-flow)
    - [Protótipo Interativo](#protótipo-interativo)
- [Metodologia](#metodologia)
  - [Ferramentas](#ferramentas)
  - [Gerenciamento do Projeto](#gerenciamento-do-projeto)
- [Tecnologias](#tecnologias)
- [Referências](#referências)

[Documentação de Design Thinking (MIRO)](files/PPLCC-M%20-%20G6%20-%20Falta%20de%20gestão%20financeira.pdf)

# Contexto

A falta de gestão financeira pessoal é um problema crescente, especialmente com o aumento da acessibilidade ao crédito e ao consumo digital. Muitas pessoas enfrentam dificuldades para gerenciar suas finanças de forma adequada, o que resulta em gastos impulsivos, falta de planejamento e endividamento. Essa situação torna difícil para grande parte da população manter uma visão clara e realista de seus ganhos e despesas.

## Problema

Grade parte da população sofre por conta da falta de gestão financeira, e atualmente tem sido um problema crescente. A falta de gestão financeira se refere à dificuldade em controlar suas finanças, podendo levar ao acúmulo de dívidas, compras impulsivas e gastos desnecessários, prejudicando o planejamento a longo prazo.

## Objetivos

Nosso objetivo é desenvolver um software com o intuído educativo, mostrando ao usuário como estão distribuídos seus gastos e receitas. Desejamos entregar ferramentas que facilite o usuário a estabelecer uma educação financeira eficiente, identificando os principais pontos onde deve mudar, bem como e criando metas de economia.

## Justificativa

Nós identificamos que grande parte das pessoas possuem dificuldade na gestão do próprio dinheiro. O uso do cartão de crédito aliado à práticas ruins, como compras impulsivas e a inscrição sem necessidade em serviços de assinatura mensal como o Spotify, Netflix, Amazon Prime, Youtube Premium, entre outros. Todos esses são fatores que dificultam a organização do dinheiro gasto, que como consequência gera o endividamento de muitas pessoas, que acabam vivendo no limite da sua renda.

## Público-Alvo

As pessoas que relatam ter maior dificuldade para gerir seu dinheiro, são os das [gerações Y e Z](https://pontaltech.com.br/blog/marketing/geracoes-x-y-z-alpha-beta/), visto que os mais velhos ainda utilizam bastante dinheiro físico, e tem maior rigor com seus gastos. Jovens e adultos entre 20 e 45 anos são os principais afetados por esse problema.

# Product Discovery

## Etapa de Entendimento

### Matriz CSD

![Matriz CSD](./images/MiroImages/MatrizCSD.png)

### Mapa de Stakeholders

![Mapa de Stakeholders](./images/MiroImages/MapaStakeholders.png)

### Entrevistas qualitativas

![Entrevista Qualitativa](./images/MiroImages/EntrevistaQualitativa.png)

### Highlight de pesquisa

![Highlights de Pesquisa](./images/MiroImages/HighlightsPesquisa.png)

## Etapa de Definição

### Personas

#### João Silva Pereira

![João Silva Pereira](./images/MiroImages/Persona1.png)

#### Marcos Costa

![Marcos Costa](./images/MiroImages/Persona2.png)

#### Anna Ribeiro

![Anna Ribeiro](./images/MiroImages/Persona3.png)

# Product Design

Nesse momento, vamos transformar os insights e validações obtidos em soluções tangíveis e utilizáveis. Essa fase envolve a definição de uma proposta de valor, detalhando a prioridade de cada ideia e a consequente criação de wireframes, mockups e protótipos de alta fidelidade, que detalham a interface e a experiência do usuário.

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

| EU COMO...  | QUERO/PRECISO ...                                                                                                                                   | PARA ...                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Endividado  | - Mais dinheiro <br> - Uma forma de organizar minhas finanças                                                                                       | - Quitar minhas dívidas <br> - Ter mais dinheiro <br> - Não me endividar                       |
| Consumista  | - Cancelar assinaturas de pouco uso <br> - Diminuir compras banais <br> - Criar limite de gastos no cartão                                          | - Diminuir gastos <br> - Ter autocontrole <br> - Diminuir a culpa de compras supérfluas        |
| Trabalhador | - Mais dinheiro <br> - Diminuir gastos <br> - Não gastar além do meu salário                                                                        | - Não endividar <br> - Construir uma reserva de emergência <br> - Ter uma boa saúde financeira |
| Funcionário | - Aumento salarial <br> - Renda extra <br> - Reserva de emergência                                                                                  | - Ter estabilidade financeira <br> - Ajudar em casa                                            |
| Pai         | - Estabelecer limites de compras para meus filhos <br> - Definir metas de investimentos e/ou economia <br> - Acompanhar melhor os gastos familiares | - Sobrar dinheiro para uma viagem <br> - Ficar mais tranquilo quanto às despesas               |
| Estudante   | - Economizar                                                                                                                                        | - O dinheiro não ser um obstáculo aos meus estudos                                             |

## Proposta de Valor

### Proposta de valor para Persona 1

![Proposta de valor persona 1](./images/MiroImages/PropostaValorPersona1.png)

### Proposta de valor para Persona 2

![Proposta de valor persona 2](./images/MiroImages/ProportaValorPersona2.png)

### Proposta de valor para Persona 3

![Proposta de valor persona 3](./images/MiroImages/PropostaValorPersona3.png)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------ | ---------- |
| RF-001 | Anotar receitas e despesas (registros)                                         | ALTA       |
| RF-002 | Visualizar os registros de cada dia                                            | ALTA       |
| RF-003 | Categorização de registros                                                     | ALTA       |
| RF-004 | Definir metas e objetivos de economias                                         | MÉDIA      |
| RF-005 | Definição de registros recorrentes, para inclusão de forma automática.         | ALTA       |
| RF-006 | Pesquisa de registros                                                          | MÉDIA      |
| RF-007 | Gerar relatórios patrimoniais                                                  | BAIXA      |
| RF-008 | Calculadora de retorno de investimentos                                        | BAIXA      |
| RF-009 | Gráficos comparativos de receitas e despesas, mostrando a evolução patrimonial | MÉDIA      |
| RF-010 | Preço de ações                                                                 | BAIXA      |

### Requisitos não Funcionais

| ID      | Descrição do Requisito                                  | Prioridade |
| ------- | ------------------------------------------------------- | ---------- |
| RNF-001 | Código Aberto (Open Source)                             | BAIXA      |
| RNF-002 | Acesso gratuito, salvo recursos que indicam o contrário | BAIXA      |
| RNF-003 | Front-end em HTML, CSS e JavaScript (Ambiente Web)      | ALTA       |
| RNF-004 | Servidor e banco de dados dedicado                      | ALTA       |
| RNF-005 | Sistema de conta, com acesso através de credenciais     | ALTA       |

## Projeto de Interface

Artefatos relacionados com a interface e a interação do usuário na proposta de solução.

### Wireframes

Estes são as principais telas do sistema.

#### Conta

![Formulário de Login](./images/interface/login.png)
![Formulário de criar conta](./images/interface/criar-conta.png)

#### Registros

![Página de registros](./images/interface/inicio.png)
![Criar registro](./images/interface/criar-registro.png)
![Editar registro](./images/interface/editar-registro.png)

#### Categorias

![Criar categoria](./images/interface/criar-categoria.png)
![Ver categorias](./images/interface/ver-categorias.png)
![Editar categoria](./images/interface/editar-categoria.png)

#### Recorrentes

![Criar recorrente](./images/interface/criar-recorrente.png)
![Ver recorrentes](./images/interface/ver-recorrentes.png)
![Editar recorrente](./images/interface/editar-recorrente.png)

#### Relatórios

![Página de Relatórios](./images/interface/relatorios.png)

#### Evolução

![Gráficos de evolução](./images/interface/evolucao.png)

#### Investimentos

![Calculadora de Investimentos](./images/interface/investimentos.png)

#### Ações

![Ações Recomendadas](./images/interface/acoes-recomendadas.png)

### User Flow

Este é o protótipo das telas do sistema.

![Userflow](images/FigmaImages/Userflow.png)

#### Protótipo Interativo

https://marvelapp.com/prototype/10ie6d3b/screen/95600300

# Metodologia

Durante o desenvolvimento do projeto, utilizamos diversas ferramentas para otimizar o processo e garantir a eficiência das entregas. O Miro foi utilizado como plataforma principal para o processo de Design Thinking, permitindo a criação de fluxos de ideias e o desenvolvimento colaborativo de soluções. Para o versionamento e armazenamento do código, adotamos o GitHub, que proporcionou um ambiente centralizado e acessível para o gerenciamento do código-fonte e o acompanhamento das modificações feitas pela equipe. Na idealização e desenvolvimento da interface do usuário, empregamos o Figma, garantindo agilidade e facilidade durante o processo criativo. Por fim, o MarvelApp foi usado para a criação do protótipo interativo, permitindo que os usuários experimentassem a interface da aplicação antes de sua implementação completa.

## Ferramentas

Relação de ferramentas empregadas pelo grupo durante o projeto.

| Ambiente                    | Plataforma | Link de acesso                                                                                |
| --------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| Processo de Design Thinking | Miro       | https://miro.com/app/board/uXjVKn-VohI=/                                                      |
| Repositório de código       | GitHub     | https://github.com/ICEI-PUC-Minas-PPLCC-TI/ti-1-ppl-cc-m-2024-2-g6-falta-de-gestao-financeira |
| Wireframes e Userflow       | Figma      | https://www.figma.com/design/iOqomTUN7adzGyKTcTEzQV/G6---Falta-de-Gest%C3%A3o-Financeira      |
| Protótipo Interativo        | MarvelApp  | https://marvelapp.com/prototype/10ie6d3b/screen/95600300                                      |

## Gerenciamento do Projeto

Divisão de papéis no grupo e apresentação da estrutura da ferramenta de controle de tarefas (Kanban).

![Kanban](images/Kanban.png)

# Tecnologias

Usamos as seguintes tecnologias e bibliotecas:

- [Bootstrap](https://getbootstrap.com/): Utilizado para estilização e layout da interface do usuário
- [Chart.js](https://www.chartjs.org/): Foi usado para criar gráficos
- [jQuery](https://jquery.com/): Foi utilizado para a manipulação do DOM
- [JSON-Server](https://github.com/typicode/json-server#readme): Utilizado como servidor e banco de dados

# Referências

PONTALTECH. Gerações: tudo sobre geração X, Y, Z alpha, beta. Disponível em: https://pontaltech.com.br/blog/marketing/geracoes-x-y-z-alpha-beta/. Acesso em: 5 dez. 2024.

DANTAS, A. Estudo sobre o perfil socioeconômico de motoristas de aplicativo no Brasil. Revista Brasileira de Economia, v. 75, n. 2, p. 123-137, 2021.

INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Pesquisa de Orçamentos Familiares: Despesas familiares e endividamento. Brasília: IBGE, 2020. Disponível em: https://www.ibge.gov.br. Acesso em: 18 set. 2024.

SERVIÇO DE PROTEÇÃO AO CRÉDITO (SPC). Estudo sobre hábitos de consumo e controle financeiro. São Paulo: SPC, 2019.

CNDL/ SPC. 47% dos jovens da Geração Z não realizam o controle das finanças. Disponível em:
https://cndl.org.br/politicaspublicas/47-dos-jovens-da-geracao-z-nao-realizam-o-controle-das-financas-aponta-pesquisa-cndl-spc-brasil/. Acesso em 06 dez. 2024.
