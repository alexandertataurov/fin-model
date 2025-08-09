import { useTheme } from 'next-themes';
import { tokens } from '@/design-system/tokens';
const componentTokens: Record<string, any> = {};

/**
 * Hook for accessing design tokens with theme-aware color resolution
 * Provides easy access to all design system tokens including colors, spacing, typography, etc.
 * 
 * @returns Design token utilities and values
 */
export function useDesignTokens() {
  const { theme, resolvedTheme } = useTheme() as any;

  // Get the current theme (light/dark)
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Get theme-specific colors
  const colors = (tokens.colors as any);

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
    return colors[colorName];
  };

  /**
   * Get spacing value
   * @param size - The spacing size key
   * @returns The spacing value
   */
  const getSpacing = (size: keyof typeof tokens.spacing): string => {
    return tokens.spacing[size];
  };

  /**
   * Get border radius value
   * @param size - The border radius size key
   * @returns The border radius value
   */
  const getBorderRadius = (size: keyof typeof tokens.borderRadius): string => {
    return tokens.borderRadius[size];
  };

  /**
   * Get font size configuration
   * @param size - The font size key
   * @returns The font size configuration [size, { lineHeight }]
   */
  const getFontSize = (size: keyof typeof tokens.typography.fontSize): [string, { lineHeight: string }] => {
    return tokens.typography.fontSize[size] as any;
  };

  /**
   * Get font weight value
   * @param weight - The font weight key
   * @returns The font weight value
   */
  const getFontWeight = (_weight: any): string => {
    return '400';
  };

  /**
   * Get box shadow value
   * @param size - The shadow size key
   * @returns The box shadow value
   */
  const getBoxShadow = (size: keyof typeof tokens.shadows): string => {
    return tokens.shadows[size];
  };

  /**
   * Get transition duration value
   * @param speed - The transition speed key
   * @returns The transition duration value
   */
  const getTransitionDuration = (speed: keyof typeof tokens.transitions): string => {
    return tokens.transitions[speed];
  };

  /**
   * Get z-index value
   * @param layer - The z-index layer key
   * @returns The z-index value
   */
  const getZIndex = (layer: keyof typeof tokens.zIndex): string => {
    return String(tokens.zIndex[layer]);
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
    property: keyof typeof componentTokens[T],
    variant?: string
  ): any => {
    const componentConfig = componentTokens[component];
    const propertyConfig = componentConfig[property];

    if (variant && typeof propertyConfig === 'object' && propertyConfig !== null) {
      return (propertyConfig as any)[variant];
    }

    return propertyConfig;
  };

  return {
    // Theme info
    theme,
    resolvedTheme,
    currentTheme,

    // Raw token objects
    tokens,
    colors,

    // Utility functions
    getCSSVar,
    getColor,
    getSpacing,
    getBorderRadius,
    getFontSize,
    getFontWeight,
    getBoxShadow,
    getTransitionDuration,
    getZIndex,
    getComponentToken,

    // Quick access to common values
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    fontSize: tokens.typography.fontSize as any,
    fontWeight: {} as any,
    boxShadow: tokens.shadows,
    transitionDuration: tokens.transitions,
    zIndex: tokens.zIndex as any,
  };
}

/**
 * Type-safe design token selectors
 */
export type DesignTokens = ReturnType<typeof useDesignTokens>;
export type SpacingKey = keyof typeof tokens.spacing;
export type BorderRadiusKey = keyof typeof tokens.borderRadius;
export type FontSizeKey = keyof typeof tokens.typography.fontSize;
export type FontWeightKey = string;
export type BoxShadowKey = keyof typeof tokens.shadows;
export type TransitionDurationKey = keyof typeof tokens.transitions;
export type ZIndexKey = keyof typeof tokens.zIndex;
export type ColorKey = keyof typeof tokens.colors;
export type ComponentKey = string;