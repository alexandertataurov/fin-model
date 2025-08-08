import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: [
    '../src/design-system/stories/**/*.stories.@(ts|tsx)',
    '../src/components/**/*.stories.@(ts|tsx)',
    '../src/pages/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-viewport',
    '@storybook/addon-links',
    '@storybook/addon-backgrounds',
    '@storybook/addon-outline',
    '@storybook/addon-measure',
    '@storybook/blocks',
    '@storybook/addon-themes'
  ],
  docs: { autodocs: 'tag' },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve || { alias: [] };
    const aliases = (viteConfig.resolve.alias as any[]) || [];
    aliases.push(
      { find: '@', replacement: resolve(__dirname, '../src') },
      { find: '@/design-system', replacement: resolve(__dirname, '../src/design-system') },
      { find: '@design-system', replacement: resolve(__dirname, '../src/design-system') },
      { find: '@/components', replacement: resolve(__dirname, '../src/components') },
      { find: '@components', replacement: resolve(__dirname, '../src/components') },
    );
    (viteConfig as any).resolve.alias = aliases;

    (viteConfig.define as any) = {
      ...(viteConfig.define || {}),
      'process.env.NODE_ENV': JSON.stringify('development'),
      global: 'globalThis',
    };

    return viteConfig;
  }
};

export default config;
