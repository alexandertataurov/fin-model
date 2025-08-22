import { cva } from 'class-variance-authority';

export const progressContainer = cva(
  ['relative w-full overflow-hidden rounded-full bg-muted-200'],
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const progressIndicator = cva(
  ['h-full transition-all duration-slow ease-smooth'],
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success-600',
        warning: 'bg-warning-600',
        destructive: 'bg-destructive-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
