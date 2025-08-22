import { cva } from 'class-variance-authority';

export const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    decorative: {
      true: 'my-4',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
