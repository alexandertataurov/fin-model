import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// Shared dependencies for optimization
export const sharedOptimizeDeps = [
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
];

// Base configuration shared across all configs
export const baseConfig: UserConfig = {
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  optimizeDeps: {
    include: sharedOptimizeDeps,
  },

  build: {
    outDir: 'dist',
    target: 'es2022',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
};

// Merge configurations utility
export function mergeConfig(override: UserConfig): UserConfig {
  const mergedPlugins = [
    ...(baseConfig.plugins || []),
    ...(override.plugins || []),
  ].filter(plugin => plugin !== null && plugin !== undefined);

  return defineConfig({
    ...baseConfig,
    ...override,
    plugins: mergedPlugins.length > 0 ? mergedPlugins : baseConfig.plugins,
    optimizeDeps: {
      ...baseConfig.optimizeDeps,
      ...override.optimizeDeps,
      include:
        override.optimizeDeps?.include || baseConfig.optimizeDeps?.include,
    },
    build: {
      ...baseConfig.build,
      ...override.build,
      rollupOptions: {
        ...baseConfig.build?.rollupOptions,
        ...override.build?.rollupOptions,
        output: {
          ...baseConfig.build?.rollupOptions?.output,
          ...override.build?.rollupOptions?.output,
        },
      },
    },
    define: {
      ...baseConfig.define,
      ...override.define,
    },
  });
}
