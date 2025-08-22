import { cva } from 'class-variance-authority';
// No need for getToken here, as CVA will generate Tailwind classes directly

export const datePickerVariants = cva('relative inline-block w-full', {
  variants: {
    variant: {
      outline: '',
      filled: '',
      ghost: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed bg-muted border-border hover:border-border hover:bg-muted',
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
    // Size specific styles for the main container if needed, though input handles most of it
  ],
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    disabled: false,
  },
});

export const datePickerTriggerVariants = cva(
  'relative flex items-center cursor-pointer',
  {
    variants: {
      variant: {
        outline: '',
        filled: '',
        ghost: '',
      },
      size: {
        sm: 'min-h-8 gap-2',
        md: 'min-h-10 gap-3',
        lg: 'min-h-12 gap-4',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive',
        false: '',
      },
    },
    compoundVariants: [
      // These styles are mostly handled by the Input atom, but keeping them here for consistency if needed
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
      error: false,
    },
  }
);

export const datePickerContentVariants = cva(
  'absolute top-full left-0 z-dropdown bg-background border border-border rounded-lg shadow-lg p-4 min-w-[280px]', // min-w-[280px] is hardcoded, but can be a custom value in tailwind.config.js
  {
    variants: {
      variant: {
        outline: '',
        filled: '',
        ghost: '',
      },
      size: {
        sm: 'text-sm p-3',
        md: 'text-base p-4',
        lg: 'text-lg p-5',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
);

export const datePickerHeaderVariants = cva(
  'flex items-center justify-between mb-3',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const datePickerFooterVariants = cva(
  'flex items-center justify-between mt-3 pt-3 border-t border-border',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const datePickerInputWrapperVariants = cva('flex-1 mr-2', {
  variants: {},
  defaultVariants: {},
});

export const calendarWrapperVariants = cva('my-2', {
  variants: {},
  defaultVariants: {},
});

export const iconButtonVariants = cva(
  'flex items-center justify-center bg-transparent border-none cursor-pointer p-1 rounded-sm text-muted-foreground transition-all duration-normal ease-in-out hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
