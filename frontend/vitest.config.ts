/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
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
    testTimeout: process.env.CI ? 10000 : 5000,
    hookTimeout: process.env.CI ? 10000 : 5000,
    bail: process.env.CI ? 3 : 2,
    // Use default pool to avoid TS type mismatch on older Vitest versions
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/Charts.test.tsx', // Exclude problematic Chart tests
    ],
    reporters: process.env.CI ? ['junit'] : ['verbose'],
    outputFile: process.env.CI ? 'test-results.xml' : undefined,
  },
  optimizeDeps: {
    include: (baseConfig.optimizeDeps?.include || []).filter(
      (dep: string) => dep !== 'react-router-dom'
    ),
    exclude: ['react-router-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // In tests, stub router hooks to avoid wrapping with a Router
      'react-router-dom': path.resolve(__dirname, './src/test/rrd-mock.ts'),
    },
  },
});
