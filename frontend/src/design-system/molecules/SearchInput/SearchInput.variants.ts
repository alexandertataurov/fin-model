import { cva } from 'class-variance-authority';

export const searchInputContainerVariants = cva('relative', {
  variants: {},
  defaultVariants: {},
});

export const searchInputWrapperVariants = cva('relative', {
  variants: {},
  defaultVariants: {},
});

export const searchInputIconContainerVariants = cva(
  'absolute top-1/2 -translate-y-1/2 pointer-events-none',
  {
    variants: {
      position: {
        left: 'left-3',
        right: 'right-1 flex items-center gap-1',
      },
    },
    defaultVariants: {
      position: 'left',
    },
  }
);

export const searchInputButtonVariants = cva('h-6 w-6', {
  variants: {},
  defaultVariants: {},
});
