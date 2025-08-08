import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

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
    // Use a dedicated cache dir to avoid cross-instance refresh collisions
    (viteConfig as any).cacheDir = resolve(
      __dirname,
      '../node_modules/.vite-storybook'
    );

    // Ensure only ONE React plugin instance and disable Fast Refresh
    if (Array.isArray((viteConfig as any).plugins)) {
      let keptReact = false;
      (viteConfig as any).plugins = (viteConfig as any).plugins
        .filter((plugin: any) => {
          const isReactPlugin =
            plugin &&
            typeof plugin === 'object' &&
            (plugin.name === 'vite:react' || plugin.name === 'vite:react-swc');
          if (!isReactPlugin) return true;
          if (!keptReact) {
            keptReact = true;
            return false; // drop existing to replace with controlled one
          }
          return false;
        })
        .concat([react({ fastRefresh: false })]);
    } else {
      (viteConfig as any).plugins = [react({ fastRefresh: false })];
    }

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
    // Deduplicate React packages to avoid multiple react-refresh injections
    (viteConfig.resolve as any).dedupe = [
      ...(((viteConfig.resolve as any).dedupe as string[]) || []),
      'react',
      'react-dom',
    ];
    // Ensure Storybook's virtual global module isn't bundled/resolved by Vite
    (viteConfig.build as any) = {
      ...(viteConfig.build || {}),
      rollupOptions: {
        ...((viteConfig.build as any)?.rollupOptions || {}),
        external: [
          ...((viteConfig.build as any)?.rollupOptions?.external || []),
          '@storybook/globalThis',
        ],
      },
    };

    return viteConfig;
  },
};

export default config;
