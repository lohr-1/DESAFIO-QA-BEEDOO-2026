# Beedoo QA Challenge — Cypress E2E Test Suite

> Suite de testes end-to-end do módulo de **cadastro e listagem de cursos** da aplicação [Beedoo QA Challenge](https://creative-sherbet-a51eac.netlify.app/).

---

## Análise da aplicação

### Rotas

| Rota | Função |
|---|---|
| `/` | Listagem de cursos |
| `/new-course` | Formulário de cadastro (inacessível via URL direta — ver BUG-002) |

### Campos do formulário

| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome do curso | `text` | ✅ |
| Descrição | `text/textarea` | ✅ |
| Instrutor | `text` | ✅ |
| URL da imagem | `url` | ❌ |
| Data de início | `date` | ✅ |
| Data de fim | `date` | ✅ |
| Número de vagas | `number` | ✅ |
| Tipo do curso | `select` | ✅ (Online / Presencial / Híbrido) |

### Bugs identificados

| ID | Severidade | Resumo | Confirmado |
|---|---|---|---|
| BUG-001 | Low | Typo “Chalenge” no título | ✅ |
| BUG-002 | Medium | `/new-course` retorna 404 em acesso direto | ✅ |
| BUG-003 | High | Datas invertidas aceitas sem validação | Suspeito |
| BUG-004 | Medium | Vagas negativas/zero aceitas | Suspeito |
| BUG-005 | Low | Nome com apenas espaços aceito | Suspeito |

Detalhes completos em [`bug-report.md`](./bug-report.md).

---

## Estrutura do projeto

```
beedoo-qa-challenge/
├── cypress/
│   ├── e2e/
│   │   ├── 01-course-registration.cy.js   # Happy path (3 testes)
│   │   ├── 02-field-validations.cy.js     # Obrigatoriedade + whitespace (8 testes)
│   │   ├── 03-course-types.cy.js          # forEach Online/Presencial/Híbrido (4 testes)
│   │   ├── 04-course-listing.cy.js        # Listagem, persistência, navegação (4 testes)
│   │   ├── 05-negative-scenarios.cy.js    # Datas, vagas, XSS, SQL injection (5 testes)
│   │   ├── 06-unexpected-behaviors.cy.js  # BUG-002 + Enter + mobile (4 testes)
│   │   └── 07-course-deletion.cy.js       # Exclusão e persistência (3 testes)
│   ├── fixtures/courses.json            # Massa de dados centralizada
│   └── support/
│       ├── commands.js                  # Custom commands + SELECTORS centralizado
│       └── e2e.js                       # Setup global
├── cypress.config.js
├── package.json
├── bug-report.md
└── README.md
```

**Total:** ~31 testes, todos com modo de falha claro e deliberado.

---

## Pré-requisitos e instalação

```bash
# Node.js ≥ 18
npm install
```

---

## Execução

```bash
# Interface gráfica (desenvolvimento)
npm run cy:open

# Headless — todos os specs
npm run cy:run:headless

# Spec específico
npm run cy:run:registration
npm run cy:run:validations
npm run cy:run:types
npm run cy:run:listing
npm run cy:run:negative
npm run cy:run:edge
npm run cy:run:delete

# Apontando para outro ambiente
CYPRESS_BASE_URL=http://staging.example.com npm run cy:run
```

---

## Decisões técnicas

### Seletores em um único lugar

`commands.js` exporta um objeto `SELECTORS` centralizado. Mudar um seletor exige alteração em um único arquivo — nenhum spec precisa saber como o DOM está estruturado.

Prioridade adotada: `data-testid` → `name` → `placeholder` → tipo+posição (last resort).

### Testes paramétricos em vez de repetição

`02-field-validations` usa `forEach` sobre os campos obrigatórios. `03-course-types` usa `forEach` sobre os tipos de curso. Adicionar um novo campo ou tipo requer uma linha na array — não um novo bloco `it`.

### Testes que devem falhar intencionalmente

`06-unexpected-behaviors` contém o teste do BUG-002, que **falhará enquanto o bug existir**. Isso é deliberado: o vermelho no CI é evidência do bug, não um problema da suite.

O mesmo vale para os cenários negativos em `05`: se datas invertidas e vagas negativas passarem sem bloqueio, os testes falham — expondo lacunas de validação reais.

### Isolamento de dados em testes de exclusão

Testes em `07` usam `Date.now()` no nome do curso para garantir unicidade por run e evitar dependência de estado compartilhado entre testes.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Análise da Aplicação](#análise-da-aplicação)
3. [Estratégia de Testes](#estratégia-de-testes)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Pré-requisitos](#pré-requisitos)
6. [Instalação](#instalação)
7. [Execução](#execução)
8. [Casos de Teste](#casos-de-teste)
9. [Decisões Técnicas](#decisões-técnicas)
10. [Bugs Conhecidos](#bugs-conhecidos)
11. [Melhorias Futuras](#melhorias-futuras)

---

## Visão Geral

| Item | Detalhe |
|---|---|
| **AUT** | https://creative-sherbet-a51eac.netlify.app/ |
| **Framework** | Cypress 13.x |
| **Linguagem** | JavaScript (ES6+) |
| **Node mínimo** | 18.0.0 |
| **Specs** | 7 arquivos / ~50 cenários |

---

## Análise da Aplicação

### Rotas identificadas

| Rota | Função |
|---|---|
| `/` | Listagem de cursos |
| `/new-course` | Formulário de cadastro |

### Campos do formulário de cadastro

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| Nome do curso | `text` | ✅ | Único identificador visual |
| Descrição | `text / textarea` | ✅ | |
| Instrutor | `text` | ✅ | |
| URL da imagem de capa | `url` | ❌ | Campo opcional |
| Data de início | `date` | ✅ | Formato YYYY-MM-DD |
| Data de fim | `date` | ✅ | Deve ser ≥ data de início |
| Número de vagas | `number` | ✅ | Deve ser > 0 |
| Tipo do curso | `select` | ✅ | Online / Presencial / Híbrido |

### Bugs identificados (exploratório)

| ID | Severidade | Resumo |
|---|---|---|
| BUG-001 | Low | Typo no título: `"Chalenge"` em vez de `"Challenge"` |
| BUG-002 | Medium | Acesso direto a `/new-course` retorna 404 (falta de redirect rule no Netlify) |

> Consulte [`bug-report.md`](./bug-report.md) para reporte completo.

---

## Estratégia de Testes

### Pirâmide adotada

```
        [E2E - Cypress]
    Fluxos críticos de negócio
   ──────────────────────────────
  Validações de formulário / UI
 ──────────────────────────────────
Dados de borda / Cenários negativos
```

### Critérios de priorização (MoSCoW)

| Prioridade | Cenário |
|---|---|
| **Must** | Cadastro com sucesso, campos obrigatórios, listagem |
| **Should** | Variação por tipo, deleção |
| **Could** | Edge cases, responsividade, XSS/SQL injection |
| **Won't** | Testes de performance, acessibilidade completa (fora de escopo) |

---

## Estrutura do Projeto

```
beedoo-qa-challenge/
├── cypress/
│   ├── e2e/
│   │   ├── 01-course-registration.cy.js   # Happy path — cadastro completo
│   │   ├── 02-field-validations.cy.js     # Campos obrigatórios
│   │   ├── 03-course-types.cy.js          # Variação por tipo
│   │   ├── 04-course-listing.cy.js        # Listagem e navegação
│   │   ├── 05-negative-scenarios.cy.js    # Datas inválidas, vagas negativas, XSS
│   │   ├── 06-unexpected-behaviors.cy.js  # Edge cases e bugs documentados
│   │   └── 07-course-deletion.cy.js       # Exclusão de cursos
│   ├── fixtures/
│   │   └── courses.json                   # Massa de dados centralizada
│   └── support/
│       ├── commands.js                    # Custom commands + mapa de seletores
│       └── e2e.js                         # Setup global
├── .gitignore
├── bug-report.md
├── cypress.config.js
├── package.json
└── README.md
```

---

## Pré-requisitos

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Chrome** ou **Electron** (instalados pelo Cypress automaticamente)

---

## Instalação

```bash
# 1. Clone ou extraia o projeto
cd beedoo-qa-challenge

# 2. Instale as dependências
npm install
```

---

## Execução

### Interface gráfica (desenvolvimento)

```bash
npm run cy:open
```

### Headless — todos os specs (CI/CD)

```bash
npm run cy:run:headless
```

### Por spec individual

```bash
npm run cy:run:registration    # 01 — cadastro
npm run cy:run:validations     # 02 — campos obrigatórios
npm run cy:run:types           # 03 — tipos de curso
npm run cy:run:listing         # 04 — listagem
npm run cy:run:negative        # 05 — cenários negativos
npm run cy:run:edge            # 06 — edge cases
npm run cy:run:delete          # 07 — exclusão
```

### Apontando para outro ambiente

```bash
CYPRESS_BASE_URL=http://staging.example.com npm run cy:run
```

---

## Casos de Teste

### 01 — Cadastro de Curso

| # | Cenário | Resultado esperado |
|---|---|---|
| 1.1 | Formulário exibe todos os campos | Todos os inputs visíveis |
| 1.2 | Cadastro Online com todos os campos | Redireciona + curso na listagem |
| 1.3 | Cadastro sem URL de imagem (campo opcional) | Aceito sem erro |
| 1.4 | Dados exibidos corretamente no card | Nome e instrutor visíveis |
| 1.5 | Redirecionamento após cadastro | URL ≠ `/new-course` |
| 1.6 | Tipo do curso preservado na listagem | Card exibe tipo correto |
| 1.7 | Múltiplos cadastros sequenciais | Todos os cursos na lista |

### 02 — Validação de Campos

| # | Cenário | Resultado esperado |
|---|---|---|
| 2.1 | Formulário completamente vazio | Permanece em `/new-course` |
| 2.2–2.8 | Cada campo obrigatório vazio | Form bloqueado + feedback visual |
| 2.9 | Indicação visual de erro | `:invalid` ou `.error` presente |

### 03 — Tipos de Curso

| # | Cenário | Resultado esperado |
|---|---|---|
| 3.1 | Cadastro tipo Online | Card exibe "Online" |
| 3.2 | Cadastro tipo Presencial | Card exibe "Presencial" |
| 3.3 | Cadastro tipo Híbrido | Card exibe "Híbrido" |
| 3.4 | Select contém ≥ 3 opções | Assertion passa |
| 3.5 | Cards distintos para tipos distintos | Ambos visíveis na lista |

### 04 — Listagem

| # | Cenário | Resultado esperado |
|---|---|---|
| 4.1 | Página carrega sem erros | Body visível |
| 4.2 | Título "Lista de cursos" | Visível |
| 4.3 | Links de navegação presentes | Visíveis |
| 4.4 | Curso recém-cadastrado aparece | Visível na lista |
| 4.5 | Instrutor exibido no card | Visible |
| 4.6 | Tipo exibido no card | Visível |
| 4.7 | Dados persistem após reload | Curso ainda visível |
| 4.8 | Múltiplos cursos na lista | Todos visíveis |
| 4.9–4.10 | Navegação bidirecional | URLs corretas |

### 05 — Cenários Negativos

| # | Cenário | Resultado esperado |
|---|---|---|
| 5.1 | Data fim < Data início | Bloqueado ou exibe erro |
| 5.2 | Data início = Data fim | Comportamento definido |
| 5.3 | Data de início no passado | Bloqueado ou aviso |
| 5.4 | Vagas negativas | Rejeitado |
| 5.5 | Zero vagas | Rejeitado ou aviso |
| 5.6 | Vagas decimais | Rejeitado |
| 5.7 | Strings extremamente longas | UI não quebra |
| 5.8 | Payload XSS | `<script>` não executado |
| 5.9 | Payload SQL Injection | Aplicação estável |
| 5.10 | URL de imagem inválida | UI não quebra |

### 06 — Edge Cases

| # | Cenário | Resultado esperado |
|---|---|---|
| 6.1 | [BUG-001] Typo "Chalenge" presente | Documenta o bug |
| 6.2 | [BUG-002] Acesso direto `/new-course` | Documenta se 404 |
| 6.3 | Enter em campo de texto | Não submete form incompleto |
| 6.4 | Reload limpa campos | Campos vazios após reload |
| 6.5 | Clique duplo no submit | Sem duplicata |
| 6.6 | Navegar → voltar → form | Form carrega sem erro |
| 6.7 | Botão submit visível sem scroll | Acessível |
| 6.8 | Espaços no campo de nome | Rejeitado como vazio |
| 6.9 | Números no campo de nome | Aceito |
| 6.10 | Emoji no campo de nome | Sem crash |
| 6.11–6.12 | Viewport 375x667 | Formulário e listagem responsive |

### 07 — Exclusão

| # | Cenário | Resultado esperado |
|---|---|---|
| 7.1 | Botão excluir presente por card | Visível |
| 7.2 | Excluir remove curso da lista | `not.exist` |
| 7.3 | Demais cursos preservados | Still visible |
| 7.4 | Atualização sem reload | DOM atualizado dinamicamente |
| 7.5 | Curso excluído não regressa após reload | Persistência |
| 7.6 | Exclusão em bulk (3 cursos) | Todos removidos |
| 7.7 | Diálogo de confirmação (se implementado) | Observacional |

---

## Decisões Técnicas

### Seletores resilientes

O `commands.js` expõe um **`SELECTORS` object** centralizado. Todos os testes consomem seletores apenas via custom commands, não diretamente — isso garante que mudanças na UI requeiram alteração em um único lugar.

Prioridade dos seletores:
1. `data-testid` / `data-cy` (mais estável)
2. atributo `name`
3. `placeholder` (visível na UI, geralmente único)
4. tipo + posição (`input[type="date"]:eq(0)`) — último recurso

### Custom Commands

| Command | Propósito |
|---|---|
| `cy.goToListing()` | Navega para `/` e aguarda título |
| `cy.goToNewCourse()` | Navega via link de nav (SPA safe) |
| `cy.fillCourseForm(data)` | Preenche apenas os campos fornecidos |
| `cy.submitCourseForm()` | Clica no submit |
| `cy.createCourse(data)` | Composição dos três anteriores |
| `cy.courseExistsInList(name)` | Asserção de presença na lista |
| `cy.courseNotInList(name)` | Asserção de ausência |
| `cy.deleteCourse(name)` | Localiza card e clica em excluir |

### Gestão de dados

- **Fixtures** (`courses.json`): massa de dados centralizada com 10 perfis de dados (válido, por tipo, inválido, para exclusão, payloads de segurança).
- **Nomes únicos com `Date.now()`**: usados em testes de exclusão para evitar colisão entre runs.

### Tolerância a comportamentos incertos

Cenários negativos operam com `cy.url().then()` + `cy.log()` para documentar comportamentos ao invés de falhar rigidamente — permitindo que a suite rode de ponta a ponta e produza um relatório completo, enquanto flagra regressões potenciais nos logs.

---

## Bugs Conhecidos

| ID | Severidade | Impacto |
|---|---|---|
| BUG-001 | Low | Experiência de marca — "Chalenge" ≠ "Challenge" |
| BUG-002 | Medium | Link direto para formulário retorna 404 em produção |

Detalhes completos em [`bug-report.md`](./bug-report.md).

---

## Melhorias Futuras

- **Interceptação de rede** (`cy.intercept`): mockar e validar payloads da API quando o backend for exposto.
- **Acessibilidade**: integrar `cypress-axe` para auditorias WCAG automatizadas.
- **Tags de teste**: adicionar `@smoke`, `@regression`, `@critical` com `cypress-grep` para execução granular em CI.
- **Relatórios**: configurar `mochawesome` ou Allure para reports HTML exportáveis.
- **CI/CD**: adicionar pipeline GitHub Actions com execução paralela por spec.
- **Visual regression**: integrar `percy` ou `cypress-image-snapshot` para detectar mudanças visuais.
