import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },

  define: {
    'process.env.NODE_ENV': '"production"',
    __DEV__: false,
    __PROD__: true,
    'import.meta.env.DEV': false,
    'import.meta.env.PROD': true,
  },
});
