import { cva } from 'class-variance-authority';

export const tabsVariants = cva('flex w-full', {
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const tabsListVariants = cva(
  'flex bg-muted-50 rounded-xl p-1 gap-1 border border-border',
  {
    variants: {},
    defaultVariants: {},
  }
);

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-transparent bg-transparent text-muted-foreground cursor-pointer transition-all duration-normal ease-in-out whitespace-nowrap min-h-8',
  {
    variants: {
      isActive: {
        true: 'bg-background text-foreground border-border shadow-sm',
        false: 'hover:bg-muted-100 hover:text-foreground',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      isActive: false,
      disabled: false,
    },
  }
);

export const tabsContentVariants = cva('flex-1 outline-none', {
  variants: {
    isActive: {
      true: 'block',
      false: 'hidden',
    },
  },
  defaultVariants: {
    isActive: false,
  },
});
