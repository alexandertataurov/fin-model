import { cva } from 'class-variance-authority';

export const switchContainer = cva(
  [
    'relative inline-flex items-center flex-shrink-0 outline-none cursor-pointer',
    'transition-all ease-smooth duration-normal rounded-full',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      size: {
        sm: 'w-8 h-4',
        md: 'w-10 h-5',
        lg: 'w-12 h-6',
      },
      variant: {
        default: '',
        success: '',
        warning: '',
        destructive: '',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'default', checked: true, className: 'bg-primary' },
      { variant: 'default', checked: false, className: 'bg-muted-300' },
      { variant: 'success', checked: true, className: 'bg-success-600' },
      { variant: 'success', checked: false, className: 'bg-muted-300' },
      { variant: 'warning', checked: true, className: 'bg-warning-600' },
      { variant: 'warning', checked: false, className: 'bg-muted-300' },
      {
        variant: 'destructive',
        checked: true,
        className: 'bg-destructive-600',
      },
      { variant: 'destructive', checked: false, className: 'bg-muted-300' },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      checked: false,
    },
  }
);

export const switchThumb = cva(
  [
    'absolute rounded-full bg-background shadow-sm pointer-events-none transition-transform ease-smooth duration-normal',
  ],
  {
    variants: {
      size: {
        sm: 'w-3 h-3 left-0.5',
        md: 'w-4 h-4 left-0.5',
        lg: 'w-5 h-5 left-0.5',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', checked: true, className: 'translate-x-4' },
      { size: 'sm', checked: false, className: 'translate-x-0' },
      { size: 'md', checked: true, className: 'translate-x-5' },
      { size: 'md', checked: false, className: 'translate-x-0' },
      { size: 'lg', checked: true, className: 'translate-x-6' },
      { size: 'lg', checked: false, className: 'translate-x-0' },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
);
