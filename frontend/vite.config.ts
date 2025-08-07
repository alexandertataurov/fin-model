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
      }),
    ],
    optimizeDeps: {
      include: sharedOptimizeDeps,
      force: true,
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      conditions: ['development', 'browser'],
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
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'forms';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            if (id.includes('axios')) {
              return 'http-client';
            }
            if (id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui-utils';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
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
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*'],
      },
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      'process.env.NODE_ENV': JSON.stringify(mode),
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
    },
    
    envPrefix: 'VITE_',
  });
});
