const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.isolatedtraveller.com',
    supportFile: false,
    fixturesFolder: false,
    setupNodeEvents(on, config) {
      allureWriter(on, config)
      return config
    },
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    waitForAnimation: true,
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    failOnStatusCode: false,
    trashAssetsBeforeRuns: true
  }
})
