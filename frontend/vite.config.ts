import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
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
      rollupOptions: {
        external: [
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
          'class-variance-authority',
          'cmdk',
          'embla-carousel-react',
          'input-otp',
          'react-day-picker',
          'react-hook-form',
          'react-resizable-panels',
          'sonner',
          'tailwind-merge',
          'vaul',
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            charts: ['recharts'],
            utils: ['axios', 'date-fns', 'yup'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
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
