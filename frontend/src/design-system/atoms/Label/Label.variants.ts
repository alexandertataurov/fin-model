import { cva } from 'class-variance-authority';

export const labelVariants = cva(
  [
    // Base styles
    'flex items-center gap-2 text-sm leading-none font-medium select-none',
    'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      required: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      required: false,
    },
  }
);
