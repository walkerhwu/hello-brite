const {defineConfig} = require('cypress')

module.exports = defineConfig({
    e2e: {
        supportFile: false,
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    },
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: {
      runMode: 1,
      openMode: 0
  },
})