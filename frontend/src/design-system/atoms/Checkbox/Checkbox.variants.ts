import { cva } from 'class-variance-authority';

export const checkboxContainer = cva(
  [
    'relative inline-flex items-center justify-center shrink-0 outline-none cursor-pointer',
    'transition-all ease-smooth duration-normal rounded-sm border',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
  ],
  {
    variants: {
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
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
      indeterminate: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        checked: true,
        className: 'bg-primary-500 border-primary-500',
      },
      {
        variant: 'default',
        checked: false,
        className: 'bg-transparent border-input',
      },
      {
        variant: 'success',
        checked: true,
        className: 'bg-success-600 border-success-600',
      },
      {
        variant: 'warning',
        checked: true,
        className: 'bg-warning-600 border-warning-600',
      },
      {
        variant: 'destructive',
        checked: true,
        className: 'bg-destructive-500 border-destructive-500',
      },
      // indeterminate treated same as checked
      {
        variant: 'default',
        indeterminate: true,
        className: 'bg-primary-500 border-primary-500',
      },
      {
        variant: 'success',
        indeterminate: true,
        className: 'bg-success-600 border-success-600',
      },
      {
        variant: 'warning',
        indeterminate: true,
        className: 'bg-warning-600 border-warning-600',
      },
      {
        variant: 'destructive',
        indeterminate: true,
        className: 'bg-destructive-500 border-destructive-500',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      checked: false,
      indeterminate: false,
    },
  }
);

export const checkboxIcon = cva(
  ['flex items-center justify-center text-background'],
  {
    variants: {
      size: {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
      },
      visible: {
        true: '',
        false: 'hidden',
      },
    },
    defaultVariants: {
      size: 'md',
      visible: false,
    },
  }
);
