import { defineConfig } from 'vite';
import { resolve } from 'path';

// Standalone Storybook Vite config (intentionally NOT merging base to avoid duplicate React plugins)
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/design-system': resolve(__dirname, './src/design-system'),
      '@design-system': resolve(__dirname, './src/design-system'),
      '@/components': resolve(__dirname, './src/components'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    global: 'globalThis',
  },
});
