import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Disable fast refresh for Storybook
      fastRefresh: false,
      // Use SWC for better performance
      swc: {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
              refresh: false,
            },
          },
        },
      },
    }),
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      // Explicitly disable react-refresh
      'react-refresh/runtime': false,
      'react-refresh': false,
    },
    dedupe: ['react', 'react-dom'],
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-dom/client',
    ],
    exclude: [
      '@storybook/addon-essentials',
      '@storybook/addon-a11y',
      '@storybook/addon-interactions',
      '@storybook/addon-links',
    ],
  },
  
  define: {
    'process.env.NODE_ENV': '"development"',
    '__STORYBOOK_REACT_REFRESH__': 'false',
    '__STORYBOOK_HMR__': 'false',
    '__STORYBOOK_MODULE_FEDERATION_PLUGIN__': 'false',
  },
  
  server: {
    hmr: false,
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
  },
  
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
}); 