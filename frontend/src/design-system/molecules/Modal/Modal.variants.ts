import { cva } from 'class-variance-authority';

export const modalOverlayVariants = cva(
  'fixed inset-0 flex items-center justify-center p-4 bg-black/80 z-modal transition-all duration-normal ease-in-out',
  {
    variants: {
      open: {
        true: 'opacity-100 visible',
        false: 'opacity-0 invisible',
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

export const modalContentVariants = cva(
  'bg-background rounded-lg shadow-xl border border-border max-h-[90vh] overflow-hidden transition-transform duration-normal ease-in-out',
  {
    variants: {
      size: {
        sm: 'w-96',
        md: 'w-[42rem]', // Equivalent to space.2xl (672px)
        lg: 'w-[56rem]', // Equivalent to space.4xl (896px)
        xl: 'w-[72rem]', // Equivalent to space.6xl (1152px)
        full: 'w-full h-full',
      },
      variant: {
        default: '',
        centered: 'flex flex-col items-center text-center',
        drawer: 'fixed top-0 right-0 h-screen rounded-none',
      },
      open: {
        true: 'scale-100',
        false: 'scale-95',
      },
    },
    compoundVariants: [
      {
        variant: 'drawer',
        open: false,
        className: 'translate-x-full',
      },
      {
        variant: 'drawer',
        open: true,
        className: 'translate-x-0',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'default',
      open: false,
    },
  }
);

export const modalHeaderVariants = cva(
  'flex items-center justify-between p-6 border-b border-border',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const modalTitleVariants = cva(
  'text-lg font-semibold text-foreground m-0',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const modalDescriptionVariants = cva(
  'text-sm text-muted-foreground mt-2',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const modalBodyVariants = cva('p-6 overflow-y-auto', {
  variants: {},
  defaultVariants: {},
});

export const modalFooterVariants = cva(
  'flex items-center justify-end gap-3 p-6 border-t border-border',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const modalCloseButtonVariants = cva(
  'flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-muted-foreground cursor-pointer transition-all duration-normal ease-in-out hover:bg-muted-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {},
    defaultVariants: {},
  }
);
