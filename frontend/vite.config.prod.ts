import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Production-specific Vite config that optimizes for deployment
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Babel options for better optimization
        babel: {
          plugins: [
            ['@babel/plugin-transform-runtime', { useESModules: true }],
          ],
        },
      }),
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer({
            // Optimize autoprefixer
            grid: true,
          }),
        ],
      },
      // Optimize CSS output
      modules: {
        generateScopedName: mode === 'production' 
          ? '[hash:base64:8]' 
          : '[local]_[hash:base64:5]',
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // Add common directories for better imports
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@styles': resolve(__dirname, 'src/styles'),
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
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext', // Modern browsers for better optimization
      cssTarget: 'chrome61', // Target modern Chrome for CSS
      assetsInlineLimit: 4096, // Inline small assets (4kb)
      modulePreload: {
        polyfill: true, // Add module preload polyfill
      },
      reportCompressedSize: true,
      // Optimize chunks and improve caching
      rollupOptions: {
        external: ['lucide-react'],
        output: {
          // Ensure consistent chunk naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          manualChunks: {
            // Core React dependencies
            vendor: ['react', 'react-dom', 'react-router-dom'],

            // Material UI and icons (load separately since they're large)
            mui: ['@mui/material', '@mui/icons-material'],

            // UI Components split by frequency of use
            'ui-core': [
              '@radix-ui/react-slot',
              '@radix-ui/react-label',
              '@radix-ui/react-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-tooltip',
              'class-variance-authority',
              'tailwind-merge',
            ],
            'ui-forms': [
              '@radix-ui/react-checkbox',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-select',
              '@radix-ui/react-switch',
              '@radix-ui/react-slider',
            ],
            'ui-navigation': [
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-menubar',
              '@radix-ui/react-tabs',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dropdown-menu',
            ],
            'ui-layout': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-separator',
            ],
            'ui-feedback': [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-progress',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-toast',
            ],

            // Data visualization
            charts: ['recharts'],

            // Core utilities (frequent use)
            'utils-core': ['axios', 'date-fns'],

            // Form handling (load when forms are used)
            forms: ['react-hook-form', 'yup', 'input-otp'],

            // Interactive features (load on demand)
            interactions: [
              'cmdk',
              'embla-carousel-react',
              'react-day-picker',
              'react-resizable-panels',
              'sonner',
              'vaul',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 1500,
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
    optimizeDeps: {
      // Force inclusion of indirect dependencies
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-slot',
        'class-variance-authority',
      ],
      // Exclude big optional dependencies
      exclude: ['@mui/icons-material'],
    },
    // Performance optimization settings
    esbuild: {
      logLevel: 'info',
      logLimit: 0,
      treeShaking: true,
      platform: 'browser',
      target: 'esnext',
      supported: {
        'dynamic-import': true,
        'import-meta': true,
      },
    },
  };
});
