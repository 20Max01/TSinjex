module.exports = {
    setupFilesAfterEnv: ['./scripts/jest.setup.js'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(test).ts'],
    testPathIgnorePatterns: ['\\.spec\\.ts$', '\\.performance\\.test\\.ts$'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverage: true,
    coverageDirectory: '.locale/coverage',
    coverageReporters: ['text', ['lcov', { projectRoot: '..' }], 'json-summary'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.performance.test.ts',
        '!src/auto-imports.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};
