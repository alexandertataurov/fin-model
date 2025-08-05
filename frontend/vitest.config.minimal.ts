/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Minimal test configuration for CI and development
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false, // Disable CSS processing to reduce memory usage
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
    // Very conservative settings to prevent freezing
    testTimeout: 15000,
    hookTimeout: 15000,
    pool: 'forks', // Use forks instead of threads to prevent memory issues
    poolOptions: {
      forks: {
        singleFork: true, // Use single fork to reduce memory usage
      },
    },
    // Only include essential tests
    include: [
      'src/App.test.tsx',
      'src/components/__tests__/FileUpload.test.tsx',
      'src/components/__tests__/Charts.test.tsx',
      'src/components/ui/**/*.test.tsx',
      'src/utils/**/*.test.tsx',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/src/utils/performance.test.tsx', // Skip performance tests
      '**/src/test/a11y.test.tsx', // Skip accessibility tests temporarily
      '**/src/test/dashboard-integration.test.tsx', // Skip integration tests
      '**/src/components/auth/**/*.test.tsx', // Skip auth tests temporarily
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
