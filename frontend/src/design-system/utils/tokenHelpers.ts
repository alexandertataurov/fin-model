/**
 * Enhanced token helper utilities for type-safe design token usage
 * Provides utilities for working with design tokens in components
 */

import { tokens } from '../tokens/tokens';
import lightTheme from '../tokens/themes/light.json';
import darkTheme from '../tokens/themes/dark.json';

const designTokens = {
  spacing: tokens.spacing,
  fontSize: tokens.typography.fontSize,
  fontWeight: tokens.typography.fontWeight,
  borderRadius: tokens.borderRadius,
  boxShadow: tokens.shadows,
  zIndex: tokens.zIndex,
  motion: tokens.motion,
  breakpoints: tokens.breakpoints,
} as const;

const colorTokens = {
  light: lightTheme.colors,
  dark: darkTheme.colors,
} as const;

const componentTokens = {} as const;

// Type definitions for better autocomplete and type safety
export type SpacingToken = keyof typeof designTokens.spacing;
export type FontSizeToken = keyof typeof designTokens.fontSize;
export type FontWeightToken = keyof typeof designTokens.fontWeight;
export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
export type BoxShadowToken = keyof typeof designTokens.boxShadow;
export type ZIndexToken = keyof typeof designTokens.zIndex;
export type MotionToken = keyof typeof designTokens.motion;
export type BreakpointToken = keyof typeof designTokens.breakpoints;
export type ColorToken = keyof typeof colorTokens.light;
export type ComponentToken = keyof typeof componentTokens;

/**
 * Generate CSS custom property reference
 * @param token - The token name
 * @returns CSS custom property string
 */
export const cssVar = (token: string): string => {
  return `var(--${token})`;
};

/**
 * Get spacing value with optional CSS var fallback
 * @param size - The spacing size key
 * @param useVar - Whether to return CSS custom property
 * @returns The spacing value
 */
export const getSpacing = (size: SpacingToken, useVar = false): string => {
  if (useVar) {
    return cssVar(`spacing-${String(size)}`);
  }
  return designTokens.spacing[size];
};

/**
 * Get font size configuration
 * @param size - The font size key
 * @param useVar - Whether to return CSS custom property
 * @returns Font size value or CSS custom property
 */
export const getFontSize = (size: FontSizeToken, useVar = false): string => {
  if (useVar) {
    return cssVar(`text-${String(size)}`);
  }
  return designTokens.fontSize[size];
};

/**
 * Get font weight value
 * @param weight - The font weight key
 * @param useVar - Whether to return CSS custom property
 * @returns Font weight value
 */
export const getFontWeight = (weight: FontWeightToken, useVar = false): string => {
  if (useVar) {
    return cssVar(`font-${String(weight)}`);
  }
  return designTokens.fontWeight[weight];
};

/**
 * Get line height for font size
 * @param size - The font size key
 * @returns Line height value
 */
export const getLineHeight = (size: FontSizeToken): string => {
  return (designTokens.fontSize[size] as any)?.lineHeight ?? '1.5';
};

/**
 * Get border radius value
 * @param size - The border radius size key
 * @param useVar - Whether to return CSS custom property
 * @returns The border radius value
 */
export const getBorderRadius = (
  size: BorderRadiusToken,
  useVar = false
): string => {
  if (useVar) {
    return cssVar(`radius-${String(size)}`);
  }
  return designTokens.borderRadius[size];
};

/**
 * Get box shadow value
 * @param size - The shadow size key
 * @param useVar - Whether to return CSS custom property
 * @returns The box shadow value
 */
export const getBoxShadow = (size: BoxShadowToken, useVar = false): string => {
  if (useVar) {
    return cssVar(`shadow-${String(size)}`);
  }
  return designTokens.boxShadow[size];
};

/**
 * Get z-index value
 * @param layer - The z-index layer key
 * @param useVar - Whether to return CSS custom property
 * @returns The z-index value
 */
export const getZIndex = (layer: ZIndexToken, useVar = false): string => {
  if (useVar) {
    return cssVar(`z-${String(layer)}`);
  }
  return String(designTokens.zIndex[layer]);
};

