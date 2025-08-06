import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../docs/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    buildStoriesJson: true,
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async config => {
    // Add path resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': resolve(__dirname, '../src'),
        // Explicitly disable react-refresh
        'react-refresh/runtime': false,
        'react-refresh': false,
      };
    }

    // Ensure CSS is properly handled with Tailwind
    config.css = {
      ...config.css,
      postcss: {
        plugins: [
          require('tailwindcss')(resolve(__dirname, '../tailwind.config.js')),
          require('autoprefixer'),
        ],
      },
    };

    // Add optimizeDeps to include Tailwind
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'tailwindcss',
        'autoprefixer',
      ],
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        '@storybook/addon-interactions',
        '@storybook/addon-links',
      ],
    };

    // Comprehensive fix for React Refresh conflicts
    if (config.plugins) {
      config.plugins = config.plugins.filter(plugin => {
        if (!plugin || typeof plugin !== 'object') return true;

        // Remove any React Refresh related plugins
        if ('name' in plugin) {
          const pluginName = plugin.name as string;
          return !(
            pluginName === 'vite:react-refresh' ||
            pluginName === 'react-refresh' ||
            pluginName === 'vite:react-refresh-babel' ||
            pluginName.includes('refresh')
          );
        }

        return true;
      });
    }

    // Disable React Refresh and HMR for Storybook
    config.define = {
      ...config.define,
      'process.env.NODE_ENV': '"development"',
      __STORYBOOK_MODULE_FEDERATION_PLUGIN__: 'false',
      __STORYBOOK_REACT_REFRESH__: 'false',
      __STORYBOOK_HMR__: 'false',
    };

    // Ensure proper JSX handling
    config.esbuild = {
      ...config.esbuild,
      jsx: 'automatic',
      jsxImportSource: 'react',
    };

    // Disable HMR and set proper server configuration
    config.server = {
      ...config.server,
      hmr: false,
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    };

    return config;
  },
};

export default config;
