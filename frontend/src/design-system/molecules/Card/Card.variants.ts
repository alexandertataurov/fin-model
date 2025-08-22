import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-normal ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-md hover:shadow-lg',
        outline: 'border-border bg-transparent',
        ghost: 'border-transparent bg-transparent shadow-none',
        interactive:
          'border-border cursor-pointer hover:shadow-md hover:border-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export const cardHeaderVariants = cva(
  'flex flex-col gap-1.5', // 6px gap
  {
    variants: {
      padding: {
        none: 'pb-0',
        sm: 'pb-3',
        md: 'pb-4',
        lg: 'pb-6',
        xl: 'pb-8',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  }
);

export const cardTitleVariants = cva(
  'font-semibold leading-none tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export const cardDescriptionVariants = cva('text-sm text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export const cardContentVariants = cva('pt-0', {
  variants: {},
  defaultVariants: {},
});

export const cardFooterVariants = cva('flex items-center pt-0', {
  variants: {
    padding: {
      none: 'pt-0',
      sm: 'pt-3',
      md: 'pt-4',
      lg: 'pt-6',
      xl: 'pt-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});
