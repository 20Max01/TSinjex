module.exports = {
    setupFilesAfterEnv: ['./scripts/jest.setup.js'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    extensionsToTreatAsEsm: ['.ts'],
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
    coverageReporters: [
        'text',
        ['lcov', { projectRoot: '..' }],
        'json-summary',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.performance.test.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.test.ts',
        '!src/auto-imports.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};
