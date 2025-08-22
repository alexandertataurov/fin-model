import { cva } from 'class-variance-authority';

export const breadcrumbVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const breadcrumbListVariants = cva(
  'flex items-center list-none p-0 m-0 gap-2',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const breadcrumbItemVariants = cva('flex items-center', {
  variants: {},
  defaultVariants: {},
});

export const breadcrumbLinkVariants = cva(
  'text-muted-foreground no-underline font-normal transition-colors duration-normal ease-in-out',
  {
    variants: {
      current: {
        true: 'text-foreground font-medium cursor-default pointer-events-none',
        false: 'hover:text-foreground',
      },
    },
    defaultVariants: {
      current: false,
    },
  }
);

export const breadcrumbSeparatorVariants = cva(
  'flex items-center justify-center size-4 text-muted-foreground mx-2',
  {
    variants: {},
    defaultVariants: {},
  }
);
