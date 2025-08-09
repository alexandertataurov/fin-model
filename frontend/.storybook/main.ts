import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // Enable auto-generated prop tables from TypeScript
    reactDocgen: 'react-docgen-typescript',
  },
  stories: [
    '../src/design-system/**/*.stories.@(ts|tsx|mdx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-themes',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    'msw-storybook-addon',
  ],
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) => {
    // Ensure PostCSS with Tailwind runs inside Storybook
    (config as any).css = {
      ...(config as any).css,
      postcss: {
        plugins: [
          tailwindcss({ config: resolve(__dirname, '../tailwind.config.js') }) as any,
          autoprefixer() as any,
        ],
      },
    };

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': resolve(__dirname, '../src'),
      '@/design-system': resolve(__dirname, '../src/design-system'),
      '@design-system': resolve(__dirname, '../src/design-system'),
      '@/components': resolve(__dirname, '../src/components'),
      '@components': resolve(__dirname, '../src/components'),
    } as Record<string, string>;

    config.define = {
      ...(config.define || {}),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      global: 'globalThis',
    } as Record<string, any>;

    if (Array.isArray(config.plugins)) {
      // Remove any duplicate React plugins to avoid duplicate RefreshRuntime
      const hasReactPlugin = config.plugins.some((p: any) => p && (p.name === 'vite:react'));
      config.plugins = config.plugins.filter((p: any) => p && p.name !== 'vite:react-swc');
      // If both existed, keep only vite:react
      if (!hasReactPlugin) {
        // leave as-is; Storybook adds its own React plugin
      }
    }

    // Disable HMR in Storybook to prevent refresh runtime clashes
    (config as any).server = {
      ...(config as any).server,
      hmr: false,
    };

    return config;
  },
};

export default config;
