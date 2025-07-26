import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Design tokens
export const designTokens = {
  colors: {
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    secondary: {
      50: '#fce4ec',
      100: '#f8bbd9',
      200: '#f48fb1',
      300: '#f06292',
      400: '#ec407a',
      500: '#e91e63',
      600: '#d81b60',
      700: '#c2185b',
      800: '#ad1457',
      900: '#880e4f',
    },
    success: {
      50: '#e8f5e8',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50',
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    warning: {
      50: '#fff3e0',
      100: '#ffe0b2',
      200: '#ffcc80',
      300: '#ffb74d',
      400: '#ffa726',
      500: '#ff9800',
      600: '#fb8c00',
      700: '#f57c00',
      800: '#ef6c00',
      900: '#e65100',
    },
    error: {
      50: '#ffebee',
      100: '#ffcdd2',
      200: '#ef9a9a',
      300: '#e57373',
      400: '#ef5350',
      500: '#f44336',
      600: '#e53935',
      700: '#d32f2f',
      800: '#c62828',
      900: '#b71c1c',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    financial: {
      positive: '#2e7d32',
      negative: '#c62828',
      neutral: '#616161',
      currency: '#1976d2',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.15)',
    modal: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  typography: {
    fontFamily: {
      primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      monospace: '"Fira Code", "Monaco", "Consolas", monospace',
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  },
};

// Base theme configuration
const getTheme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: designTokens.colors.primary[700],
      light: designTokens.colors.primary[400],
      dark: designTokens.colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: designTokens.colors.secondary[600],
      light: designTokens.colors.secondary[400],
      dark: designTokens.colors.secondary[800],
      contrastText: '#ffffff',
    },
    success: {
      main: designTokens.colors.success[600],
      light: designTokens.colors.success[400],
      dark: designTokens.colors.success[800],
    },
    warning: {
      main: designTokens.colors.warning[600],
      light: designTokens.colors.warning[400],
      dark: designTokens.colors.warning[800],
    },
    error: {
      main: designTokens.colors.error[600],
      light: designTokens.colors.error[400],
      dark: designTokens.colors.error[800],
    },
    grey: designTokens.colors.grey,
    background: {
      default: mode === 'light' ? '#fafafa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? designTokens.colors.grey[900] : '#ffffff',
      secondary: mode === 'light' ? designTokens.colors.grey[700] : designTokens.colors.grey[300],
    },
  },
  typography: {
    fontFamily: designTokens.typography.fontFamily.primary,
    h1: {
      fontSize: '2.5rem',
      fontWeight: designTokens.typography.fontWeights.bold,
      lineHeight: designTokens.typography.lineHeights.tight,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: designTokens.typography.fontWeights.semibold,
      lineHeight: designTokens.typography.lineHeights.tight,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: designTokens.typography.fontWeights.semibold,
      lineHeight: designTokens.typography.lineHeights.tight,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: designTokens.typography.fontWeights.medium,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: designTokens.typography.fontWeights.medium,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: designTokens.typography.fontWeights.medium,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: designTokens.typography.fontWeights.regular,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: designTokens.typography.fontWeights.regular,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: designTokens.typography.fontWeights.regular,
      lineHeight: designTokens.typography.lineHeights.normal,
    },
  },
  spacing: (factor: number) => `${designTokens.spacing.sm * factor}px`,
  shape: {
    borderRadius: designTokens.borderRadius.md,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: designTokens.typography.fontWeights.medium,
          borderRadius: designTokens.borderRadius.md,
          padding: `${designTokens.spacing.sm}px ${designTokens.spacing.md}px`,
        },
        contained: {
          boxShadow: designTokens.shadows.card,
          '&:hover': {
            boxShadow: designTokens.shadows.elevated,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.card,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
        },
        elevation1: {
          boxShadow: designTokens.shadows.card,
        },
        elevation4: {
          boxShadow: designTokens.shadows.elevated,
        },
        elevation8: {
          boxShadow: designTokens.shadows.modal,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(30, 30, 30, 0.9)',
          color: mode === 'light' 
            ? designTokens.colors.grey[900] 
            : '#ffffff',
        },
      },
    },
  },
});

// Create themed instances
export const lightTheme = createTheme(getTheme('light'));
export const darkTheme = createTheme(getTheme('dark'));

// Theme context and custom hooks will be added later
export { designTokens as tokens }; 