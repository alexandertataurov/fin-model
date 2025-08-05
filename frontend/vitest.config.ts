/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
    // CI-specific settings - reduced timeouts to prevent hanging
    testTimeout: process.env.CI ? 15000 : 8000, // Reduced timeout to catch hanging tests faster
    hookTimeout: process.env.CI ? 15000 : 8000,
    // Global test configuration
    bail: process.env.CI ? 5 : 3, // Stop after 3-5 failures to save time
    poolOptions: {
      threads: {
        singleThread: process.env.CI ? false : true, // Single thread locally for easier debugging
      },
    },
    // Optimized exclusions - performance tests now mocked so can run everywhere
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    // Reporter configuration
    reporter: process.env.CI ? ['junit', 'github-actions'] : ['verbose'],
    outputFile: process.env.CI ? 'test-results.xml' : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});