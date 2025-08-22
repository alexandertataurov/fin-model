import { cva } from 'class-variance-authority';
// No need for getToken here, as CVA will generate Tailwind classes directly

export const inputOTPVariants = cva('flex items-center', {
  variants: {
    variant: {
      outline: '',
      filled: '',
      ghost: '',
    },
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      className:
        'border border-border bg-background hover:border-input focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
    },
    {
      variant: 'filled',
      className:
        'border border-transparent bg-muted hover:bg-muted-foreground/10 focus-within:bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
    },
    {
      variant: 'ghost',
      className:
        'border border-transparent bg-transparent hover:bg-muted focus-within:bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
    },
  ],
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    disabled: false,
  },
});

export const inputOTPSlotVariants = cva(
  'relative flex items-center justify-center border text-base font-medium text-center transition-all duration-normal ease-in-out cursor-text select-none',
  {
    variants: {
      variant: {
        outline: 'border-border bg-background hover:border-input',
        filled: 'border-transparent bg-muted hover:bg-muted-foreground/10',
        ghost: 'border-transparent bg-transparent hover:bg-muted',
      },
      size: {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
      },
      isActive: {
        true: 'border-primary shadow-sm ring-1 ring-primary z-10',
        false: '',
      },
      hasValue: {
        true: 'bg-primary text-primary-foreground border-primary',
        false: '',
      },
      isError: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive',
        false: '',
      },
      isFirst: {
        true: '',
        false: '',
      },
      isLast: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        isFirst: true,
        isLast: true,
        className: 'rounded-md',
      },
      {
        isFirst: true,
        isLast: false,
        className: 'rounded-l-md',
      },
      {
        isFirst: false,
        isLast: true,
        className: 'rounded-r-md',
      },
      {
        isFirst: false,
        isLast: false,
        className: 'rounded-none',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      isActive: false,
      hasValue: false,
      isError: false,
      isFirst: false,
      isLast: false,
    },
  }
);

export const inputOTPSeparatorVariants = cva(
  'flex items-center justify-center text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'text-sm w-4',
        md: 'text-base w-6',
        lg: 'text-lg w-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const caretVariants = cva(
  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-foreground animate-blink pointer-events-none',
  {
    variants: {},
    defaultVariants: {},
  }
);
