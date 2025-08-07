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
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  // Enhanced navigation structure
  managerHead: head => `
    ${head}
    <style>
      .sidebar-item[data-item-id*="design-system"] {
        font-weight: 600;
        color: #3b82f6;
      }
      .sidebar-item[data-item-id*="components"] {
        font-weight: 500;
      }
      .sidebar-item[data-item-id*="auth"] {
        font-weight: 500;
      }
    </style>
  `,
  viteFinal: async config => {
    // Add path resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': resolve(__dirname, '../src'),
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

    // Optimize dependencies
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'tailwindcss',
        'autoprefixer',
      ],
    };

    // Disable React Refresh and HMR for Storybook
    config.define = {
      ...config.define,
      'process.env.NODE_ENV': '"development"',
      __STORYBOOK_REACT_REFRESH__: 'false',
      __STORYBOOK_HMR__: 'false',
    };

    // Ensure proper JSX handling
    config.esbuild = {
      ...config.esbuild,
      jsx: 'automatic',
      jsxImportSource: 'react',
    };

    // Disable HMR
    config.server = {
      ...config.server,
      hmr: false,
    };

    return config;
  },
};

export default config;
