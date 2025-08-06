import { useTheme } from 'next-themes';
import { designTokens, colorTokens, componentTokens } from '../components/ui/utils/tokens';

/**
 * Hook for accessing design tokens with theme-aware color resolution
 * Provides easy access to all design system tokens including colors, spacing, typography, etc.
 * 
 * @returns Design token utilities and values
 */
export function useDesignTokens() {
  const { theme, resolvedTheme } = useTheme();
  
  // Get the current theme (light/dark)
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  
  // Get theme-specific colors
  const colors = colorTokens[currentTheme];
  
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
  const getSpacing = (size: keyof typeof designTokens.spacing): string => {
    return designTokens.spacing[size];
  };
  
  /**
   * Get border radius value
   * @param size - The border radius size key
   * @returns The border radius value
   */
  const getBorderRadius = (size: keyof typeof designTokens.borderRadius): string => {
    return designTokens.borderRadius[size];
  };
  
  /**
   * Get font size configuration
   * @param size - The font size key
   * @returns The font size configuration [size, { lineHeight }]
   */
  const getFontSize = (size: keyof typeof designTokens.fontSize): [string, { lineHeight: string }] => {
    return designTokens.fontSize[size];
  };
  
  /**
   * Get font weight value
   * @param weight - The font weight key
   * @returns The font weight value
   */
  const getFontWeight = (weight: keyof typeof designTokens.fontWeight): string => {
    return designTokens.fontWeight[weight];
  };
  
  /**
   * Get box shadow value
   * @param size - The shadow size key
   * @returns The box shadow value
   */
  const getBoxShadow = (size: keyof typeof designTokens.boxShadow): string => {
    return designTokens.boxShadow[size];
  };
  
  /**
   * Get transition duration value
   * @param speed - The transition speed key
   * @returns The transition duration value
   */
  const getTransitionDuration = (speed: keyof typeof designTokens.transitionDuration): string => {
    return designTokens.transitionDuration[speed];
  };
  
  /**
   * Get z-index value
   * @param layer - The z-index layer key
   * @returns The z-index value
   */
  const getZIndex = (layer: keyof typeof designTokens.zIndex): string => {
    return designTokens.zIndex[layer];
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
    tokens: designTokens,
    colors,
    componentTokens,
    
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
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    fontSize: designTokens.fontSize,
    fontWeight: designTokens.fontWeight,
    boxShadow: designTokens.boxShadow,
    transitionDuration: designTokens.transitionDuration,
    zIndex: designTokens.zIndex,
  };
}

/**
 * Type-safe design token selectors
 */
export type DesignTokens = ReturnType<typeof useDesignTokens>;
export type SpacingKey = keyof typeof designTokens.spacing;
export type BorderRadiusKey = keyof typeof designTokens.borderRadius;
export type FontSizeKey = keyof typeof designTokens.fontSize;
export type FontWeightKey = keyof typeof designTokens.fontWeight;
export type BoxShadowKey = keyof typeof designTokens.boxShadow;
export type TransitionDurationKey = keyof typeof designTokens.transitionDuration;
export type ZIndexKey = keyof typeof designTokens.zIndex;
export type ColorKey = keyof typeof colorTokens.light;
export type ComponentKey = keyof typeof componentTokens;