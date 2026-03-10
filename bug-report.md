# Bug Report — Beedoo QA Challenge

## Sumário de Bugs

| ID | Título (resumido) |
|---|---|
| BUG-001 | Typo "Chalenge" no título da aplicação |
| BUG-002 | Rota `/new-course` retorna 404 em acesso direto |
| BUG-003 | Datas invertidas são aceitas sem validação |
| BUG-004 | Campo de vagas aceita valor zero ou negativo |
| BUG-005 | Nome do curso aceita apenas espaços em branco |
| BUG-006 | Typo no título da aplicação (versão detalhada duplicada) |
| BUG-007 | Rota `/new-course` retorna 404 (versão detalhada duplicada) |
| BUG-008 | Datas invertidas aceitas sem validação |
| BUG-009 | Vagas com valor negativo ou zero aceitas |
| BUG-010 | Campo "Nome do curso" aceita apenas espaços |
| BUG-011 | Instrutor e tipo de curso não são exibidos na listagem |
| BUG-012 | Formulário permite envio sem preencher campos obrigatórios |
| BUG-013 | Nome do curso aceita HTML sem escape |
| BUG-014 | Exclusão de curso não atualiza a listagem imediatamente |

---

### BUG-001 — Typo no título da aplicação

| Campo | Detalhe |
|---|---|
| **Título** | Título da aplicação exibe "Chalenge" em vez de "Challenge" |
| **Módulo** | Global — cabeçalho / navbar |
| **Severidade** | Baixa |
| **Impacto** | Problema visual que afeta a percepção de qualidade da aplicação, mas não interfere no funcionamento do sistema |

**Passos para reproduzir**  
Acessar qualquer página da aplicação e observar o cabeçalho.

**Resultado atual**
```
Beedoo QA Chalenge
```

**Resultado esperado**
```
Beedoo QA Challenge
```

**Correção**  
Substituir o literal `"Chalenge"` por `"Challenge"` no componente de cabeçalho.

---

### BUG-002 — Rota `/new-course` retorna 404 em acesso direto

| Campo | Detalhe |
|---|---|
| **Título** | Acesso direto à URL `/new-course` resulta em página 404 |
| **Módulo** | Roteamento / Configuração de deploy |
| **Severidade** | Média |
| **Impacto** | Usuários não conseguem acessar a tela de cadastro por link direto, bookmark ou link compartilhado |

**Passos para reproduzir**  
Digitar diretamente no navegador: `https://creative-sherbet-a51eac.netlify.app/new-course`

**Resultado atual**  
Página 404: *"Oops. Nothing here..."*

**Resultado esperado**  
O formulário de cadastro de cursos é exibido.

**Causa raiz**  
A aplicação é uma SPA. O roteamento é client-side; o servidor Netlify precisa redirecionar todas as rotas para `index.html`. O arquivo `_redirects` está ausente.

**Impacto**  
Links diretos compartilhados (e-mail, Slack, bookmarks) chegam em página de erro. Em CI, `cy.visit('/new-course')` falha — obriga todos os testes a navegar a partir de `/`.

**Correção**  
Adicionar `public/_redirects`:
```
/*  /index.html  200
```
---

### BUG-003 — Datas invertidas aceitas sem validação

| Campo | Detalhe |
|---|---|
| **Título** | Formulário aceita data de fim anterior à data de início |
| **Módulo** | Cadastro de Curso — validação de datas |
| **Severidade** | Alta |
| **Impacto** | Permite cadastro de cursos com período inválido, comprometendo relatórios e integridade dos dados |

| **Spec** | `05-negative-scenarios.cy.js` |

**Cenário**  
Data de início `2026-12-31` e data de fim `2026-01-01` — período logicamente inválido.

**Resultado suspeito**  
O formulário submete sem erro. Nenhum dos dois campos `input[type="date"]` possui validação cruzada nativa.

**Impacto se confirmado**  
Dados corrompidos na base, erros em cálculos de duração e relatórios downstream.

**Correção sugerida**
```javascript
if (new Date(dataFim) < new Date(dataInicio)) {
  setError('dataFim', { message: 'Data de fim deve ser após a data de início' })
  return
}
```

---

### BUG-004 — Vagas negativas ou zero aceitas

| Campo | Detalhe |
|---|---|
| **Título** | Campo "Número de vagas" aceita valores negativos ou zero |
| **Módulo** | Cadastro de Curso — campo de vagas |
| **Severidade** | Média |
| **Impacto** | Permite criação de cursos com capacidade inválida, gerando inconsistência nos dados |

| **Spec** | `05-negative-scenarios.cy.js` |

**Cenário**  
Campo `vagas` preenchido com `-1` ou `0`.

