import { cva } from 'class-variance-authority';

export const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap',
    'transition-all ease-smooth duration-normal outline-none cursor-pointer border',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 min-w-8 px-2 text-sm',
        md: 'h-9 min-w-9 px-2 text-sm',
        lg: 'h-10 min-w-10 px-3 text-base',
      },
      variant: {
        default: '',
        outline: 'border-input',
        success: '',
        warning: '',
        destructive: '',
      },
      pressed: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        pressed: true,
        className: 'bg-accent text-accent-foreground border-transparent',
      },
      {
        variant: 'default',
        pressed: false,
        className: 'bg-transparent text-foreground border-transparent',
      },
      {
        variant: 'outline',
        pressed: true,
        className: 'bg-accent text-accent-foreground border-input',
      },
      {
        variant: 'outline',
        pressed: false,
        className: 'bg-transparent text-foreground border-input',
      },
      {
        variant: 'success',
        pressed: true,
        className: 'bg-success-600 text-white border-transparent',
      },
      {
        variant: 'success',
        pressed: false,
        className: 'bg-transparent text-foreground border-transparent',
      },
      {
        variant: 'warning',
        pressed: true,
        className: 'bg-warning-600 text-white border-transparent',
      },
      {
        variant: 'warning',
        pressed: false,
        className: 'bg-transparent text-foreground border-transparent',
      },
      {
        variant: 'destructive',
        pressed: true,
        className: 'bg-destructive-600 text-white border-transparent',
      },
      {
        variant: 'destructive',
        pressed: false,
        className: 'bg-transparent text-foreground border-transparent',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      pressed: false,
    },
  }
);
