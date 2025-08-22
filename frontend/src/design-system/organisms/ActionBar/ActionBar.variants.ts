import { cva } from 'class-variance-authority';

const actionBarVariantsConfig = {
  variant: {
    default: [
      'w-full bg-background border border-border rounded-lg',
      'focus-within:ring-2 focus-within:ring-ring/20',
    ],
    minimal: [
      'w-full bg-transparent border-none',
    ],
    elevated: [
      'w-full bg-background border border-border rounded-lg shadow-md',
      'focus-within:ring-2 focus-within:ring-ring/20',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  sticky: {
    true: 'sticky top-0 z-sticky',
    false: 'relative',
  },
};

const actionBarHeaderVariantsConfig = {
  variant: {
    default: [
      'p-4 border-b border-border',
    ],
    minimal: [
      'p-3',
    ],
    elevated: [
      'p-4 border-b border-border bg-muted/50',
    ],
  },
  size: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  },
};

const actionBarContentVariantsConfig = {
  variant: {
    default: [
      'p-4',
    ],
    minimal: [
      'p-3',
    ],
    elevated: [
      'p-4',
    ],
  },
  size: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  },
};

const actionGroupVariantsConfig = {
  variant: {
    default: [
      'p-2 rounded-md',
    ],
    minimal: [
      'p-1',
    ],
    elevated: [
      'p-2 rounded-md bg-muted/50',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  expanded: {
    true: 'bg-muted/50',
    false: '',
  },
};

// Export CVA variants
export const actionBarVariants = cva(
  'w-full',
  {
    variants: actionBarVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      sticky: false,
    },
  }
);

export const actionBarHeaderVariants = cva(
  '',
  {
    variants: actionBarHeaderVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const actionBarContentVariants = cva(
  'flex items-center gap-3',
  {
    variants: actionBarContentVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const actionGroupVariants = cva(
  '',
  {
    variants: actionGroupVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      expanded: false,
    },
  }
);
