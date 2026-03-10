// =============================================================================
// cypress/support/commands.js
//
// Custom commands e mapa centralizado de seletores.
// A app usa Quasar Framework (Vue): não há placeholder nem <select> nativo.
// Todos os campos são identificados por aria-label.
// O "select" de tipo de curso é um combobox Quasar — requer click + opção no popup.
// =============================================================================

// -----------------------------------------------------------------------------
// SELECTOR MAP
// -----------------------------------------------------------------------------
const SELECTORS = {
  // ── Navegação ───────────────────────────────────────────────────────────────
  navListarCursos:   'a[href="/"]',
  navCadastrarCurso: 'a[href="/new-course"]',

  // ── Formulário de cadastro (Quasar — aria-label é o seletor estável) ────────
  nomeCurso:   'input[aria-label="Nome do curso"]',
  descricao:   'textarea[aria-label="Descrição do curso"]',
  instrutor:   'input[aria-label="Instrutor"]',
  urlImagem:   'input[aria-label="Url da imagem de capa"]',
  dataInicio:  'input[aria-label="Data de início"]',
  dataFim:     'input[aria-label="Data de fim"]',
  vagas:       'input[aria-label="Número de vagas"]',
  // Quasar q-select: o input interno é o focus-target (role=combobox)
  tipoCursoTrigger: 'input[aria-label="Tipo de curso"]',
  btnCadastrar:     'button.bg-orange',

  // ── Listagem ────────────────────────────────────────────────────────────────
  // Quasar cards: .q-card dentro do container .row.q-col-gutter-md
  courseCard: '.q-card',
  // Botão excluir: classe text-red e texto "Excluir curso"
  btnExcluir: 'button.text-red',
}

Cypress.SELECTORS = SELECTORS

// -----------------------------------------------------------------------------
// NAVEGAÇÃO
// -----------------------------------------------------------------------------

Cypress.Commands.add('goToListing', () => {
  cy.visit('/')
  cy.contains('Lista de cursos').should('be.visible')
})

Cypress.Commands.add('goToNewCourse', () => {
  cy.visit('/')
  cy.get(SELECTORS.navCadastrarCurso).first().click()
  cy.url().should('include', '/new-course')
  // Aguarda o formulário Quasar montar
  cy.get(SELECTORS.nomeCurso).should('be.visible')
})

// -----------------------------------------------------------------------------
// FORMULÁRIO
// -----------------------------------------------------------------------------

/**
 * Preenche o formulário de cadastro com os dados fornecidos.
 * Campos não incluídos no objeto são ignorados.
 * O campo tipoCurso usa o combobox Quasar (click + seleção no popup).
 */
Cypress.Commands.add('fillCourseForm', (data = {}) => {
  if (data.nomeCurso !== undefined) {
    cy.get(SELECTORS.nomeCurso).clear()
    if (data.nomeCurso !== '') cy.get(SELECTORS.nomeCurso).type(data.nomeCurso)
  }
  if (data.descricao !== undefined) {
    cy.get(SELECTORS.descricao).clear()
    if (data.descricao !== '') cy.get(SELECTORS.descricao).type(data.descricao)
  }
  if (data.instrutor !== undefined) {
    cy.get(SELECTORS.instrutor).clear()
    if (data.instrutor !== '') cy.get(SELECTORS.instrutor).type(data.instrutor)
  }
  if (data.urlImagem !== undefined && data.urlImagem !== '') {
    cy.get(SELECTORS.urlImagem).clear().type(data.urlImagem)
  }
  if (data.dataInicio !== undefined) {
    cy.get(SELECTORS.dataInicio).clear()
    if (data.dataInicio !== '') cy.get(SELECTORS.dataInicio).type(data.dataInicio)
  }
  if (data.dataFim !== undefined) {
    cy.get(SELECTORS.dataFim).clear()
    if (data.dataFim !== '') cy.get(SELECTORS.dataFim).type(data.dataFim)
  }
  if (data.vagas !== undefined) {
    cy.get(SELECTORS.vagas).clear()
    if (data.vagas !== '') cy.get(SELECTORS.vagas).type(String(data.vagas))
  }
  if (data.tipoCurso !== undefined) {
    cy.get(SELECTORS.tipoCursoTrigger).closest('.q-field').click()
    cy.get('.q-menu').should('be.visible')
    cy.get('.q-menu .q-item').contains(data.tipoCurso).click()
  }
})

Cypress.Commands.add('submitCourseForm', () => {
  cy.get(SELECTORS.btnCadastrar).click()
})

Cypress.Commands.add('createCourse', (data) => {
  cy.goToNewCourse()
  cy.fillCourseForm(data)
  cy.submitCourseForm()
})

// -----------------------------------------------------------------------------
// ASSERÇÕES
// -----------------------------------------------------------------------------

Cypress.Commands.add('courseExistsInList', (name) => {
  cy.goToListing()
  cy.contains(name).should('be.visible')
})

Cypress.Commands.add('courseNotInList', (name) => {
  cy.goToListing()
  cy.contains(name).should('not.exist')
})

