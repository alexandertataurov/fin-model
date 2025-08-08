import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/index.css';
import { DesignSystemProvider } from '../src/design-system/provider';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <DesignSystemProvider>
        <Story />
      </DesignSystemProvider>
    ),
  ],
};

export default preview;

import type { Preview } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../src/design-system/provider';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize as initializeMSW, mswDecorator } from 'msw-storybook-addon';
import { handlers } from '../src/mocks/handlers';

// Import global styles (includes Tailwind directives)
import '../src/styles/globals.css';

// Initialize MSW once for Storybook
initializeMSW({ onUnhandledRequest: 'bypass' });

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
  density: {
    name: 'Density',
    description: 'Component density',
    defaultValue: 'comfortable',
    toolbar: {
      icon: 'zoom',
      items: [
        { value: 'comfortable', title: 'Comfortable' },
        { value: 'compact', title: 'Compact' },
      ],
      dynamicTitle: true,
    },
  },
  radius: {
    name: 'Radius',
    description: 'Border radius scale',
    defaultValue: 'md',
    toolbar: {
      icon: 'border',
      items: [
        { value: 'sm', title: 'SM' },
        { value: 'md', title: 'MD' },
        { value: 'lg', title: 'LG' },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    msw: { handlers },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Design System',
          'Components',
          ['Auth', 'Charts', 'FileUpload'],
          'Pages',
          'Examples',
          'Overview',
        ],
      },
    },
    docs: {
      toc: true,
      source: {
        state: 'open',
        excludeDecorators: true,
      },
      canvas: {
        sourceState: 'shown',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'duplicate-id', enabled: true },
          { id: 'focus-trap', enabled: true },
          { id: 'landmark-one-main', enabled: true },
          { id: 'page-has-heading-one', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'image-alt', enabled: true },
          { id: 'label', enabled: true },
          { id: 'list', enabled: true },
          { id: 'listitem', enabled: true },
        ],
      },
      options: {
        restoreScroll: true,
      },
    },
    backgrounds: {
      default: 'gray',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f8f9fa' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'blue', value: '#f0f9ff' },
        { name: 'green', value: '#f0fdf4' },
        { name: 'yellow', value: '#fefce8' },
        { name: 'red', value: '#fef2f2' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
        wide: { name: 'Wide', styles: { width: '1920px', height: '1080px' } },
      },
    },
    react: { version: 'detect' },
    chromatic: { delay: 1000, diffThreshold: 0.2 },
    test: { timeout: 10000 },
    designSystem: { theme: 'light', density: 'comfortable', radius: 'md' },
    layout: 'padded',
  },
  // Global decorators to wrap all stories
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    mswDecorator,
    (Story, context) => {
      const theme =
        context.globals.theme ||
        context.parameters.designSystem?.theme ||
        'light';
      const density =
        context.globals.density ||
        context.parameters.designSystem?.density ||
        'comfortable';
      const radius =
        context.globals.radius ||
        context.parameters.designSystem?.radius ||
        'md';

      return (
        <DesignSystemProvider
          defaultTheme={theme}
          defaultDensity={density}
          defaultRadius={radius}
        >
          <div className="min-h-screen bg-background text-foreground">
            <div className="p-6 max-w-7xl mx-auto">
              <Story />
            </div>
          </div>
        </DesignSystemProvider>
      );
    },
  ],
};

export default preview;
