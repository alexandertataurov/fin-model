import type { Preview } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../src/design-system';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Import design system tokens and base styles
import '../src/design-system/tokens.css';
import '../src/index.css';

// Initialize MSW once
initialize({ onUnhandledRequest: 'bypass', serviceWorker: { url: '/public/mockServiceWorker.js' } });

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
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Docs',
          'Getting Started',
          'Design System',
          [
            'Overview',
            'Foundations',
            [
              'Colors',
              'Typography',
              'Z-Index',
              'BorderWidth',
              'Shadows',
              'Radius',
              'Spacing',
              'Motion',
              'Transitions',
              '*'
            ],
            'Layout',
            [
              'AspectRatio',
              'Card',
              'Separator',
              'Resizable',
              'ScrollArea',
              '*'
            ],
            'Navigation',
            [
              'Breadcrumb',
              'NavigationMenu',
              'Sidebar',
              'SidebarAdvanced',
              'Menubar',
              'Pagination',
              '*'
            ],
            'Forms',
            [
              'Button',
              'Input',
              'InputOTP',
              'Textarea',
              'Label',
              'Checkbox',
              'RadioGroup',
              'Select',
              'Switch',
              'Slider',
              'Toggle',
              'ToggleGroup',
              'DatePicker',
              'Calendar',
              'Form',
              '*'
            ],
            'Feedback',
            [
              'Alert',
              'Badge',
              'Progress',
              'Toast',
              'Sonner',
              'Tooltip',
              '*'
            ],
            'Data',
            [
              'Table',
              'Tabs',
              'Accordion',
              'Collapsible',
              'Carousel',
              'ChartsHelpers',
              'Avatar',
              '*'
            ],
            'Overlay',
            [
              'Dialog',
              'AlertDialog',
              'Sheet',
              'Drawer',
              'Popover',
              'HoverCard',
              'DropdownMenu',
              'ContextMenu',
              'Command',
              '*'
            ],
            'Utilities',
            [
              'ImageWithFallback',
              'ComponentTemplate',
              'Providers',
              'Performance',
              'AdvancedTheming',
              'Accessibility',
              'GettingStarted',
              'Overview',
              '*'
            ],
            '*'
          ],
          'Components',
          ['Auth', 'Dashboard', 'Parameters', 'Scenarios', 'Charts', 'FileUpload', '*'],
          'Pages',
          '*',
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story) => (
      <DesignSystemProvider
        defaultDensity={(globalThis as any).STORYBOOK_GLOBALS?.density || 'comfortable'}
        defaultRadius={(globalThis as any).STORYBOOK_GLOBALS?.radius || 'md'}
      >
        <div className="min-h-screen bg-background text-foreground">
          <Story />
        </div>
      </DesignSystemProvider>
    ),
  ],
  loaders: [mswLoader],
  globalTypes: {
    density: {
      name: 'Density',
      description: 'Component density scale',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'spacious', title: 'Spacious' },
        ],
      },
    },
    radius: {
      name: 'Radius',
      description: 'Border radius scale',
      defaultValue: 'md',
      toolbar: {
        icon: 'shape',
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
};

export default preview;
