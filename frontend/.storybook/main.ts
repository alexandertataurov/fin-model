import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.storybook.ts',
      },
    },
  },
  typescript: {
    // Enable auto-generated prop tables from TypeScript
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  // Performance optimizations
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
  },

  stories: [
    // Design System Documentation (MDX files first)
    {
      directory: '../src/design-system/docs',
      files: '**/*.mdx',
      titlePrefix: 'Design System',
    },
    // Design System Component Stories
    {
      directory: '../src/design-system/stories',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Design System',
    },
    // UI Component Stories
    {
      directory: '../src/components/ui',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'UI',
    },
    // Feature Component Stories
    {
      directory: '../src/components',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Components',
    },
    // Page Stories
    {
      directory: '../src/pages',
      files: '**/*.stories.@(js|jsx|ts|tsx)',
      titlePrefix: 'Pages',
    },
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  staticDirs: [
    { from: '../public', to: '/public' },
  ],
  viteFinal: async (config) => {
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

    // Fix dynamic import issues
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.output = config.build.rollupOptions.output || {};

    // Handle output options properly - it can be an array or single object
    const outputOptions = config.build.rollupOptions.output;
    if (Array.isArray(outputOptions)) {
      outputOptions.forEach(opt => {
        if (opt && typeof opt === 'object') {
          opt.format = 'es';
        }
      });
    } else if (outputOptions && typeof outputOptions === 'object') {
      outputOptions.format = 'es';
    }

    config.build.rollupOptions.external = [
      ...(Array.isArray(config.build.rollupOptions.external)
        ? config.build.rollupOptions.external
        : []),
      '@storybook/globalThis',
      '@storybook/addon-docs/preview',
    ];

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
  // Enhanced navigation structure
  managerHead: head => `
    ${head}
    <style>
      .sidebar-item[data-item-id*="design-system"] {
        font-weight: 600;
        color: #3b82f6;
      }
      .sidebar-item[data-item-id*="ui"] {
        font-weight: 500;
        color: #059669;
      }
      .sidebar-item[data-item-id*="components"] {
        font-weight: 500;
        color: #7c3aed;
      }
      .sidebar-item[data-item-id*="pages"] {
        font-weight: 500;
        color: #dc2626;
      }
      .sidebar-item[data-item-id*="getting-started"] {
        font-weight: 600;
        color: #059669;
      }
      .sidebar-item[data-item-id*="templates"] {
        font-weight: 600;
        color: #7c3aed;
      }
    </style>
  `,
};

export default config;
