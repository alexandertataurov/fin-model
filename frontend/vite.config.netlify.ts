import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Simple configuration for reliable builds
      jsxRuntime: 'automatic',
    }),
  ],

  // Optimize dependencies for faster builds
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-dom/client',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'recharts',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'zustand',
      'react-hook-form',
      'zod',
      '@hookform/resolvers/zod',
      'date-fns',
      'react-dropzone',
      'react-grid-layout',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-hot-toast',
      'sonner',
      'vaul',
      'cmdk',
      'input-otp',
      'react-day-picker',
      'react-resizable-panels',
      'embla-carousel-react',
      'formik',
      'yup',
    ],
    exclude: [
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
    ],
    force: false,
    esbuildOptions: {
      target: 'es2022',
      supported: {
        'top-level-await': true,
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    conditions: ['browser', 'module', 'import'],
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2022',
    cssTarget: 'chrome80',
    cssMinify: 'esbuild',
    reportCompressedSize: false,
    emptyOutDir: true,
    assetsInlineLimit: 4096, // Inline small assets
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
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

  define: {
    'process.env.NODE_ENV': '"production"',
    __DEV__: false,
    __PROD__: true,
    'import.meta.env.DEV': false,
    'import.meta.env.PROD': true,
  },

  // Disable features that slow down builds
  server: {
    hmr: false,
  },

  preview: {
    port: 4173,
  },
});
