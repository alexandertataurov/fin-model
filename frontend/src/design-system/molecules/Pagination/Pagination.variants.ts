import { cva } from 'class-variance-authority';

export const paginationVariants = cva(
  'flex items-center justify-center gap-1',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      variant: {
        default: '',
        outline: '',
        ghost: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export const paginationListVariants = cva(
  'flex items-center list-none p-0 m-0 gap-1',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const paginationItemVariants = cva('flex items-center', {
  variants: {},
  defaultVariants: {},
});

export const paginationLinkVariants = cva(
  'flex items-center justify-center min-w-9 h-9 px-3 border border-border rounded-md bg-background text-foreground text-sm font-medium no-underline cursor-pointer transition-all duration-normal ease-in-out',
  {
    variants: {
      active: {
        true: 'bg-primary text-primary-foreground border-primary',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      {
        active: false,
        disabled: false,
        className: 'hover:bg-muted-100 hover:border-muted-300',
      },
      {
        active: true,
        disabled: false,
        className: 'hover:bg-primary-600',
      },
    ],
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);

export const paginationEllipsisVariants = cva(
  'flex items-center justify-center min-w-9 h-9 px-3 text-muted-foreground text-sm',
  {
    variants: {},
    defaultVariants: {},
  }
);
