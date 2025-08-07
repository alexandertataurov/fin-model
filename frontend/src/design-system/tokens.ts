// Design System Tokens
// Centralized design tokens for consistent theming across the application

export const tokens = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: 'hsl(210, 100%, 98%)',
      100: 'hsl(210, 100%, 96%)',
      200: 'hsl(214, 95%, 93%)',
      300: 'hsl(213, 97%, 87%)',
      400: 'hsl(215, 91%, 78%)',
      500: 'hsl(215, 91%, 65%)',
      600: 'hsl(215, 91%, 52%)',
      700: 'hsl(215, 91%, 43%)',
      800: 'hsl(215, 91%, 37%)',
      900: 'hsl(215, 91%, 30%)',
      950: 'hsl(215, 91%, 20%)',
    },
    // Neutral Colors
    neutral: {
      50: 'hsl(0, 0%, 98%)',
      100: 'hsl(0, 0%, 96%)',
      200: 'hsl(0, 0%, 90%)',
      300: 'hsl(0, 0%, 83%)',
      400: 'hsl(0, 0%, 64%)',
      500: 'hsl(0, 0%, 45%)',
      600: 'hsl(0, 0%, 32%)',
      700: 'hsl(0, 0%, 25%)',
      800: 'hsl(0, 0%, 15%)',
      900: 'hsl(0, 0%, 9%)',
      950: 'hsl(0, 0%, 2%)',
    },
    // Semantic Colors
    success: {
      50: 'hsl(142, 76%, 97%)',
      100: 'hsl(141, 84%, 93%)',
      200: 'hsl(141, 79%, 85%)',
      300: 'hsl(142, 77%, 73%)',
      400: 'hsl(142, 69%, 58%)',
      500: 'hsl(142, 71%, 45%)',
      600: 'hsl(142, 76%, 36%)',
      700: 'hsl(142, 72%, 29%)',
      800: 'hsl(143, 64%, 24%)',
      900: 'hsl(144, 61%, 20%)',
      950: 'hsl(145, 80%, 10%)',
    },
    warning: {
      50: 'hsl(48, 96%, 89%)',
      100: 'hsl(48, 96%, 77%)',
      200: 'hsl(48, 96%, 65%)',
      300: 'hsl(48, 96%, 53%)',
      400: 'hsl(48, 96%, 41%)',
      500: 'hsl(48, 96%, 29%)',
      600: 'hsl(48, 96%, 17%)',
      700: 'hsl(48, 96%, 15%)',
      800: 'hsl(48, 96%, 13%)',
      900: 'hsl(48, 96%, 11%)',
      950: 'hsl(48, 96%, 9%)',
    },
    error: {
      50: 'hsl(0, 85%, 97%)',
      100: 'hsl(0, 93%, 94%)',
      200: 'hsl(0, 96%, 89%)',
      300: 'hsl(0, 93%, 82%)',
      400: 'hsl(0, 90%, 72%)',
      500: 'hsl(0, 84%, 60%)',
      600: 'hsl(0, 72%, 51%)',
      700: 'hsl(0, 74%, 42%)',
      800: 'hsl(0, 70%, 35%)',
      900: 'hsl(0, 63%, 31%)',
      950: 'hsl(0, 85%, 15%)',
    },
    info: {
      50: 'hsl(199, 89%, 96%)',
      100: 'hsl(199, 89%, 91%)',
      200: 'hsl(199, 89%, 83%)',
      300: 'hsl(199, 89%, 72%)',
      400: 'hsl(199, 89%, 58%)',
      500: 'hsl(199, 89%, 44%)',
      600: 'hsl(199, 89%, 35%)',
      700: 'hsl(199, 89%, 29%)',
      800: 'hsl(199, 89%, 24%)',
      900: 'hsl(199, 89%, 20%)',
      950: 'hsl(199, 89%, 10%)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      serif: ['Georgia', 'serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-Index
  zIndex: {
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
  },
} as const;

// CSS Custom Properties for runtime theming
export const cssVariables = {
  // Light theme
  light: {
    '--background': tokens.colors.neutral[50],
    '--foreground': tokens.colors.neutral[900],
    '--card': tokens.colors.neutral[50],
    '--card-foreground': tokens.colors.neutral[900],
    '--popover': tokens.colors.neutral[50],
    '--popover-foreground': tokens.colors.neutral[900],
    '--primary': tokens.colors.primary[600],
    '--primary-foreground': tokens.colors.neutral[50],
    '--secondary': tokens.colors.neutral[100],
    '--secondary-foreground': tokens.colors.neutral[900],
    '--muted': tokens.colors.neutral[100],
    '--muted-foreground': tokens.colors.neutral[500],
    '--accent': tokens.colors.neutral[100],
    '--accent-foreground': tokens.colors.neutral[900],
    '--destructive': tokens.colors.error[500],
    '--destructive-foreground': tokens.colors.neutral[50],
    '--border': tokens.colors.neutral[200],
    '--input': tokens.colors.neutral[200],
    '--ring': tokens.colors.primary[500],
    '--success': tokens.colors.success[500],
    '--success-foreground': tokens.colors.neutral[50],
    '--warning': tokens.colors.warning[500],
    '--warning-foreground': tokens.colors.neutral[900],
    '--info': tokens.colors.info[500],
    '--info-foreground': tokens.colors.neutral[50],
  },
  // Dark theme
  dark: {
    '--background': tokens.colors.neutral[900],
    '--foreground': tokens.colors.neutral[50],
    '--card': tokens.colors.neutral[800],
    '--card-foreground': tokens.colors.neutral[50],
    '--popover': tokens.colors.neutral[800],
    '--popover-foreground': tokens.colors.neutral[50],
    '--primary': tokens.colors.primary[400],
    '--primary-foreground': tokens.colors.neutral[900],
    '--secondary': tokens.colors.neutral[800],
    '--secondary-foreground': tokens.colors.neutral[50],
    '--muted': tokens.colors.neutral[800],
    '--muted-foreground': tokens.colors.neutral[400],
    '--accent': tokens.colors.neutral[800],
    '--accent-foreground': tokens.colors.neutral[50],
    '--destructive': tokens.colors.error[400],
    '--destructive-foreground': tokens.colors.neutral[900],
    '--border': tokens.colors.neutral[700],
    '--input': tokens.colors.neutral[700],
    '--ring': tokens.colors.primary[400],
    '--success': tokens.colors.success[400],
    '--success-foreground': tokens.colors.neutral[900],
    '--warning': tokens.colors.warning[400],
    '--warning-foreground': tokens.colors.neutral[900],
    '--info': tokens.colors.info[400],
    '--info-foreground': tokens.colors.neutral[900],
  },
} as const;

// Utility functions
export const getToken = (path: string) => {
  return path.split('.').reduce((obj, key) => obj?.[key], tokens);
};

export const getCSSVariable = (name: string) => {
  return `var(${name})`;
};