/**
 * Get motion configuration
 * @param type - The motion type
 * @param key - The specific key
 * @param useVar - Whether to return CSS custom property
 * @returns The motion value
 */
export const getMotion = (
  type: MotionToken,
  key: string,
  useVar = false
): string => {
  if (useVar) {
    return cssVar(`motion-${String(type)}-${key}`);
  }
  return designTokens.motion[type][key];
};

/**
 * Get breakpoint value
 * @param breakpoint - The breakpoint key
 * @returns The breakpoint value
 */
export const getBreakpoint = (breakpoint: BreakpointToken): string => {
  return designTokens.breakpoints[breakpoint];
};

/**
 * Get theme-aware color value
 * @param colorName - The color name
 * @param theme - The theme (light/dark)
 * @param useVar - Whether to return CSS custom property
 * @returns The color value
 */
export const getThemeColor = (
  colorName: ColorToken,
  theme: 'light' | 'dark' = 'light',
  useVar = false
): string => {
  if (useVar) {
    return cssVar(`color-${String(colorName)}`);
  }
  return colorTokens[theme][colorName]?.value || '';
};

/**
 * Get color scale value
 * @param colorName - The color name
 * @param scale - The color scale (50-950)
 * @param useVar - Whether to return CSS custom property
 * @returns The color value
 */
export const getColorScale = (
  colorName: string,
  scale: string | number,
  useVar = false
): string => {
  if (useVar) {
    return cssVar(`color-${colorName}-${scale}`);
  }
  return (tokens.colors as any)[colorName]?.[scale] || '';
};

/**
 * Create CSS-in-JS styles from tokens
 * @param styles - Style object with token references
 * @returns CSS-in-JS style object
 */
export const createStyles = (styles: Record<string, any>): Record<string, any> => {
  const processedStyles: Record<string, any> = {};
  
  Object.entries(styles).forEach(([property, value]) => {
    if (typeof value === 'string' && value.startsWith('token:')) {
      const tokenPath = value.replace('token:', '');
      const tokenValue = getToken(tokenPath);
      processedStyles[property] = tokenValue;
    } else {
      processedStyles[property] = value;
    }
  });
  
  return processedStyles;
};

/**
 * Get token value by path
 * @param path - The token path (e.g., 'colors.primary.500')
 * @returns The token value
 */
export const getToken = (path: string): any => {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], tokens);
};

/**
 * Validate token path exists
 * @param path - The token path
 * @returns Whether the token exists
 */
export const hasToken = (path: string): boolean => {
  return getToken(path) !== undefined;
};

/**
 * Get all available token paths
 * @param obj - The token object
 * @param prefix - The path prefix
 * @returns Array of token paths
 */
export const getTokenPaths = (obj: any, prefix = ''): string[] => {
  const paths: string[] = [];
  
  Object.keys(obj).forEach((key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      paths.push(...getTokenPaths(obj[key], path));
    } else {
      paths.push(path);
    }
  });
  
  return paths;
};

/**
 * Generate CSS custom properties for a theme
 * @param theme - The theme object
 * @returns CSS custom properties object
 */
export const generateThemeCSS = (theme: any): Record<string, string> => {
  const cssVars: Record<string, string> = {};
  
  const processObject = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const cssKey = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'object' && value !== null && 'value' in value) {
        cssVars[`--${cssKey}`] = value.value;
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, cssKey);
      } else {
        cssVars[`--${cssKey}`] = String(value);
      }
    });
  };
  
  processObject(theme);
  return cssVars;
};

/**
 * Convert token value to CSS custom property
 * @param value - The token value
 * @returns CSS custom property string
 */
export const toCSSVar = (value: string): string => {
  return `var(--${value})`;
};

/**
 * Get responsive value based on breakpoint
 * @param values - Object with breakpoint keys and values
 * @param defaultValue - Default value
 * @returns Responsive value object
 */
export const getResponsiveValue = (
  values: Record<string, any>,
  defaultValue?: any
): Record<string, any> => {
  const responsive: Record<string, any> = {};
  
  if (defaultValue !== undefined) {
    responsive.base = defaultValue;
  }
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    responsive[breakpoint] = value;
  });
  
  return responsive;
};

