import { cva } from 'class-variance-authority';

export const selectTriggerVariants = cva(
  'flex items-center justify-between gap-2 w-full border rounded-md bg-background text-foreground cursor-pointer transition-all duration-normal ease-in-out outline-none whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'px-2 py-1.5 text-xs min-h-8',
        md: 'px-3 py-2 text-sm min-h-9',
        lg: 'px-4 py-3 text-base min-h-10',
      },
      variant: {
        default:
          'border-border hover:border-border focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
        outline:
          'border-border bg-transparent hover:bg-muted-50 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
        ghost:
          'border-transparent bg-transparent hover:bg-muted-50 focus-visible:bg-muted-50 focus-visible:border-ring',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50 bg-muted-50',
        false: '',
      },
      error: {
        true: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive',
        false: '',
      },
      success: {
        true: 'border-success focus-visible:border-success focus-visible:ring-success',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      disabled: false,
      error: false,
      success: false,
    },
  }
);

export const selectContentVariants = cva(
  'absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg max-h-64 overflow-y-auto mt-1',
  {
    variants: {
      open: {
        true: 'block',
        false: 'hidden',
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

export const selectItemVariants = cva(
  'flex items-center gap-2 px-3 py-2 cursor-pointer text-foreground transition-colors duration-150 ease-in-out',
  {
    variants: {
      selected: {
        true: 'bg-muted-100 text-foreground font-medium',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50 text-muted-foreground pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        selected: false,
        disabled: false,
        className: 'hover:bg-muted-50',
      },
    ],
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
);

export const selectValueVariants = cva(
  'flex items-center gap-2 flex-1 overflow-hidden text-ellipsis',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const selectGroupVariants = cva('', {
  variants: {},
  defaultVariants: {},
});

export const selectLabelVariants = cva(
  'px-3 py-2 text-sm font-semibold text-foreground',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const selectSeparatorVariants = cva('h-px bg-border my-1', {
  variants: {},
  defaultVariants: {},
});

// Combined selectVariants export for backward compatibility
export const selectVariants = {
  trigger: selectTriggerVariants,
  content: selectContentVariants,
  item: selectItemVariants,
  value: selectValueVariants,
  group: selectGroupVariants,
  label: selectLabelVariants,
  separator: selectSeparatorVariants,
};
