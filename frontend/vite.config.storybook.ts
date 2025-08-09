import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/design-system': resolve(__dirname, './src/design-system'),
      '@design-system': resolve(__dirname, './src/design-system'),
      '@/components': resolve(__dirname, './src/components'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  // Simplified build config for Storybook compatibility
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
  },
  // Define global variables
  define: {
    global: 'globalThis',
  },
});
