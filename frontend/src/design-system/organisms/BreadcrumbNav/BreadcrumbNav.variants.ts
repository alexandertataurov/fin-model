import { cva } from 'class-variance-authority';

const breadcrumbNavVariantsConfig = {
  variant: {
    default: [
      'p-2',
    ],
    minimal: [
      'p-1',
    ],
    elevated: [
      'p-3 bg-muted/50 border border-border rounded-md',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  collapsed: {
    true: 'relative',
    false: '',
  },
};

const breadcrumbItemVariantsConfig = {
  variant: {
    default: [
      'm-0',
    ],
    minimal: [
      'm-0',
    ],
    elevated: [
      'm-0',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  active: {
    true: 'font-medium',
    false: 'font-normal',
  },
  disabled: {
    true: 'opacity-50 cursor-not-allowed',
    false: '',
  },
};

// Export CVA variants
export const breadcrumbNavVariants = cva(
  'w-full',
  {
    variants: breadcrumbNavVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      collapsed: false,
    },
  }
);

export const breadcrumbItemVariants = cva(
  'flex items-center',
  {
    variants: breadcrumbItemVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
      disabled: false,
    },
  }
);