module.exports = {
    setupFilesAfterEnv: ['./scripts/jest.setup.js'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(test).ts'],
    testPathIgnorePatterns: ['\\.spec\\.ts$', '\\.performance\\.test\\.ts$'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)\\.js$': '<rootDir>/src/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    collectCoverage: true,
    coverageDirectory: '.locale/coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
