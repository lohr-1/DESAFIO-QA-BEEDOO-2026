// =============================================================================
// 01 — CADASTRO DE CURSO
//
// Happy path: form rendering, complete registration, optional-field omission.
// Each assertion here has a clear, reachable failure mode.
// =============================================================================

describe('Cadastro de Curso', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => {
      courses = data
    })
  })

  beforeEach(() => {
    cy.goToNewCourse()
  })

  it('exibe todos os campos obrigatórios do formulário', () => {
    cy.get(Cypress.SELECTORS.nomeCurso).should('be.visible')
    cy.get(Cypress.SELECTORS.descricao).should('be.visible')
    cy.get(Cypress.SELECTORS.instrutor).should('be.visible')
    cy.get('input[type="date"]').should('have.length.gte', 2)
    cy.get(Cypress.SELECTORS.vagas).should('be.visible')
    // O input real do Quasar q-select tem opacity:0 — verificar o container visível
    cy.get(Cypress.SELECTORS.tipoCursoTrigger).closest('.q-field').should('be.visible')
    cy.get(Cypress.SELECTORS.btnCadastrar).should('be.visible')
  })

  it('cadastra curso com todos os campos e persiste os dados na listagem', () => {
    const { nomeCurso, descricao } = courses.valid

    cy.fillCourseForm(courses.valid)
    cy.submitCourseForm()
    cy.url().should('not.include', '/new-course')

    cy.goToListing()
    // O card exibe nome e descrição (instrutor e tipo não são renderizados — ver BUG-006)
    cy.contains(nomeCurso).should('be.visible')
    cy.contains(descricao).should('be.visible')
  })

  it('aceita cadastro sem URL de imagem (campo opcional)', () => {
    cy.fillCourseForm(courses.minimalValid)
    cy.submitCourseForm()
    cy.courseExistsInList(courses.minimalValid.nomeCurso)
  })
})
