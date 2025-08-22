import { cva } from 'class-variance-authority';

export const formFieldContainerVariants = cva('space-y-2', {
  variants: {
    // Add any container-specific variants here if needed
  },
  defaultVariants: {},
});

export const formFieldLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      error: {
        true: 'text-destructive',
        false: 'text-foreground',
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export const formFieldHelperTextVariants = cva('text-sm', {
  variants: {
    error: {
      true: 'text-destructive',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    error: false,
  },
});

export const formFieldRequiredIndicatorVariants = cva('text-destructive ml-1', {
  variants: {},
  defaultVariants: {},
});
