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
  // Performance optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      external: ['@storybook/globalThis'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          designSystem: ['@/design-system'],
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@storybook/addon-essentials'],
  },
  // Faster HMR
  server: {
    hmr: false, // Disable HMR in Storybook
  },
  // CSS optimization - simplified for Storybook
  css: {
    postcss: './postcss.config.js',
  },
  // Define global variables
  define: {
    global: 'globalThis',
  },
});
