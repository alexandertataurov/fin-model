import { designTokens } from './tokens';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine Tailwind classes with proper merging
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Design system utility class for consistent styling
 */
export class DesignSystem {
  /**
   * Generate consistent button classes based on design tokens
   * @param variant - Button variant
   * @param size - Button size
   * @param disabled - Whether button is disabled
   * @returns Tailwind class string
   */
  static button(
    variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' = 'primary',
    size: 'sm' | 'default' | 'lg' = 'default',
    disabled = false
  ): string {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-colors duration-normal',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
    ];

    // Size-specific classes using design tokens
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      default: 'h-9 px-4 text-base',
      lg: 'h-10 px-6 text-lg',
    };

    // Variant-specific classes
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    const classes = [
      ...baseClasses,
      sizeClasses[size],
      variantClasses[variant],
    ];

    if (disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    }

    return cn(...classes);
  }

  /**
   * Generate consistent input classes based on design tokens
   * @param error - Whether input has error state
   * @param disabled - Whether input is disabled
   * @returns Tailwind class string
   */
  static input(error = false, disabled = false): string {
    const baseClasses = [
      'flex h-9 w-full rounded-md border px-3 py-1',
      'text-base bg-background',
      'transition-colors duration-normal',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Autofill styling for better design system compliance
      '[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground',
      '[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
      '[&:-webkit-autofill]:border-ring [&:-webkit-autofill]:ring-2 [&:-webkit-autofill]:ring-ring [&:-webkit-autofill]:ring-offset-2',
      '[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal',
      '[&:-webkit-autofill:focus]:border-ring [&:-webkit-autofill:focus]:ring-2 [&:-webkit-autofill:focus]:ring-ring [&:-webkit-autofill:focus]:ring-offset-2',
      '[&:-webkit-autofill:hover]:border-ring',
      'dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground',
      'dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
      'dark:[&:-webkit-autofill]:border-ring dark:[&:-webkit-autofill]:ring-2 dark:[&:-webkit-autofill]:ring-ring dark:[&:-webkit-autofill]:ring-offset-2',
    ];

    if (error) {
      baseClasses.push(
        'border-destructive focus-visible:ring-destructive',
        '[&:-webkit-autofill]:border-destructive [&:-webkit-autofill]:ring-destructive',
        '[&:-webkit-autofill:focus]:border-destructive [&:-webkit-autofill:focus]:ring-destructive'
      );
    } else {
      baseClasses.push('border-input');
    }

    if (disabled) {
      baseClasses.push('bg-muted cursor-not-allowed');
    }

    return cn(...baseClasses);
  }

  /**
   * Generate consistent card classes based on design tokens
   * @param variant - Card variant
   * @returns Tailwind class string
   */
  static card(variant: 'default' | 'outline' | 'filled' = 'default'): string {
    const baseClasses = [
      'rounded-lg bg-card text-card-foreground',
      'transition-shadow duration-normal',
    ];

    const variantClasses = {
      default: 'border shadow-sm',
      outline: 'border-2',
      filled: 'shadow-md',
    };

    return cn(...baseClasses, variantClasses[variant]);
  }

  /**
   * Generate consistent alert classes based on design tokens
   * @param variant - Alert variant
   * @returns Tailwind class string
   */
  static alert(variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default'): string {
    const baseClasses = [
      'relative w-full rounded-lg border px-4 py-3',
      'text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
      '[&>svg~*]:pl-7',
    ];

    const variantClasses = {
      default: 'bg-background text-foreground border',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      success: 'border-success/50 text-success dark:border-success [&>svg]:text-success bg-success/10',
      warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning bg-warning/10',
      info: 'border-info/50 text-info dark:border-info [&>svg]:text-info bg-info/10',
    };

    return cn(...baseClasses, variantClasses[variant]);
  }

  /**
   * Generate consistent badge classes based on design tokens
   * @param variant - Badge variant
   * @returns Tailwind class string
   */
  static badge(variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' = 'default'): string {
    const baseClasses = [
      'inline-flex items-center rounded-md px-2 py-1',
      'text-xs font-semibold',
      'transition-colors duration-normal',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    ];

    const variantClasses = {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
      outline: 'text-foreground border',
      success: 'bg-success text-success-foreground shadow hover:bg-success/80',
      warning: 'bg-warning text-warning-foreground shadow hover:bg-warning/80',
      info: 'bg-info text-info-foreground shadow hover:bg-info/80',
    };

    return cn(...baseClasses, variantClasses[variant]);
  }

  /**
   * Generate chart color based on index
   * @param index - Chart data series index (0-7)
   * @returns CSS custom property for chart color
   */
  static chartColor(index: number): string {
    const colorIndex = (index % 8) + 1;
    return `var(--chart-${colorIndex})`;
  }

  /**
   * Generate responsive grid classes
   * @param columns - Number of columns for different breakpoints
   * @returns Tailwind grid class string
   */
  static responsiveGrid(columns: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }): string {
    const classes = ['grid gap-4'];

    if (columns.base) classes.push(`grid-cols-${columns.base}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

    return cn(...classes);
  }

  /**
   * Generate consistent spacing classes
   * @param direction - Spacing direction
   * @param size - Spacing size from design tokens
   * @returns Tailwind spacing class
   */
  static spacing(
    direction: 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl' | 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml',
    size: keyof typeof designTokens.spacing
  ): string {
    const sizeMap = {
      xs: '1',
      sm: '2',
      md: '4',
      lg: '6',
      xl: '8',
      '2xl': '12',
      '3xl': '16',
    };

    return `${direction}-${sizeMap[size]}`;
  }

  /**
   * Generate text size classes with proper line height
   * @param size - Font size from design tokens
   * @returns Tailwind text size class
   */
  static textSize(size: keyof typeof designTokens.fontSize): string {
    return `text-${size}`;
  }

  /**
   * Generate shadow classes
   * @param size - Shadow size from design tokens
   * @returns Tailwind shadow class
   */
  static shadow(size: keyof typeof designTokens.boxShadow): string {
    const shadowMap = {
      sm: 'shadow-sm',
      default: 'shadow',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };

    return shadowMap[size] || 'shadow';
  }
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
  flexBetweenResponsive: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
  absoluteCenter: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

  // Interactive states
  interactive: 'transition-colors duration-normal hover:bg-accent hover:text-accent-foreground',
  focusRing: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
} as const;