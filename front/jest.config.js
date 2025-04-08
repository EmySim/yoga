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
  testEnvironment: "jsdom",
  
  // Collecte de la couverture
  collectCoverage: true,
  coverageDirectory: './coverage/jest',
  coverageReporters: ['html', 'lcov', 'text-summary'],  // Formats de rapport
  
  // Fichiers à ignorer pour la couverture
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  
  // Inclusion des fichiers à couvrir (tests unitaires et tests d'intégration)
  collectCoverageFrom: [
    'src/app/**/*.ts', // Couvre tous les fichiers TypeScript dans l'application
    '!src/app/**/*.spec.ts', // Exclut les fichiers de test (spécifications)
  ],

  // Seuils de couverture
  coverageThreshold: {
    global: {
      statements: 80,  // 80% de couverture globale
    },
    './src/app/integration-tests/': {  // 30% de couverture minimum pour les tests d'intégration
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
