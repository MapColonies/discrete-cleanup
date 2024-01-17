module.exports = {
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  coverageReporters: ['text', 'html'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!*/node_modules/',
    '!/vendor/**',
    '!*/common/**',
    '!**/clients/**',
    '!**/controllers/**',
    '!**/routes/**',
    '!<rootDir>/src/*',
  ],
  coverageDirectory: '<rootDir>/coverage',
  reporters: [
    'default',
    ['jest-html-reporters', { multipleReportsUnitePath: './reports', pageTitle: 'unit', publicPath: './reports', filename: 'unit.html' }],
  ],
  rootDir: '../../../.',
  setupFiles: ['<rootDir>/tests/configurations/jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
<<<<<<< HEAD
      branches: 55,
      functions: 60,
      lines: 62,
      statements: 65,
=======
      branches: 82,
      functions: 98,
      lines: 99,
      statements: 99,
>>>>>>> 5c8989efdb51f70b11666503d227ad33a78d7209
    },
  },
};
