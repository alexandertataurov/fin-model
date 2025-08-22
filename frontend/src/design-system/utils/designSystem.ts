import { useDesignTokens } from '../../hooks/useDesignTokens';

/**
 * Design system utility functions for consistent styling
 */

/**
 * Generate consistent button classes based on design tokens
 * @param variant - Button variant
 * @param size - Button size
 * @param disabled - Whether button is disabled
 * @returns Tailwind class string
 */
export function useButtonClasses(variant: string, size: string, disabled = false): string {
  const tokens = useDesignTokens();

  const baseClasses = [
    'inline-flex items-center justify-center',
    'whitespace-nowrap font-medium',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'active:scale-[0.98]',
    'transition-all duration-300 ease-in-out',
  ];

  if (disabled) {
    baseClasses.push('opacity-50 cursor-not-allowed pointer-events-none');
  }

  // Add variant-specific classes
  const variantClasses = {
    primary: [
      'bg-primary text-primary-foreground shadow-sm',
      'hover:bg-primary/90 hover:shadow-md',
      'focus-visible:ring-primary/20',
    ],
    secondary: [
      'bg-secondary text-secondary-foreground shadow-sm',
      'hover:bg-secondary/80 hover:shadow-md',
      'focus-visible:ring-secondary/20',
    ],
    outline: [
      'border border-input bg-background',
      'hover:bg-accent hover:text-accent-foreground hover:shadow-sm',
      'focus-visible:ring-ring/20',
    ],
    ghost: [
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:ring-ring/20',
    ],
    destructive: [
      'bg-destructive text-destructive-foreground shadow-sm',
      'hover:bg-destructive/90 hover:shadow-md',
      'focus-visible:ring-destructive/20',
    ],
  };

  // Add size-specific classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-9 px-4 py-2 text-base gap-2',
    lg: 'h-10 px-6 text-lg gap-2',
    xl: 'h-12 px-8 text-xl gap-2',
  };

  return [
    ...baseClasses,
    ...(variantClasses[variant] || variantClasses.primary),
    ...(sizeClasses[size] || sizeClasses.md),
  ].join(' ');
}

/**
 * Generate consistent input classes based on design tokens
 * @param variant - Input variant
 * @param size - Input size
 * @param error - Whether input has error
 * @returns Tailwind class string
 */
export function useInputClasses(variant: string, size: string, error = false): string {
  const tokens = useDesignTokens();

  const baseClasses = [
    'flex w-full',
    'border border-input bg-background',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-all duration-300 ease-in-out',
  ];

  if (error) {
    baseClasses.push('border-destructive focus-visible:ring-destructive');
  }

  // Add variant-specific classes
  const variantClasses = {
    default: 'text-foreground placeholder:text-muted-foreground',
    filled: 'bg-muted text-foreground',
    outline: 'border-2 text-foreground',
  };

  // Add size-specific classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-base',
    lg: 'h-10 px-6 text-lg',
    xl: 'h-12 px-8 text-xl',
  };

  return [
    ...baseClasses,
    ...(variantClasses[variant] || variantClasses.default),
    ...(sizeClasses[size] || sizeClasses.md),
  ].join(' ');
}

/**
 * Generate consistent spacing based on design tokens
 * @param size - Spacing size from design tokens
 * @returns CSS spacing value
 */
export function useSpacing(size: string): string {
  const tokens = useDesignTokens();
  return tokens.getSpacing(size as any);
}

/**
 * Generate consistent border radius based on design tokens
 * @param size - Border radius size from design tokens
 * @returns CSS border radius value
 */
export function useBorderRadius(size: string): string {
  const tokens = useDesignTokens();
  return tokens.getBorderRadius(size as any);
}

/**
 * Generate consistent font size based on design tokens
 * @param size - Font size from design tokens
 * @returns CSS font size value
 */
export function useFontSize(size: string): string {
  const tokens = useDesignTokens();
  return tokens.getFontSize(size as any);
}

/**
 * Generate consistent shadow based on design tokens
 * @param size - Shadow size from design tokens
 * @returns CSS box shadow value
 */
export function useBoxShadow(size: string): string {
  const tokens = useDesignTokens();
  return tokens.getBoxShadow(size as any);
}

/**
 * Generate consistent color based on design tokens
 * @param color - Color name from design tokens
 * @returns CSS color value
 */
export function useColor(color: string): string {
  const tokens = useDesignTokens();
  return tokens.getColor(color as any);
}

/**
 * Generate theme-aware color based on design tokens
 * @param color - Color name from design tokens
 * @returns CSS color value for current theme
 */
export function useThemeColor(color: string): string {
  const tokens = useDesignTokens();
  return tokens.getThemeColor(color);
}

/**
 * Generate consistent motion based on design tokens
 * @param type - Motion type (easing, duration, delay)
 * @param key - Motion key
 * @returns CSS motion value
 */
export function useMotion(type: string, key: string): string {
  const tokens = useDesignTokens();
  return tokens.getMotion(type as any, key);
}

/**
 * Generate CSS custom properties for a component
 * @param component - Component name
 * @param props - Component props
 * @returns CSS custom properties object
 */
export function useCSSVariables(component: string, props: Record<string, any>): Record<string, string> {
  const tokens = useDesignTokens();
  const cssVars: Record<string, string> = {};

  // Add component-specific variables
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      cssVars[`--${component}-${key}`] = String(value);
    }
  });

  // Add theme variables
  cssVars['--component-bg'] = tokens.getThemeColor('background');
  cssVars['--component-color'] = tokens.getThemeColor('foreground');
  cssVars['--component-border'] = tokens.getThemeColor('border');

  return cssVars;
}

/**
 * Predefined component style configurations using design tokens
 */
export const componentStyles = {
  // Common layout patterns
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16 xl:py-20',

  // Typography patterns
  heading: {
    h1: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-foreground leading-tight',
    h2: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-foreground',
    h3: 'text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-foreground',
    h4: 'text-base sm:text-lg lg:text-xl font-semibold text-foreground',
    h5: 'text-sm sm:text-base lg:text-lg font-semibold text-foreground',
    h6: 'text-xs sm:text-sm lg:text-base font-semibold text-foreground',
  },

  // Common patterns
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexBetweenResponsive:
    'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
  absoluteCenter:
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

  // Interactive states
  interactive:
    'transition-colors duration-normal hover:bg-accent hover:text-accent-foreground',
  focusRing:
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
} as const;
