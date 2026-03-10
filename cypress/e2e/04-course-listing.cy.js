// =============================================================================
// 04 — LISTAGEM DE CURSOS
//
// Cobre: precisão dos dados no card, persistência após reload e
// navegação bidirecional entre as duas rotas do app.
// =============================================================================

describe('Listagem de Cursos', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => { courses = data })
  })

  it('exibe título "Lista de cursos" e link para cadastro', () => {
    cy.goToListing()
    cy.contains('Lista de cursos').should('be.visible')
    cy.get(Cypress.SELECTORS.navCadastrarCurso).first().should('be.visible')
  })

  it('exibe nome e descrição corretos no card após cadastro', () => {
    const { nomeCurso, descricao } = courses.valid
    cy.createCourse(courses.valid)
    cy.goToListing()
    // Instrutor e tipo de curso não são renderizados no card (ver BUG-006)
    cy.contains(nomeCurso).should('be.visible')
    cy.contains(descricao).should('be.visible')
  })

  it('dados do curso persistem após recarregamento da página', () => {
    cy.createCourse(courses.minimalValid)
    cy.goToListing()
    cy.reload()
    cy.contains(courses.minimalValid.nomeCurso).should('be.visible')
  })

  it('navegação entre listagem e formulário funciona nos dois sentidos', () => {
    cy.goToListing()
    cy.get(Cypress.SELECTORS.navCadastrarCurso).first().click()
    cy.url().should('include', '/new-course')

    cy.get(Cypress.SELECTORS.navListarCursos).first().click()
    cy.contains('Lista de cursos').should('be.visible')
  })
})
