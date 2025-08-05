import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Less aggressive React optimizations for debugging
      fastRefresh: false,
      jsxRuntime: 'automatic',
    }),
  ],

  // Optimize dependencies
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
      'react-hot-toast',
    ],
    force: true,
    esbuildOptions: {
      target: 'es2020', // More compatible target
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true, // Enable sourcemaps for debugging
    minify: 'terser', // Use terser for better debugging
    target: 'es2020', // More compatible target
    cssTarget: 'chrome80',
    reportCompressedSize: false,
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
          'ui': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          'charts': ['recharts'],
          'forms': ['react-hook-form', 'zod'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
      treeshake: {
        preset: 'smallest',
        moduleSideEffects: true, // Less aggressive
      },
    },
  },

  esbuild: {
    target: 'es2020',
    // Don't drop console logs for debugging
    // drop: ['debugger'], // Only drop debugger, keep console
  },

  define: {
    'process.env.NODE_ENV': '"production"',
    __DEV__: false,
    __PROD__: true,
  },

  preview: {
    port: 4173,
  },
});