import type { Preview } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../src/design-system/provider';
import { withThemeByClassName } from '@storybook/addon-themes';

// Import global styles (Tailwind + tokens)
import '../src/styles/globals.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story) => (
      <DesignSystemProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Story />
        </div>
      </DesignSystemProvider>
    ),
  ],
};

export default preview;
