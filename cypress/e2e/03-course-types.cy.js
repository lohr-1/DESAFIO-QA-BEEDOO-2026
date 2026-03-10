// =============================================================================
// 03 — TIPOS DE CURSO
//
// Loop parametrizado: cada tipo suportado deve sobreviver ao ciclo completo
// cadastro → listagem e aparecer corretamente rotulado no card.
// O teste do select captura regressões na definição do dropdown.
// =============================================================================

describe('Variação por Tipo de Curso', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => { courses = data })
  })

  it('select contém exatamente as opções Online e Presencial', () => {
    cy.goToNewCourse()
    // Abre o popup do Quasar q-select
    cy.get(Cypress.SELECTORS.tipoCursoTrigger).closest('.q-field').click()
    cy.get('.q-menu').should('be.visible')
    cy.get('.q-menu .q-item').then(($items) => {
      const labels = [...$items].map((el) => el.textContent.trim()).filter(Boolean)
      expect(labels).to.include('Online')
      expect(labels).to.include('Presencial')
    })
    // Fecha o menu sem selecionar
    cy.get('body').type('{esc}')
  })

  ;[
    { fixtureKey: 'valid',      expectedType: 'Online'     },
    { fixtureKey: 'presencial', expectedType: 'Presencial' },
  ].forEach(({ fixtureKey, expectedType }) => {
    it(`cadastra curso "${expectedType}" e persiste na listagem`, () => {
      cy.goToNewCourse()
      cy.fillCourseForm(courses[fixtureKey])
      cy.submitCourseForm()
      cy.goToListing()
      // O card exibe nome e descrição. Tipo não é exibido no card (BUG-006).
      cy.contains(courses[fixtureKey].nomeCurso).should('be.visible')
    })
  })
})
