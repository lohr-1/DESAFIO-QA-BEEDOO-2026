# Beedoo QA Challenge — Exploração da Aplicação

Aplicação analisada:  
https://creative-sherbet-a51eac.netlify.app/

Caso de teste:
https://docs.google.com/spreadsheets/d/1DgzbOIeR5XJWfiOW8OIMiHsf3Xp8T_jVhRdWnT_44cY/edit?usp=sharing

---

# 1. Objetivo da aplicação

A aplicação tem como objetivo permitir o **gerenciamento simples de cursos**, possibilitando que o usuário:

- cadastre novos cursos através de um formulário
- visualize cursos cadastrados em uma listagem
- remova cursos da listagem

Semelhante a Hotmart, porém de uma maneira bem simplificada.

---

# 2. Principais fluxos disponíveis

Durante a exploração da aplicação foram identificados dois fluxos principais.

## 2.1 Cadastro de curso

Fluxo responsável por registrar novos cursos no sistema.

Passos observados:

1. Acessar a opção **"Cadastrar curso"**
2. Preencher os campos do formulário
3. Submeter o cadastro
4. Ser redirecionado para a listagem de cursos

Campos disponíveis no formulário:

- Nome do curso
- Descrição
- Instrutor
- URL da imagem de capa
- Data de início
- Data de fim
- Número de vagas
- Tipo de curso (Online / Presencial)

---

## 2.2 Listagem de cursos

Fluxo responsável por visualizar os cursos cadastrados.

A listagem apresenta um card para cada curso contendo:

- nome do curso
- descrição
- datas do curso
- número de vagas
- botão para excluir curso

Também é possível:

- navegar da listagem para o formulário de cadastro
- excluir cursos da listagem

---

# 3. Pontos mais críticos para teste

Durante a análise exploratória, alguns pontos foram identificados como mais críticos para testes, pois afetam diretamente a confiabilidade do sistema.

## 3.1 Validação de dados do formulário

O formulário é a principal entrada de dados do sistema. Portanto, é essencial validar:

- consistência entre datas (data inicial e final)
- valores numéricos válidos para número de vagas
- tratamento de textos inválidos (ex: apenas espaços)

Falhas nessas validações podem gerar registros inconsistentes.

---

## 3.2 Integridade do fluxo de cadastro

É importante garantir que:

- o curso seja cadastrado corretamente
- o usuário seja redirecionado para a listagem após o cadastro
- os dados cadastrados apareçam corretamente na listagem

Esse fluxo representa o **principal objetivo da aplicação**.

---

## 3.3 Consistência da listagem de cursos

A listagem deve refletir corretamente os dados cadastrados.

Os pontos de atenção incluem:

- exibição correta das informações do curso
- atualização da lista após cadastro
- atualização da lista após exclusão
- persistência dos dados após recarregar a página

---

## 3.4 Navegação entre rotas

Como a aplicação utiliza roteamento, é importante validar:

- acesso à listagem
- acesso ao formulário de cadastro
- comportamento ao acessar rotas diretamente pela URL

Problemas nesse fluxo podem impedir o acesso a funcionalidades importantes.

---

## 3.5 Comportamentos inesperados

Também foram considerados cenários que podem revelar falhas no sistema, como:

- envio do formulário com dados inválidos
- tentativa de inserir conteúdo HTML ou caracteres inesperados nos campos
- exclusão de cursos e atualização da interface
- inconsistências visuais ou erros de navegação

Esses testes ajudam a identificar comportamentos não previstos pela aplicação.
