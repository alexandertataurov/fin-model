import { cva } from 'class-variance-authority';

export const skeletonVariants = cva(['bg-muted-200 rounded-md animate-pulse'], {
  variants: {
    variant: {
      default: 'rounded-md',
      circular: 'rounded-full',
      text: 'rounded-sm h-[1em] my-2',
      rectangular: 'rounded-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
