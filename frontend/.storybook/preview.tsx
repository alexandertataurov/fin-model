import type { Preview } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../src/design-system/provider';

// Import global styles (includes Tailwind directives)
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
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
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'duplicate-id',
            enabled: true,
          },
          {
            id: 'focus-trap',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            id: 'page-has-heading-one',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'image-alt',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'list',
            enabled: true,
          },
          {
            id: 'listitem',
            enabled: true,
          },
        ],
      },
      options: {
        restoreScroll: true,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'gray',
          value: '#f8f9fa',
        },
        {
          name: 'blue',
          value: '#f0f9ff',
        },
        {
          name: 'green',
          value: '#f0fdf4',
        },
        {
          name: 'yellow',
          value: '#fefce8',
        },
        {
          name: 'red',
          value: '#fef2f2',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    // Fix for React Refresh conflicts
    react: {
      version: 'detect',
    },
    // Performance optimizations
    chromatic: {
      delay: 1000,
      diffThreshold: 0.2,
    },
    // Testing configuration
    test: {
      timeout: 10000,
    },
    // Design system parameters
    designSystem: {
      theme: 'light',
      density: 'comfortable',
      radius: 'md',
    },
  },
  // Global decorators to wrap all stories
  decorators: [
    (Story, context) => {
      const { designSystem } = context.parameters;

      return (
        <DesignSystemProvider
          defaultTheme={designSystem?.theme || 'light'}
          defaultDensity={designSystem?.density || 'comfortable'}
          defaultRadius={designSystem?.radius || 'md'}
        >
          <div className="min-h-screen bg-background text-foreground">
            <div className="p-4">
              <Story />
            </div>
          </div>
        </DesignSystemProvider>
      );
    },
  ],
};

export default preview;
