import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
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
  ],
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': new URL('../src', import.meta.url).pathname,
      '@/design-system': new URL('../src/design-system', import.meta.url).pathname,
      '@design-system': new URL('../src/design-system', import.meta.url).pathname,
      '@/components': new URL('../src/components', import.meta.url).pathname,
      '@components': new URL('../src/components', import.meta.url).pathname,
    } as Record<string, string>;

    config.define = {
      ...(config.define || {}),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      global: 'globalThis',
    } as Record<string, any>;

    return config;
  },
};

export default config;
