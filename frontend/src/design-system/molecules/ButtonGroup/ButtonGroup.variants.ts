import { cva } from 'class-variance-authority';

export const buttonGroupVariants = cva('inline-flex rounded-md', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    size: {
      sm: 'gap-1', // getToken('spacing.1')
      md: 'gap-px', // 2px, using gap-px for 1px, will need to adjust if 2px is needed
      lg: 'gap-1', // getToken('spacing.1')
    },
    variant: {
      default: 'shadow-sm',
      outline: 'border border-border',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    variant: 'default',
  },
});