/**
 * Generate responsive spacing classes
 * @param spacing - Spacing configuration for different breakpoints
 * @returns Object with responsive spacing classes
 */
export const responsiveSpacing = (spacing: {
  base?: SpacingToken;
  sm?: SpacingToken;
  md?: SpacingToken;
  lg?: SpacingToken;
  xl?: SpacingToken;
}) => {
  const classes: string[] = [];

  if (spacing.base) classes.push(`p-[${String(getSpacing(spacing.base))}]`);
  if (spacing.sm) classes.push(`sm:p-[${String(getSpacing(spacing.sm))}]`);
  if (spacing.md) classes.push(`md:p-[${String(getSpacing(spacing.md))}]`);
  if (spacing.lg) classes.push(`lg:p-[${String(getSpacing(spacing.lg))}]`);
  if (spacing.xl) classes.push(`xl:p-[${String(getSpacing(spacing.xl))}]`);

  return classes.join(' ');
};

/**
 * Generate responsive typography classes
 * @param typography - Typography configuration for different breakpoints
 * @returns Object with responsive typography classes
 */
export const responsiveTypography = (typography: {
  base?: FontSizeToken;
  sm?: FontSizeToken;
  md?: FontSizeToken;
  lg?: FontSizeToken;
  xl?: FontSizeToken;
}) => {
  const classes: string[] = [];

  if (typography.base) classes.push(`text-[${getFontSize(typography.base)}]`);
  if (typography.sm) classes.push(`sm:text-[${getFontSize(typography.sm)}]`);
  if (typography.md) classes.push(`md:text-[${getFontSize(typography.md)}]`);
  if (typography.lg) classes.push(`lg:text-[${getFontSize(typography.lg)}]`);
  if (typography.xl) classes.push(`xl:text-[${getFontSize(typography.xl)}]`);

  return classes.join(' ');
};

/**
 * Token validation utility
 * @param token - Token to validate
 * @param category - Token category
 * @returns Boolean indicating if token exists
 */
export const validateToken = (
  token: string,
  category: keyof typeof designTokens
): boolean => {
  return token in designTokens[category];
};

/**
 * Get all tokens of a specific category
 * @param category - Token category
 * @returns Array of token keys
 */
export const getTokensByCategory = (
  category: keyof typeof designTokens
): string[] => {
  return Object.keys(designTokens[category]);
};

/**
 * Component token utilities
 */
export const getComponentToken = <T extends ComponentToken>(
  component: T,
  property: keyof (typeof componentTokens)[T],
  variant?: string
): any => {
  const componentConfig = componentTokens[component];
  const propertyConfig =
    componentConfig[property as keyof typeof componentConfig];

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
 * Utility for consistent component styling
 */
export const componentStyles = {
  // Layout utilities
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 lg:py-16',

  // Flex utilities
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexColumn: 'flex flex-col',

  // Grid utilities
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',

  // Typography styles using tokens
  heading: {
    h1: 'text-4xl font-bold tracking-tight text-foreground',
    h2: 'text-3xl font-semibold tracking-tight text-foreground',
    h3: 'text-2xl font-semibold text-foreground',
    h4: 'text-xl font-semibold text-foreground',
    h5: 'text-lg font-medium text-foreground',
    h6: 'text-base font-medium text-foreground',
  },

  // Common text styles
  text: {
    body: 'text-base text-foreground',
    muted: 'text-sm text-muted-foreground',
    small: 'text-xs text-muted-foreground',
    lead: 'text-lg text-muted-foreground',
  },

  // Interactive states
  interactive: {
    hover: 'hover:bg-accent hover:text-accent-foreground transition-colors',
    focus:
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    active: 'active:scale-95 transition-transform',
  },

  // Card styles
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    interactive:
      'rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md',
    elevated: 'rounded-lg border bg-card text-card-foreground shadow-lg',
  },
};

// Export all tokens for convenience
export { designTokens, colorTokens, componentTokens };
