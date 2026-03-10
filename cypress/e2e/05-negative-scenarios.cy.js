// =============================================================================
// 05 — CENÁRIOS NEGATIVOS
//
// Cada teste aponta uma lacuna de validação concreta.
// Datas invertidas e vagas inválidas vão FALHAR se o app não implementar
// esses bloqueios — essa falha é o sinal intencional, não um defeito do teste.
// A asserção XSS é um requisito de segurança, não opcional.
// =============================================================================

describe('Cenários Negativos', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => { courses = data })
  })

  beforeEach(() => {
    cy.goToNewCourse()
  })

  context('Validação de datas', () => {
    it('rejeita data de fim anterior à data de início', () => {
      // dataInicio: 2026-12-31 — dataFim: 2026-01-01: período logicamente inválido
      cy.fillCourseForm(courses.invalidDates)
      cy.submitCourseForm()
      cy.url().should('include', '/new-course')
    })
  })

  context('Validação de vagas', () => {
    it('rejeita número de vagas negativo', () => {
      cy.fillCourseForm(courses.negativeVacancies) // vagas: -1
      cy.submitCourseForm()
      cy.url().should('include', '/new-course')
    })

    it('rejeita zero vagas', () => {
      cy.fillCourseForm(courses.zeroVacancies) // vagas: 0
      cy.submitCourseForm()
      cy.url().should('include', '/new-course')
    })
  })

  context('Segurança — injeção', () => {
    it('não executa payload XSS armazenado na listagem', () => {
      cy.fillCourseForm(courses.specialChars)
      cy.submitCourseForm()
      cy.goToListing()
      // O markup bruto <script> não deve existir como elemento executável no DOM
      cy.document().then((doc) => {
        expect(doc.body.innerHTML).not.to.include('<script>alert(')
      })
    })

    it('trata payload de SQL injection como texto literal sem crash', () => {
      cy.fillCourseForm(courses.sqlInjection)
      cy.submitCourseForm()
      cy.get('body').should('be.visible')
    })
  })
})
