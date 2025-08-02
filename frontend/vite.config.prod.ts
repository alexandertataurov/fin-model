import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react/jsx-runtime',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-form',
      '@radix-ui/react-progress',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
    force: true,
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
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});