**Resultado suspeito**  
O atributo `min` não está definido no `input[type="number"]`, permitindo valores ≤ 0.

**Correção sugerida**
```html
<input type="number" name="vagas" min="1" required />
```

---

### BUG-005 — Nome do curso aceita somente espaços em branco

| Campo | Detalhe |
|---|---|
| **Título** | Campo obrigatório "Nome do curso" aceita apenas espaços em branco |
| **Módulo** | Cadastro de Curso — validação de campos de texto |
| **Severidade** | Média |
| **Impacto** | Permite cadastro de cursos sem identificação válida na listagem |

| **Spec** | `02-field-validations.cy.js` |

**Cenário**  
Campo `nomeCurso` preenchido com `"     "` (apenas espaços).

**Causa raiz suspeita**  
O HTML5 `required` não detecta strings compostas exclusivamente por espaços.

**Correção sugerida**
```javascript
if (!nomeCurso.trim()) {
  setError('nomeCurso', { message: 'Nome do curso não pode ser vazio' })
  return
}
```
---

## BUG-006 — Typo no título da aplicação

| Campo | Detalhe |
|---|---|
| **Título** | Título da aplicação exibe "Chalenge" em vez de "Challenge" |
| **Módulo** | Global — cabeçalho / `<title>` / navbar |
| **Severidade** | Baixa |
| **Impacto** | Problema visual que afeta a percepção de qualidade da aplicação, mas não interfere no funcionamento do sistema |

### Passos para reproduzir

1. Acessar https://creative-sherbet-a51eac.netlify.app/
2. Observar o título exibido na barra de navegação e no cabeçalho da página

### Resultado atual

```
Beedoo QA Chalenge
```

### Resultado esperado

```
Beedoo QA Challenge
```

### Evidência

Texto visível na navbar/header da aplicação em todas as páginas.

### Impacto

Impacto de percepção de marca. Embora não afete funcionalidade, demonstra falta de revisão de conteúdo e pode gerar questionamentos de credibilidade em ambiente de produção.

### Sugestão de correção

Corrigir o literal `"Chalenge"` para `"Challenge"` no componente de cabeçalho / arquivo de constantes ou `index.html`.

---

## BUG-007 — Rota `/new-course` retorna 404 em acesso direto

| Campo | Detalhe |
|---|---|
| **Título** | Acesso direto à URL `/new-course` resulta em página 404 |
| **Módulo** | Roteamento / Configuração de deploy |
| **Severidade** | Média |
| **Impacto** | Usuários não conseguem acessar a tela de cadastro por link direto, bookmark ou link compartilhado |

### Passos para reproduzir

1. Abrir nova aba do navegador
2. Digitar diretamente: `https://creative-sherbet-a51eac.netlify.app/new-course`
3. Teclar Enter

### Resultado atual

Página de erro 404:
```
404 — Oops. Nothing here...
[Go Home]
```

### Resultado esperado

O formulário de cadastro de cursos deve ser exibido normalmente.

### Causa raiz provável

A aplicação é uma **SPA (Single Page Application)**. Em SPAs, o roteamento é gerenciado pelo JavaScript no lado do cliente. Quando o usuário acessa uma rota diretamente (hard reload, link compartilhado, bookmark), o servidor web precisa redirecionar todas as requisições para o `index.html`.

No Netlify, isso é resolvido adicionando um arquivo `_redirects` na raiz do `public/` com o conteúdo:

```
/*  /index.html  200
```

