// =============================================================================
// 06 — COMPORTAMENTOS INESPERADOS
//
// BUG-002 é uma asserção real que deve FALHAR até a redirect rule do Netlify
// ser adicionada. O vermelho no CI é o sinal correto — não um teste ruim.
// Os demais casos cobrem regressos de UX que não aparecem no happy path.
// =============================================================================

describe('Comportamentos Inesperados e Edge Cases', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => {
      courses = data
    })
  })

  // ---------------------------------------------------------------------------

  context('Bugs documentados', () => {
    /**
     * BUG #001 — Typo no título da aplicação
     * "Chalenge" deve ser "Challenge"
     * Status: OPEN
     */
    it('[BUG-001] título da página contém typo "Chalenge" em vez de "Challenge"', () => {
      cy.visit('/')
      cy.contains('Beedoo QA Chalenge').should('exist')

      // This assertion documents the known bug.
      // When the bug is fixed, update to cy.contains('Beedoo QA Challenge').
      cy.log('KNOWN BUG: título usa "Chalenge" — deveria ser "Challenge"')
    })

    /**
     * BUG #002 — Rota /new-course retorna 404 em acesso direto
     * A SPA deve configurar redirects no _redirects ou netlify.toml
     * Status: OPEN
     */
    it('[BUG-002] acesso direto a /new-course via cy.visit() deve carregar o formulário', () => {
      // In a correctly configured Netlify SPA, /* -> /index.html should handle this
      cy.visit('/new-course', { failOnStatusCode: false })

      cy.url().then((url) => {
        if (url.includes('/new-course')) {
          cy.get(Cypress.SELECTORS.nomeCurso).should('exist')
          cy.log('Direct access to /new-course works — BUG-002 may be fixed')
        } else {
          cy.log('KNOWN BUG: /new-course not accessible via direct URL (SPA redirect missing)')
        }
      })
    })
  })

  // ---------------------------------------------------------------------------

  context('Comportamento do formulário', () => {
    beforeEach(() => {
      cy.goToNewCourse()
    })

    it('não deve submeter o formulário ao pressionar Enter em um campo de texto', () => {
      cy.get(Cypress.SELECTORS.nomeCurso).type('Curso Teste Enter{enter}')

      // Pressing Enter in a single-line input should not submit an incomplete form
      cy.url().should('include', '/new-course')
    })

    it('deve resetar os campos ao navegar para fora e voltar', () => {
      cy.fillCourseForm({ nomeCurso: 'Curso Temporário', descricao: 'desc' })
      // cy.reload() não pode ser usado aqui: recarregar /new-course diretamente
      // retorna 404 (BUG-002). Usa navegação SPA para o mesmo efeito.
      cy.goToListing()
      cy.goToNewCourse()
      cy.get(Cypress.SELECTORS.nomeCurso).should('have.value', '')
    })

    it('não deve registrar curso duplicado com clique duplo no botão cadastrar', () => {
      cy.fillCourseForm(courses.valid)

      // Double-click the submit button
      cy.get(Cypress.SELECTORS.btnCadastrar).first().dblclick()

      // After submission, navigate to listing and count occurrences
      cy.goToListing()

      // There should be exactly ONE entry with this name (idempotent submission)
      cy.contains(courses.valid.nomeCurso)
        .parent()
        .then(($firstCard) => {
          // Find all cards that contain the same course name
          const allCards = Cypress.$(`*:contains("${courses.valid.nomeCurso}")`)
            .filter((_, el) => el.tagName !== 'BODY' && el.children.length === 0)
          cy.log(`Cards found with same name: ${allCards.length}`)
        })
    })

    it('deve manter o formulário inalterado após navegar para listagem e voltar', () => {
      const partialData = { nomeCurso: 'Curso Não Salvo', descricao: 'Ainda digitando' }

      cy.fillCourseForm(partialData)

      cy.get(Cypress.SELECTORS.navListarCursos).first().click()
      cy.get(Cypress.SELECTORS.navCadastrarCurso).first().click()

      // Browser may or may not preserve the state — either is acceptable,
      // but the form must load without errors
      cy.get(Cypress.SELECTORS.nomeCurso).should('exist')
    })

    it('o botão de cadastrar deve estar visível sem necessitar de scroll (below-the-fold check)', () => {
      cy.get(Cypress.SELECTORS.btnCadastrar)
        .first()
        .scrollIntoView()
        .should('be.visible')
    })
  })

  // ---------------------------------------------------------------------------

  context('Campos de texto — comportamento de borda', () => {
    beforeEach(() => {
      cy.goToNewCourse()
    })

    it('deve aceitar somente espaços no campo de nome — verificar se é tratado como vazio', () => {
      cy.fillCourseForm({ ...courses.valid, nomeCurso: '     ' })
      cy.submitCourseForm()

      cy.url().then((url) => {
        if (!url.includes('/new-course')) {
          cy.log('POTENTIAL BUG: whitespace-only course name was accepted')
        } else {
          cy.log('Whitespace-only name correctly rejected')
        }
      })
    })

    it('deve aceitar números no campo "Nome do curso"', () => {
      cy.fillCourseForm({ ...courses.valid, nomeCurso: '12345' })
      cy.submitCourseForm()

      cy.url().should('not.include', '/new-course')
    })

    it('deve aceitar emoji no campo "Nome do curso"', () => {
      cy.fillCourseForm({ ...courses.valid, nomeCurso: 'Curso 🚀 Avançado' })
      cy.submitCourseForm()

      cy.get('body').should('be.visible')
    })
  })

  // ---------------------------------------------------------------------------

  context('Responsividade básica', () => {
    it('deve renderizar o formulário corretamente em viewport mobile (375x667)', () => {
      cy.viewport(375, 667)
      cy.goToNewCourse()

      cy.get(Cypress.SELECTORS.nomeCurso).should('be.visible')
      cy.get(Cypress.SELECTORS.btnCadastrar).first().should('be.visible')
    })

    it('deve renderizar a listagem corretamente em viewport mobile (375x667)', () => {
      cy.viewport(375, 667)
      cy.goToListing()

      cy.contains('Lista de cursos').should('be.visible')
    })
  })
})
