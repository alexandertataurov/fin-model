// Design tokens for consistent theming across the application

export const designTokens = {
  // Spacing scale (Tailwind compatible)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  // Border radius scale
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    default: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },

  // Font sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Animation durations
  transitionDuration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  // Z-index scale
  zIndex: {
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
  },
} as const;

// Color palette (using CSS custom properties for theme switching)
export const colorTokens = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    card: 'hsl(0 0% 100%)',
    'card-foreground': 'hsl(240 10% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    'popover-foreground': 'hsl(240 10% 3.9%)',
    primary: 'hsl(240 5.9% 10%)',
    'primary-foreground': 'hsl(0 0% 98%)',
    secondary: 'hsl(240 4.8% 95.9%)',
    'secondary-foreground': 'hsl(240 5.9% 10%)',
    muted: 'hsl(240 4.8% 95.9%)',
    'muted-foreground': 'hsl(240 3.8% 46.1%)',
    accent: 'hsl(240 4.8% 95.9%)',
    'accent-foreground': 'hsl(240 5.9% 10%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    success: 'hsl(120 60% 30%)',
    'success-foreground': 'hsl(0 0% 98%)',
    warning: 'hsl(38 92% 50%)',
    'warning-foreground': 'hsl(0 0% 98%)',
    info: 'hsl(217 91% 60%)',
    'info-foreground': 'hsl(0 0% 98%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(240 5.9% 10%)',
  },
  dark: {
    background: 'hsl(240 10% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(240 10% 3.9%)',
    'card-foreground': 'hsl(0 0% 98%)',
    popover: 'hsl(240 10% 3.9%)',
    'popover-foreground': 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    'primary-foreground': 'hsl(240 5.9% 10%)',
    secondary: 'hsl(240 3.7% 15.9%)',
    'secondary-foreground': 'hsl(0 0% 98%)',
    muted: 'hsl(240 3.7% 15.9%)',
    'muted-foreground': 'hsl(240 5% 64.9%)',
    accent: 'hsl(240 3.7% 15.9%)',
    'accent-foreground': 'hsl(0 0% 98%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    success: 'hsl(120 60% 40%)',
    'success-foreground': 'hsl(0 0% 98%)',
    warning: 'hsl(38 92% 60%)',
    'warning-foreground': 'hsl(0 0% 98%)',
    info: 'hsl(217 91% 70%)',
    'info-foreground': 'hsl(0 0% 98%)',
    border: 'hsl(240 3.7% 15.9%)',
    input: 'hsl(240 3.7% 15.9%)',
    ring: 'hsl(240 4.9% 83.9%)',
  },
} as const;

// Component-specific tokens
export const componentTokens = {
  button: {
    height: {
      sm: '2rem', // 32px
      default: '2.25rem', // 36px
      lg: '2.5rem', // 40px
    },
    padding: {
      sm: '0 0.75rem',
      default: '0 1rem',
      lg: '0 1.5rem',
    },
  },
  input: {
    height: {
      sm: '2rem',
      default: '2.25rem',
      lg: '2.5rem',
    },
    borderWidth: '1px',
    focusRingWidth: '2px',
  },
  card: {
    padding: {
      sm: '1rem',
      default: '1.5rem',
      lg: '2rem',
    },
    borderWidth: '1px',
  },
} as const;
