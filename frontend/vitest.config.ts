/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { baseConfig } from './vite.config.base';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [react()],
  define: {
    ...baseConfig.define,
    'process.env.NODE_ENV': '"test"',
    __DEV__: true,
    __PROD__: false,
    'import.meta.env.DEV': true,
    'import.meta.env.PROD': false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: !process.env.CI, // Disable CSS processing in CI to reduce memory usage
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['text'] : ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
    // Adaptive settings based on environment
    testTimeout: process.env.CI ? 15000 : 8000,
    hookTimeout: process.env.CI ? 15000 : 8000,
    bail: process.env.CI ? 5 : 3,
    pool: process.env.CI ? 'threads' : 'forks',
    poolOptions: {
      threads: {
        singleThread: !process.env.CI, // Single thread locally for easier debugging
      },
      forks: {
        singleFork: !process.env.CI, // Single fork locally to reduce memory usage
      },
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/Charts.test.tsx', // Exclude problematic Chart tests
    ],
    reporter: process.env.CI ? ['junit'] : ['verbose'],
    outputFile: process.env.CI ? 'test-results.xml' : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
