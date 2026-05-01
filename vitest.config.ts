import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts', 'functions/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/i18n/**', 'src/scripts/**', 'functions/**'],
            exclude: ['**/*.test.ts'],
            reporter: ['text', 'lcov'],
        },
    },
})
