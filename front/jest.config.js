module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  bail: false,
  verbose: false,
  testEnvironment: "jsdom",

  // Couverture
  collectCoverage: true,
  coverageDirectory: './coverage/jest',
  coverageReporters: ['html', 'lcov', 'text-summary'],

  collectCoverageFrom: [
    "src/app/**/*.ts",        // Inclure tout le code métier
    "!src/**/*.spec.ts",      // Exclure tous les tests
    "!src/**/*.module.ts",    // Optionnel : on ignore les modules
  ],
  
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/environments/'
  ],

  coverageThreshold: {
    global: {
      statements: 80,
    },
    './src/integration-tests/': {
      statements: 30,
    },
  },

  // Chemins
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"]
};
