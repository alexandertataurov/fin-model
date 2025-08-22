import { cva } from 'class-variance-authority';

export const accordionContainer = cva('flex flex-col w-full', {
  variants: {
    // Add any top-level accordion variants here if needed
  },
  defaultVariants: {},
});

export const accordionItemVariants = cva(
  'border-b border-border last:border-b-0',
  {
    variants: {
      // Add any item-specific variants here
    },
    defaultVariants: {},
  }
);

export const accordionTriggerVariants = cva(
  [
    'flex items-start justify-between gap-4 py-4 text-sm font-medium text-foreground rounded-md',
    'transition-all duration-normal ease-in-out',
    'hover:underline',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      isOpen: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      // Add compound variants if necessary
    ],
    defaultVariants: {
      isOpen: false,
      disabled: false,
    },
  }
);

export const accordionTriggerIconVariants = cva(
  'shrink-0 size-4 text-muted-foreground transition-transform duration-normal ease-in-out',
  {
    variants: {
      isOpen: {
        true: 'rotate-180',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

export const accordionContentVariants = cva(
  'overflow-hidden transition-all duration-normal ease-in-out',
  {
    variants: {
      isOpen: {
        true: 'max-h-[1000px] opacity-100 pb-4', // Arbitrary large max-height for smooth transition
        false: 'max-h-0 opacity-0 pb-0',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

// Combined accordionVariants export for backward compatibility
export const accordionVariants = {
  container: accordionContainer,
  item: accordionItemVariants,
  trigger: accordionTriggerVariants,
  triggerIcon: accordionTriggerIconVariants,
  content: accordionContentVariants,
};
