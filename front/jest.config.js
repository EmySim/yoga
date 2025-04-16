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

  // Collect coverage
  collectCoverage: true,
  coverageDirectory: './coverage/jest',
  coverageReporters: ['html', 'lcov', 'text-summary'],

  // Files to ignore for coverage
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],

  // Include files for coverage
  collectCoverageFrom: [
    'src/app/**/*.ts', // Include all application files
    '!src/app/**/*.spec.ts', // Exclude test files
    'src/integration-tests/**/*.ts', // Include integration test files
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 80, // 80% global coverage
    },
    './src/integration-tests/': { // Correct path for integration tests
      statements: 30, // Minimum 30% coverage
    },
  },

  // Directories and modules
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