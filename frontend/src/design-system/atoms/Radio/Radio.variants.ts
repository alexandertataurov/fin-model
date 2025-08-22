import { cva } from 'class-variance-authority';

export const radioContainer = cva(
  [
    'relative inline-flex items-center justify-center shrink-0 outline-none cursor-pointer rounded-full border',
    'transition-all ease-smooth duration-normal',
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
    },
    compoundVariants: [
      { variant: 'default', checked: true, className: 'border-primary-500' },
      { variant: 'default', checked: false, className: 'border-input' },
      { variant: 'success', checked: true, className: 'border-success-600' },
      { variant: 'warning', checked: true, className: 'border-warning-600' },
      {
        variant: 'destructive',
        checked: true,
        className: 'border-destructive-500',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      checked: false,
    },
  }
);

export const radioIndicator = cva(
  ['absolute flex items-center justify-center'],
  {
    variants: {
      size: {
        sm: 'w-1 h-1',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
      },
      variant: {
        default: 'text-primary-500',
        success: 'text-success-600',
        warning: 'text-warning-600',
        destructive: 'text-destructive-500',
      },
      visible: {
        true: '',
        false: 'hidden',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      visible: false,
    },
  }
);