Ou no `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Esse arquivo está ausente ou incorreto no deploy atual.

### Impacto

- Usuários que acessam links diretos (compartilhados via e-mail, Slack, bookmark) chegam em uma página de erro.
- Quebreia fluxos de deep linking.
- Afeta SEO e rastreamento de analytics por URL de entrada.
- Em automação Cypress, `cy.visit('/new-course')` falha — força workaround de sempre navegar a partir de `/`.

### Sugestão de correção

Adicionar o arquivo `public/_redirects`:

```
/*  /index.html  200
```

---

## BUG-008 — Datas invertidas aceitas sem validação

| Campo | Detalhe |
|---|---|
| **Título** | Formulário aceita data de fim anterior à data de início |
| **Módulo** | Cadastro de Curso — validação de datas |
| **Severidade** | Alta |
| **Impacto** | Permite cadastro de cursos com período inválido, comprometendo relatórios e integridade dos dados |

### Passos para reproduzir

1. Acessar https://creative-sherbet-a51eac.netlify.app/
2. Clicar em "CADASTRAR CURSO"
3. Preencher todos os campos obrigatórios
4. Definir **Data de início**: `2026-12-31`
5. Definir **Data de fim**: `2026-01-01`
6. Clicar em "Cadastrar"

### Resultado atual

O curso é cadastrado sem exibir mensagem de erro, mesmo com o período sendo logicamente inválido.

### Resultado esperado

O formulário deve bloquear o envio e exibir a mensagem:  
_"A data de fim deve ser igual ou posterior à data de início."_

### Impacto

Dados corrompidos na base. Cursos com período negativo podem causar erros downstream em relatórios, cálculos de duração e integrações.

### Sugestão de correção

Adicionar validação cruzada entre os campos de data no `onSubmit` do formulário:

```javascript
if (dataFim < dataInicio) {
  setError('dataFim', { message: 'Data de fim deve ser após a data de início' })
  return
}
```

---

## BUG-009 — Vagas com valor negativo ou zero aceitas

| Campo | Detalhe |
|---|---|
| **Título** | Campo "Número de vagas" aceita valores negativos ou zero |
| **Módulo** | Cadastro de Curso — campo de vagas |
| **Severidade** | Média |
| **Impacto** | Permite criação de cursos com capacidade inválida, gerando inconsistência nos dados |

### Resultado esperado

O formulário deve rejeitar valores ≤ 0 com mensagem de validação.

### Sugestão de correção

Adicionar o atributo `min="1"` no campo de vagas:

```html
<input type="number" name="vagas" min="1" required />
```
---

## BUG-010 — Campo "Nome do curso" aceita apenas espaços

| Campo | Detalhe |
|---|---|
| **Título** | Campo obrigatório "Nome do curso" aceita apenas espaços em branco |
| **Módulo** | Cadastro de Curso — validação de campos de texto |
| **Severidade** | Média |
| **Impacto** | Permite cadastro de cursos sem identificação válida na listagem |

### Resultado esperado

O HTML5 `required` não detecta strings compostas apenas de espaços — é necessário validação adicional (trim + required check).

### Sugestão de correção

```javascript
if (!nomeCurso.trim()) {
  setError('nomeCurso', { message: 'Nome do curso não pode ser vazio' })
  return
}
```
---

## BUG-011 — Campos coletados "Instrutor" e "Tipo de curso" não exibidos na listagem

| Campo | Detalhe |
|---|---|
| **Título** | Campos "Instrutor" e "Tipo de curso" não são exibidos nos cards da listagem |
| **Módulo** | Listagem de Cursos |
| **Severidade** | Média |
| **Impacto** | Informações importantes coletadas no cadastro não são exibidas ao usuário |

---

### Passos para reproduzir

1. Acessar o formulário de cadastro
2. Preencher todos os campos, incluindo **Instrutor** (ex.: "Profa. Ana Silva") e **Tipo de curso** (ex.: "Presencial")
3. Clicar em "Cadastrar"
4. Ser redirecionado para a listagem de cursos
5. Inspecionar o card do curso recém-cadastrado

### Resultado atual

O card exibe apenas: **nome do curso**, **descrição**, **data de início**, **data de fim**, **número de vagas** e botão "Excluir curso".  
Os campos **Instrutor** e **Tipo de curso** são completamente omitidos — a `div.text-overline.text-orange-9` (reservada para o tipo) é renderizada vazia.

### Resultado esperado

O card deveria exibir o nome do instrutor responsável e a modalidade do curso (Online / Presencial / Híbrido), dado que esses dados são coletados no formulário e são relevantes para quem consulta a listagem.

### Impacto

- **Informação coletada e descartada:** o usuário preenche campos que não têm efeito visível, gerando confusão e questionamento sobre a utilidade do formulário.
- **Invisibilidade de metadados:** um coordenador que consulta a lista não sabe quem ministra cada curso nem em qual formato ele é oferecido.
- **Inconsistência UX:** campos marcados visualmente como obrigatórios (ou destacados) no formulário não aparecem no produto final.

### Evidência técnica

Inspeção do DOM do card após criação de curso com todos os campos preenchidos:
```html
<div class="text-overline text-orange-9"></div>  <!-- vazio — tipo não renderizado -->
<div class="text-h5 q-mt-sm q-mb-xs">Nome do curso</div>
<div class="text-caption text-grey">Descrição</div>
<!-- Instrutor: ausente em todo o HTML do card -->
```

### Sugestão de correção

Renderizar os campos no template do card:
```html
<div class="text-overline text-orange-9">{{ curso.tipoCurso }}</div>
<div class="text-subtitle2">{{ curso.instrutor }}</div>
```

---

---

## BUG-012 — Formulário aceita envio sem preencher campos obrigatórios

| Campo | Detalhe |
|---|---|
| **Título** | Formulário permite envio mesmo com campos obrigatórios vazios |
| **Módulo** | Cadastro de Curso — validação de formulário |
| **Severidade** | Alta |
| **Impacto** | Permite criação de registros inválidos ou incompletos no sistema |

### Passos para reproduzir

1. Acessar o formulário de cadastro via SPA (link "Cadastrar curso")
2. Não preencher nenhum campo
3. Clicar em "Cadastrar"

### Resultado atual

O formulário navega para a listagem (`/`) e cria uma entrada vazia (ou com valores padrão inválidos). Nenhuma mensagem de erro é exibida.

### Resultado esperado

O envio deve ser bloqueado e o usuário deve receber feedback visual sobre quais campos são obrigatórios.

### Causa raiz

O botão usa `type="button"`, contornando a validação nativa do HTML5. O Quasar pode aplicar validação programática via `v-model` + regras no `QForm`, mas a camada de validação não foi implementada.

### Impacto

Registros corrompidos entram na base — nome nulo, sem instrutor, sem datas. Qualquer feature downstream (relatórios, filtros, contagem de vagas) é afetada.

### Sugestão de correção

```javascript
// No componente Quasar:
<q-form @submit.prevent="onSubmit" ref="formRef">
  <q-input v-model="nomeCurso" :rules="[v => !!v || 'Campo obrigatório']" ... />
  ...
  <q-btn type="submit" @click="$refs.formRef.validate()" ...>Cadastrar</q-btn>
</q-form>
```

---

## BUG-013 — XSS armazenado: nome do curso com tags HTML é renderizado sem escape

| Campo | Detalhe |
|---|---|
| **Título** | Campo "Nome do curso" permite inserção de HTML sem escape |
| **Módulo** | Listagem de Cursos — renderização de conteúdo |
| **Severidade** | Crítica |
| **Impacto** | Vulnerabilidade de segurança que permite execução de scripts maliciosos no navegador de outros usuários |

### Passos para reproduzir

1. No campo "Nome do curso", inserir: `<script>alert('xss')</script>`
2. Preencher os demais campos e submeter
3. Navegar para a listagem de cursos

### Resultado atual

O `<script>` é inserido no DOM como elemento real. O `innerHTML` do card contém:
```html
<div class="text-h5">Curso <script>alert('xss')</script> &amp; "Aspas"</div>
```
O elemento `<script>` existe no DOM e pode ser executado por navegadores permissivos ou futuros vetores de injeção.

### Resultado esperado

O valor deve ser tratado como texto literal. O card deve exibir:
```
Curso <script>alert('xss')</script> & "Aspas"
```
com os caracteres especiais escapados: `&lt;script&gt;alert('xss')&lt;/script&gt;`.

### Causa raiz

O Vue/Quasar usa `v-html` ou bind de template sem sanitização adequada para o nome do curso no card. O binding correto (`{{ nomeCurso }}`) escapa automaticamente.

### Impacto

**Risco máximo de segurança.** Qualquer usuário que consiga cadastrar um curso pode injetar scripts que afetam TODOS os usuários que visualizarem a listagem. Classificado como **OWASP A03:2021 — Injection (Stored XSS)**.

### Sugestão de correção

Substituir qualquer uso de `v-html` no template do card por double-mustache binding:
```html
<!-- ERRADO -->
<div v-html="nomeCurso" />

<!-- CORRETO -->
<div>{{ nomeCurso }}</div>
```
Adicionalmente, sanitizar entradas no servidor antes de persistir.

---

## BUG-014 — Exclusão de curso não atualiza a listagem reativamente

| Campo | Detalhe |
|---|---|
| **Título** | Após excluir um curso, o card permanece visível até recarregar a página |
| **Módulo** | Listagem de Cursos — exclusão |
| **Severidade** | Média |
| **Impacto** | Interface não reflete imediatamente a ação do usuário, gerando confusão e possível repetição da ação |

### Passos para reproduzir

1. Cadastrar um curso qualquer
2. Navegar para a listagem
3. Clicar no botão "Excluir curso" do card
4. Observar a listagem imediatamente após o clique

### Resultado atual

O card do curso permanece na tela. Somente após pressionar F5 (recarga de página completa) o card desaparece, confirmando que a exclusão foi persistida no backend.

### Resultado esperado

O card deve ser removido da listagem **imediatamente** após a confirmação da exclusão, sem necessidade de recarga.

### Causa raiz

A ação de exclusão provavelmente faz a chamada à API corretamente, mas não atualiza o estado reativo do componente (array de cursos no Vue store ou `ref`). O card permanece no DOM porque o estado local não foi modificado.

### Impacto

Confusão do usuário: o botão aparenta não funcionar, podendo levar a cliques repetidos e múltiplas tentativas de exclusão. Degrada significativamente a experiência de uso.

### Sugestão de correção

```javascript
// Após a chamada de exclusão ter sucesso:
const index = cursos.value.findIndex(c => c.id === cursoId)
if (index !== -1) cursos.value.splice(index, 1)
```

