import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  ['relative w-full rounded-lg border p-4 text-sm', 'grid items-start'],
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        destructive: 'bg-card text-destructive-500 border-destructive-200',
        success: 'bg-success-50 text-success-600 border-success-200', // Using Tailwind's color scale
        warning: 'bg-warning-50 text-warning-600 border-warning-200', // Using Tailwind's color scale
        info: 'bg-info-50 text-info-600 border-info-200', // Using Tailwind's color scale
      },
      hasIcon: {
        true: 'grid-cols-[theme(spacing.4)_1fr] gap-x-3 gap-y-1', // Using theme(spacing.4) for icon width
        false: 'grid-cols-[0_1fr] gap-x-0 gap-y-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasIcon: false,
    },
  }
);

export const alertTitleVariants = cva(
  [
    'col-start-2 leading-tight min-h-4 font-medium tracking-tight',
    'overflow-hidden text-ellipsis whitespace-nowrap',
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

export const alertDescriptionVariants = cva(
  ['col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground'],
  {
    variants: {},
    defaultVariants: {},
  }
);
