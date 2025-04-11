module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts',
  ],
  bail: false,
  verbose: false,
  testEnvironment: 'jsdom',
  
  // Collecte de la couverture
  collectCoverage: true,
  coverageDirectory: './coverage/jest',
  coverageReporters: ['html', 'lcov', 'text-summary'],  // Formats de rapport
  
  // Fichiers à ignorer pour la couverture
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  
  // Inclusion des fichiers à couvrir (tests unitaires et tests d'intégration)
  collectCoverageFrom: [
    "src/app/**/*.ts", // Inclut tous les fichiers TypeScript dans `src/app`
    "!src/app/**/*.spec.ts", // Exclut les fichiers de test unitaires
    "!src/app/**/*.module.ts", // Exclut les fichiers de module Angular
    "!src/app/**/index.ts", // Exclut les fichiers d'index
    "!src/app/**/*.d.ts", // Exclut les fichiers de définition TypeScript
    "src/integration-tests/**/*.ts" // Inclut les fichiers dans `integration-tests`
  ],

  // Gérer les tests d'intégration et unitaires
  testMatch: [
    "**/*.spec.ts", // Inclut les tests unitaires
    "**/*.integration.spec.ts" // Inclut les tests d'intégration],
  ],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      statements: 80,  // 80% de couverture globale
    },
    './src/integration-tests/': {  // 30% de couverture minimum pour les tests d'intégration
      statements: 30,
    },
  },
  
  // Répertoires et modules
  roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules"
  ],
};
