import { useTheme } from 'next-themes';
import { tokens, getToken as baseGetToken } from '@/design-system/tokens/tokens';
import lightTheme from '@/design-system/tokens/themes/light.json';
import darkTheme from '@/design-system/tokens/themes/dark.json';

const componentTokens: Record<string, any> = {};

/**
 * Enhanced hook for accessing design tokens with theme-aware color resolution
 * Provides easy access to all design system tokens including colors, spacing, typography, etc.
 *
 * @returns Design token utilities and values
 */
export function useDesignTokens() {
  const { theme, resolvedTheme } = useTheme() as any;

  // Get the current theme (light/dark)
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Get theme-specific colors
  const themeColors = currentTheme === 'dark' ? darkTheme.colors : lightTheme.colors;
  const colors = { ...tokens.colors, ...themeColors };

  /**
   * Get a CSS custom property value
   * @param property - The CSS custom property name (without --)
   * @returns The CSS variable reference
   */
  const getCSSVar = (property: string): string => {
    return `var(--${property})`;
  };

  /**
   * Get a color value from the current theme
   * @param colorName - The color name from the color tokens
   * @returns The color value for the current theme
   */
  const getColor = (colorName: keyof typeof colors): string => {
    const color = colors[colorName];
    return typeof color === 'object' && color?.value ? color.value : color;
  };

  /**
   * Get theme-aware color value
   * @param colorName - The color name
   * @param theme - Optional theme override
   * @returns The color value for the specified theme
   */
  const getThemeColor = (colorName: string, theme?: 'light' | 'dark'): string => {
    const targetTheme = theme || currentTheme;
    const themeData = targetTheme === 'dark' ? darkTheme.colors : lightTheme.colors;
    return themeData[colorName]?.value || colors[colorName];
  };

  /**
   * Get spacing value
   * @param size - The spacing size key
   * @returns The spacing value
   */
  const getSpacing = (size: keyof typeof tokens.spacing): string => {
    return tokens.spacing[size] ?? '';
  };

  /**
   * Get border radius value
   * @param size - The border radius size key
   * @returns The border radius value
   */
  const getBorderRadius = (size: keyof typeof tokens.borderRadius): string => {
    return tokens.borderRadius[size] ?? '';
  };

  /**
   * Get font size configuration
   * @param size - The font size key
   * @returns The font size configuration [size, { lineHeight }]
   */
  const getFontSize = (
    size: keyof typeof tokens.typography.fontSize
  ): [string, { lineHeight: string }] => {
    const token = tokens.typography.fontSize[size];
    if (!token) return ['', { lineHeight: '1.5' }];
    return [token.value ?? '', { lineHeight: token.lineHeight ?? '1.5' }];
  };

  /**
   * Get font weight value
   * @param weight - The font weight key
   * @returns The font weight value
   */
  const getFontWeight = (weight: keyof typeof tokens.typography.fontWeight): string => {
    return tokens.typography.fontWeight[weight] ?? '';
  };

  /**
   * Get box shadow value
   * @param size - The shadow size key
   * @returns The box shadow value
   */
  const getBoxShadow = (size: keyof typeof tokens.shadows): string => {
    return tokens.shadows[size] ?? '';
  };

  /**
   * Get z-index value
   * @param layer - The z-index layer key
   * @returns The z-index value
   */
  const getZIndex = (layer: keyof typeof tokens.zIndex): string => {
    return tokens.zIndex[layer] !== undefined ? String(tokens.zIndex[layer]) : '';
  };

  /**
   * Get motion configuration
   * @param type - The motion type (easing, duration, delay)
   * @param key - The specific key
   * @returns The motion value
   */
  const getMotion = (type: keyof typeof tokens.motion, key: string): string => {
    return tokens.motion[type]?.[key] ?? '';
  };

  /**
   * Get component-specific token
   * @param component - The component name
   * @param property - The property name
   * @param variant - The variant (optional)
   * @returns The component token value
   */
  const getComponentToken = <T extends keyof typeof componentTokens>(
    component: T,
    property: keyof (typeof componentTokens)[T],
    variant?: string
  ): any => {
    const componentConfig = componentTokens[component];
    const propertyConfig = componentConfig[property];

    if (
      variant &&
      typeof propertyConfig === 'object' &&
      propertyConfig !== null
    ) {
      return (propertyConfig as any)[variant];
    }

    return propertyConfig;
  };

  /**
   * Generate CSS custom properties for the current theme
   * @returns Object with CSS custom properties
   */
  const generateCSSVariables = () => {
    const themeData = currentTheme === 'dark' ? darkTheme.colors : lightTheme.colors;
    const cssVars: Record<string, string> = {};

    Object.entries(themeData).forEach(([key, value]) => {
      cssVars[`--${key}`] = value.value;
    });

    return cssVars;
  };

  return {
    // Theme info
    theme,
    resolvedTheme,
    currentTheme,

    // Raw token objects
    tokens,
    colors,
    themeColors,

    // Utility functions
    getCSSVar,
    getColor,
    getThemeColor,
    getSpacing,
    getBorderRadius,
    getFontSize,
    getFontWeight,
    getBoxShadow,
    getZIndex,
    getMotion,
    getComponentToken,
    generateCSSVariables,
    getToken: baseGetToken, // <-- Add this line

    // Quick access to common values
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    fontSize: tokens.typography.fontSize,
    fontWeight: tokens.typography.fontWeight,
    shadows: tokens.shadows,
    zIndex: tokens.zIndex,
    motion: tokens.motion,
    breakpoints: tokens.breakpoints,
  };
}

export type DesignTokens = ReturnType<typeof useDesignTokens>;
