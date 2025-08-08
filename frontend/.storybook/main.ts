import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    // Remove the SWC React plugin to avoid duplicate React Refresh runtimes
    if (Array.isArray(viteConfig.plugins)) {
      viteConfig.plugins = viteConfig.plugins.filter(
        // Keep everything except the SWC variant; Storybook adds its own React plugin
        (plugin: any) => plugin && plugin.name !== 'vite:react-swc'
      );
    }

    // Disable HMR inside Storybook to prevent refresh runtime clashes
    viteConfig.server = {
      ...(viteConfig.server || {}),
      hmr: false,
    };

    // Ensure dev-like env for stories without forcing user app overrides
    viteConfig.define = {
      ...(viteConfig.define || {}),
      'process.env.NODE_ENV': JSON.stringify('development'),
    };

    return viteConfig;
  },
};

export default config;

