import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    optimizeDeps: {
      include: [
        'react/jsx-runtime',
        'lucide-react',
        '@radix-ui/react-accordion',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-context-menu',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-hover-card',
        '@radix-ui/react-label',
        '@radix-ui/react-menubar',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-popover',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-select',
        '@radix-ui/react-separator',
        '@radix-ui/react-slider',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-toast',
        '@tanstack/react-query',
        'react-router-dom',
        'react-hook-form',
        '@hookform/resolvers/zod',
        'zod',
        'axios',
        'date-fns',
        'recharts',
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
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'esnext',
      rollupOptions: {
        external: [],
        output: {
          manualChunks: (id) => {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            
            // Charting library
            if (id.includes('recharts')) {
              return 'charts';
            }
            
            // Form handling
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'forms';
            }
            
            // Query management
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            
            // Routing
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            
            // HTTP client
            if (id.includes('axios')) {
              return 'http-client';
            }
            
            // UI utilities
            if (id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui-utils';
            }
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Other vendor dependencies
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Optimize chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `assets/[name]-[hash].js`;
          },
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Increase chunk size warning limit slightly for better optimization
      chunkSizeWarningLimit: 1200,
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
      // Make environment variables available to the app
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    // Ensure environment variables are properly handled
    envPrefix: 'VITE_',
  };
});
