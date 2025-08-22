import { cva } from 'class-variance-authority';

export const iconVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
      },
      spacing: {
        none: 'gap-0',
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3',
        xl: 'gap-4',
      },
      padding: {
        none: 'p-0',
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-3',
        xl: 'p-4',
      },
      margin: {
        none: 'm-0',
        sm: 'm-1',
        md: 'm-2',
        lg: 'm-3',
        xl: 'm-4',
      },
      motion: {
        none: 'transition-none',
        fast: 'transition-all duration-fast ease-smooth',
        normal: 'transition-all duration-normal ease-smooth',
        slow: 'transition-all duration-slow ease-smooth',
      },
      transition: {
        none: 'transition-none',
        fast: 'transition-all duration-fast ease-smooth',
        normal: 'transition-all duration-normal ease-smooth',
        slow: 'transition-all duration-slow ease-smooth',
        colors: 'transition-colors duration-normal ease-smooth',
        transform: 'transition-transform duration-fast ease-smooth',
        opacity: 'transition-opacity duration-normal ease-smooth',
      },
    },
    defaultVariants: {
      size: 'md',
      spacing: 'none',
      padding: 'none',
      margin: 'none',
      motion: 'normal',
      transition: 'normal',
    },
  }
);
