import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { handlers as defaultHandlers } from '@/mocks/handlers';
import { DesignSystemProvider } from '../src/design-system';
import '../src/styles/globals.css';

// Initialize MSW for API mocking in stories
initialize();

const withDesignSystem: Decorator = (Story, context) =>
  React.createElement(
    DesignSystemProvider,
    {
      defaultDensity: (context.globals as any).density || 'comfortable',
      defaultRadius: (context.globals as any).radius || 'md',
    },
    React.createElement(
      'div',
      { className: 'min-h-screen bg-background text-foreground' },
      React.createElement(Story, context.args)
    )
  );

const preview: Preview = {
  globalTypes: {
    density: {
      name: 'Density',
      description: 'Control components density',
      defaultValue: 'comfortable',
      toolbar: {
        title: 'Density',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'spacious', title: 'Spacious' },
        ],
      },
    },
    radius: {
      name: 'Radius',
      description: 'Control border radius scale',
      defaultValue: 'md',
      toolbar: {
        title: 'Radius',
        items: [
          { value: 'none', title: 'None' },
          { value: 'sm', title: 'SM' },
          { value: 'md', title: 'MD' },
          { value: 'lg', title: 'LG' },
          { value: 'xl', title: 'XL' },
        ],
      },
    },
  },
  decorators: [mswDecorator, withDesignSystem],
  parameters: {
    controls: { expanded: true },
    msw: {
      handlers: defaultHandlers,
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'light', color: '#ffffff' },
        { name: 'dark', class: 'dark', color: '#0b0b0b' },
      ],
    },
    docs: {
      toc: true,
    },
    viewport: {
      defaultViewport: 'responsive',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Getting Started',
          'Foundations',
          'Components',
          'Charts',
        ],
      },
    },
  },
};

export default preview;
