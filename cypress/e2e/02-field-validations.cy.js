// =============================================================================
// 02 — VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
//
// Cada teste remove exatamente um campo obrigatório e verifica que o formulário
// não avança. Se o form navegar para fora de /new-course, o teste falha —
// isso é o sinal correto: há uma lacuna de validação real no app.
// O teste de espaços cobre um blind spot clássico do HTML5 `required`.
// =============================================================================

describe('Validação de Campos Obrigatórios', () => {
  let courses

  before(() => {
    cy.fixture('courses').then((data) => {
      courses = data
    })
  })

  beforeEach(() => {
    cy.goToNewCourse()
  })

  it('não submete o formulário completamente vazio', () => {
    cy.submitCourseForm()
    // Quasar não usa HTML5 submit nativo; o botão é type="button".
    // Se a URL mudar para fora de /new-course o formulário submeteu sem validar — BUG.
    cy.url().should('include', '/new-course')
  })

  ;[
    { label: 'Nome do curso',   omit: 'nomeCurso'  },
    { label: 'Descrição',       omit: 'descricao'  },
    { label: 'Instrutor',       omit: 'instrutor'  },
    { label: 'Data de início',  omit: 'dataInicio' },
    { label: 'Data de fim',     omit: 'dataFim'    },
    { label: 'Número de vagas', omit: 'vagas'      },
  ].forEach(({ label, omit }) => {
    it(`bloqueia envio quando "${label}" está ausente`, () => {
      cy.fillCourseForm({ ...courses.valid, [omit]: '' })
      cy.submitCourseForm()
      cy.url().should('include', '/new-course')
    })
  })

  it('rejeita nome composto apenas por espaços (HTML5 blind spot)', () => {
    // HTML5 `required` não detecta strings somente com espaços.
    // O app precisa fazer trim antes de validar. Se navegar, é BUG-005.
    cy.fillCourseForm({ ...courses.valid, nomeCurso: '     ' })
    cy.submitCourseForm()
    cy.url().should('include', '/new-course')
  })
})
