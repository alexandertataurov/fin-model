import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Production-specific Vite config that optimizes for deployment
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Simplified React plugin for faster builds
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: mode === 'production' ? [] : undefined, // Skip babel in production for speed
        },
      }),
    ],
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
      sourcemap: false, // Disable sourcemaps for faster builds
      minify: 'esbuild', // Fastest minifier
      target: 'es2020', // Balance between compatibility and speed
      assetsInlineLimit: 8192, // Inline more assets to reduce requests
      reportCompressedSize: false, // Skip size reporting for speed
      // Simple and fast rollup configuration
      rollupOptions: {
        external: (id) => {
          // Don't externalize any packages - let them be bundled
          return false;
        },
        output: {
          // Simple chunk naming for better caching
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          // Simplified manual chunks - less complexity = faster builds
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@mui/material', '@mui/icons-material', 'lucide-react'],
            charts: ['recharts'],
            utils: ['axios', 'date-fns', 'tailwind-merge', 'class-variance-authority'],
          },
        },
      },
      chunkSizeWarningLimit: 2000, // Increase threshold to reduce warnings
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
      // Pre-bundle heavy dependencies for faster builds
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        'axios',
        'date-fns',
        'tailwind-merge',
      ],
      exclude: ['@mui/icons-material'], // Large icon library - load on demand
    },
    // Optimized esbuild settings for speed
    esbuild: {
      logLevel: 'warning', // Reduce log noise
      treeShaking: true,
      target: 'es2020',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
  };
});
