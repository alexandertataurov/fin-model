import { mergeConfig, sharedOptimizeDeps } from './vite.config.base';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const netlifyOptimizeDeps = [
  ...sharedOptimizeDeps,
  'react-grid-layout',
  'react-dnd',
  'react-dnd-html5-backend',
  'sonner',
  'vaul',
  'cmdk',
  'input-otp',
  'react-day-picker',
  'react-resizable-panels',
  'embla-carousel-react',
  'formik',
  'yup',
];

const netlifyExcludeDeps = [
  '@swc/plugin-styled-components',
  'puppeteer',
  'lighthouse',
  '@lhci/cli',
  'cypress',
  'cypress-axe',
  'cypress-file-upload',
  'msw',
  'jsdom',
  'jest-axe',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  'vitest',
  '@vitest/coverage-v8',
  '@vitest/ui',
  'storybook',
  '@storybook/addon-a11y',
  '@storybook/addon-controls',
  '@storybook/addon-docs',
  '@storybook/addon-essentials',
  '@storybook/addon-viewport',
  '@storybook/react-vite',
  'eslint',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-plugin-react-hooks',
  'eslint-plugin-react-refresh',
  'eslint-plugin-storybook',
  'prettier',
];

export default mergeConfig({
  plugins: [react()],
  
  optimizeDeps: {
    include: netlifyOptimizeDeps,
    exclude: netlifyExcludeDeps,
    force: false,
    esbuildOptions: {
      target: 'es2022',
      supported: {
        'top-level-await': true,
      },
    },
  },

  resolve: {
    conditions: ['browser', 'module', 'import'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssTarget: 'chrome80',
    cssMinify: 'esbuild',
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },

  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    target: 'es2020',
  },

  server: {
    hmr: false,
  },

  preview: {
    port: 4173,
  },
});
