import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'FinVision Design System',
  brandUrl: '/',
  brandTarget: '_self',

  // UI colors
  colorPrimary: '#030213',
  colorSecondary: '#6b7280',

  // Typography
  fontBase:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontCode: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Toolbar default and active colors
  barTextColor: '#030213',
  barSelectedColor: '#030213',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: 'rgba(0, 0, 0, 0.1)',
  inputTextColor: '#030213',
  inputBorderRadius: 6,

  appBg: '#f8f9fa',
  appContentBg: '#ffffff',
  appBorderColor: 'rgba(0, 0, 0, 0.1)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#030213',
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7280',

  // Toolbar colors
  buttonBg: 'transparent',
  buttonBorder: 'rgba(0, 0, 0, 0.1)',
  booleanBg: '#f3f4f6',
  booleanSelectedBg: '#030213',
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  selectedPanel: 'storybook/docs/panel',
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
});
