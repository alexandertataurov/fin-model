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
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
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
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
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
      .sidebar-item[data-item-id*="getting-started"] {
        font-weight: 600;
        color: #059669;
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
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
    };

    // Fix for @storybook/globalThis import issue
    config.define = {
      ...config.define,
      'process.env.NODE_ENV': '"development"',
      __STORYBOOK_REACT_REFRESH__: 'false',
      __STORYBOOK_HMR__: 'false',
      global: 'globalThis',
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

    // Add external dependencies to prevent build issues
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        external: (id: string) => {
          const externals = [
            '@storybook/globalThis',
            '@storybook/addon-viewport/preview',
            '@storybook/addon-backgrounds/preview',
            '@storybook/addon-measure/preview',
            '@storybook/addon-outline/preview',
          ];
          return externals.some(external => id.includes(external));
        },
      },
    };

    // Performance optimizations
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'tailwindcss',
        'autoprefixer',
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        '@radix-ui/react-slot',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-tabs',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-switch',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-tooltip',
      ],
    };

    // Build optimizations
    config.build = {
      ...config.build,
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        ...config.build?.rollupOptions,
        output: {
          ...config.build?.rollupOptions?.output,
          manualChunks: {
            'storybook-vendor': ['react', 'react-dom'],
            'storybook-addons': [
              '@storybook/addon-essentials',
              '@storybook/addon-a11y',
              '@storybook/addon-interactions',
            ],
            'ui-components': [
              'lucide-react',
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
            ],
          },
        },
      },
    };

    return config;
  },
};

export default config;
