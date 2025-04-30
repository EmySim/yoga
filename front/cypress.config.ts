import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'vp41g6',
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts').default(on, config);
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Ajout du pattern pour les fichiers de test
    supportFile: 'cypress/support/e2e.ts',
  },
  env: {
    coverage: true, // Active la couverture de code
  },
});
