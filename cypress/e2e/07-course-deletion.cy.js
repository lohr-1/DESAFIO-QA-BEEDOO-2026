// =============================================================================
// 07 — EXCLUSÃO DE CURSOS
//
// Usa nomes únicos por run (Date.now) para evitar polução entre testes.
// Se o app não implementar exclusão, os testes falharão com seletor ausente —
// isso é informativo, não ruido: expeõe uma feature não entregue.
// =============================================================================

describe('Exclusão de Cursos', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => { courses = data })
  })

  it('remove o curso da listagem imediatamente após excluir', () => {
    const name = `Excluir Imediato ${Date.now()}`
    cy.createCourse({ ...courses.forDeletion, nomeCurso: name })
    cy.goToListing()
    cy.contains(name)
      .closest(Cypress.SELECTORS.courseCard)
      .find(Cypress.SELECTORS.btnExcluir)
      .click()
    cy.contains(name).should('not.exist')
  })

  it('demais cursos permanecem na lista após excluir um', () => {
    const keep   = `Manter ${Date.now()}`
    const remove = `Remover ${Date.now() + 1}`

    cy.createCourse({ ...courses.valid,       nomeCurso: keep   })
    cy.createCourse({ ...courses.forDeletion, nomeCurso: remove })
    cy.goToListing()

    cy.contains(remove)
      .closest(Cypress.SELECTORS.courseCard)
      .find(Cypress.SELECTORS.btnExcluir)
      .click()

    cy.contains(remove).should('not.exist')
    cy.contains(keep).should('be.visible')
  })

  it('curso excluído não reaparece após recarregar a página', () => {
    const name = `Persistência ${Date.now()}`
    cy.createCourse({ ...courses.forDeletion, nomeCurso: name })
    cy.goToListing()
    cy.contains(name)
      .closest(Cypress.SELECTORS.courseCard)
      .find(Cypress.SELECTORS.btnExcluir)
      .click()
    cy.reload()
    cy.contains(name).should('not.exist')
  })
})
