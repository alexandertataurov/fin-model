import { cva } from 'class-variance-authority';

const dataTableVariantsConfig = {
  variant: {
    default: [
      'w-full',
    ],
    outline: [
      'w-full',
    ],
    filled: [
      'w-full',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  striped: {
    true: '',
    false: '',
  },
};

const dataTableHeaderVariantsConfig = {
  variant: {
    default: [
      'bg-background',
    ],
    outline: [
      'bg-background',
    ],
    filled: [
      'bg-muted/50',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  sortable: {
    true: 'cursor-pointer hover:bg-muted/50 transition-colors',
    false: '',
  },
};

const dataTableRowVariantsConfig = {
  variant: {
    default: [
      'border-b border-border',
    ],
    outline: [
      'border-b border-border',
    ],
    filled: [
      'border-b border-border',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  striped: {
    true: '',
    false: '',
  },
};

const dataTableCellVariantsConfig = {
  variant: {
    default: [
      'p-3',
    ],
    outline: [
      'p-3',
    ],
    filled: [
      'p-3',
    ],
  },
  size: {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  },
};

// Export CVA variants
export const dataTableVariants = cva(
  'w-full',
  {
    variants: dataTableVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      striped: false,
    },
  }
);

export const dataTableHeaderVariants = cva(
  'font-medium text-foreground',
  {
    variants: dataTableHeaderVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      sortable: false,
    },
  }
);

export const dataTableRowVariants = cva(
  'transition-colors',
  {
    variants: dataTableRowVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      striped: false,
    },
  }
);

export const dataTableCellVariants = cva(
  '',
  {
    variants: dataTableCellVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
