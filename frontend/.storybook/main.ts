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
    '../src/pages/**/*.stories.@(ts|tsx)',
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
    '@storybook/addon-themes',
  ],
  docs: { autodocs: 'tag' },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  viteFinal: async viteConfig => {
    viteConfig.resolve = viteConfig.resolve || ({ alias: {} } as any);
    const currentAlias = (viteConfig.resolve as any).alias || {};
    (viteConfig.resolve as any).alias = {
      ...currentAlias,
      '@': resolve(__dirname, '../src'),
      '@/design-system': resolve(__dirname, '../src/design-system'),
      '@design-system': resolve(__dirname, '../src/design-system'),
      '@/components': resolve(__dirname, '../src/components'),
      '@components': resolve(__dirname, '../src/components'),
    };

    return viteConfig;
  },
};

export default config;
