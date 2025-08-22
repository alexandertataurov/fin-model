import { cva } from 'class-variance-authority';

export const sliderContainer = cva(
  ['relative flex w-full touch-none select-none items-center'],
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'h-full min-h-20 w-auto flex-col',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      disabled: false,
    },
  }
);

export const sliderTrack = cva(
  ['relative flex-grow overflow-hidden rounded-full bg-muted-200'],
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'h-full',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      { orientation: 'horizontal', size: 'sm', className: 'h-2 w-full' },
      { orientation: 'horizontal', size: 'md', className: 'h-4 w-full' },
      { orientation: 'horizontal', size: 'lg', className: 'h-6 w-full' },
      { orientation: 'vertical', size: 'sm', className: 'w-1' },
      { orientation: 'vertical', size: 'md', className: 'w-2' },
      { orientation: 'vertical', size: 'lg', className: 'w-2' },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'md',
    },
  }
);

export const sliderRange = cva(['absolute'], {
  variants: {
    variant: {
      default: 'bg-primary-500',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      destructive: 'bg-destructive-500',
    },
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    orientation: 'horizontal',
  },
});

export const sliderThumb = cva(
  [
    'absolute block shrink-0 rounded-full border border-primary-500 bg-background shadow-sm',
    'transition-shadow ease-smooth duration-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ],
  {
    variants: {
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
