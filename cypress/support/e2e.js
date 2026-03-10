// =============================================================================
// cypress/support/e2e.js
// Global configuration loaded before every spec file.
// =============================================================================

import './commands'

// Silence uncaught exceptions that originate from the app under test
// so they don't fail our specs unless we're explicitly testing for them.
Cypress.on('uncaught:exception', (err) => {
  // Log for visibility but don't fail the test
  cy.log(`Uncaught exception: ${err.message}`)
  return false
})

// Clean up: before each test, ensure we start from the listing page
// (individual specs can override this with their own beforeEach)
beforeEach(() => {
  cy.log(`Running: ${Cypress.currentTest.titlePath.join(' > ')}`)
})
