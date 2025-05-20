module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },

  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  bail: false,
  verbose: false,

  transform: {
    '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular', // Ajout de js + mjs
  },

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
    },
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'], // Ajout de 'mjs'

  // Important : autorise Jest à transformer certains packages ESM (comme @testing-library)
  transformIgnorePatterns: [
    'node_modules/(?!(@ngrx|ngx-bootstrap|@angular|@testing-library)/)',
  ],

  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'lcov', 'text-summary'],

  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/test.ts',
    '!src/**/*.spec.ts',
  ],

  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/environments/',
  ],

  coverageThreshold: {
    global: {
      statements: 80,
    },
  },

  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
};
