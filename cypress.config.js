const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://creative-sherbet-a51eac.netlify.app',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',

    // Retry on CI to handle flakiness from network latency
    retries: {
      runMode: 2,
      openMode: 0,
    },

    viewportWidth: 1280,
    viewportHeight: 800,

    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    // Keep videos only on failure to reduce storage
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',

    env: {
      // Override per environment: CYPRESS_BASE_URL=http://staging.example.com cypress run
    },
  },
})
