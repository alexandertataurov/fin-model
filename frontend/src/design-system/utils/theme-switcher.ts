import { useTheme } from 'next-themes';
import { generateThemeCSS } from './tokenHelpers';
import lightTheme from '../tokens/themes/light.json';
import darkTheme from '../tokens/themes/dark.json';

/**
 * Enhanced theme switcher with token integration
 */
export function useThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  /**
   * Switch to light theme
   */
  const switchToLight = () => {
    setTheme('light');
  };

  /**
   * Switch to dark theme
   */
  const switchToDark = () => {
    setTheme('dark');
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  /**
   * Get current theme CSS variables
   */
  const getCurrentThemeCSS = () => {
    const currentTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
    return generateThemeCSS(currentTheme);
  };

  /**
   * Apply theme CSS variables to document
   */
  const applyThemeCSS = () => {
    const cssVars = getCurrentThemeCSS();
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  /**
   * Get theme-specific color value
   */
  const getThemeColor = (colorName: string) => {
    const currentTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
    return currentTheme.colors[colorName]?.value;
  };

  return {
    theme,
    resolvedTheme,
    switchToLight,
    switchToDark,
    toggleTheme,
    getCurrentThemeCSS,
    applyThemeCSS,
    getThemeColor,
  };
}

/**
 * Theme provider component props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

/**
 * Apply theme CSS variables on mount
 */
export const applyThemeOnMount = () => {
  if (typeof window !== 'undefined') {
    // Get theme from localStorage or default to light
    const storedTheme = localStorage.getItem('theme') || 'light';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolvedTheme = storedTheme === 'system' ? systemTheme : storedTheme;
    
    const currentTheme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
    const cssVars = generateThemeCSS(currentTheme);
    
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
};
