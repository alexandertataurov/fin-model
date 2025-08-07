import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { mergeConfig, sharedOptimizeDeps } from './vite.config.base';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return mergeConfig({
    plugins: [
      react({
        // Enable fast refresh in development
        ...(mode === 'development' && { fastRefresh: true }),
        // Ensure React is available globally
        jsxImportSource: 'react',
      }),
    ],
    optimizeDeps: {
      include: [
        ...sharedOptimizeDeps,
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      force: true,
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      conditions: ['development', 'browser'],
    },
    
    define: {
      // Ensure React is available globally
      'process.env.NODE_ENV': JSON.stringify(mode),
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
      // Ensure React is available globally
      'global': 'globalThis',
    },
    
    server: {
      port: 3000,
      host: true,
      hmr: {
        overlay: false,
      },
      warmup: {
        clientFiles: ['./src/main.tsx', './src/App.tsx'],
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    
    build: {
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'esnext',
      chunkSizeWarningLimit: 1200,
      // Remove complex chunking to avoid React bundling issues
      rollupOptions: {
        output: {
          manualChunks: undefined, // Disable manual chunking
        },
      },
    },
    
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      server: {
        deps: {
          inline: [
            '@radix-ui/react-slot',
            'react-router-dom',
            '@testing-library/react',
            '@testing-library/user-event',
          ],
        },
      },
    },
  });
});
