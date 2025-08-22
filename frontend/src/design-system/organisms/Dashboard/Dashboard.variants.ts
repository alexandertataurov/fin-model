import { cva } from 'class-variance-authority';

const dashboardVariantsConfig = {
  variant: {
    default: [
      'bg-background',
    ],
    minimal: [
      'bg-transparent',
    ],
    elevated: [
      'bg-background shadow-lg',
    ],
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  layout: {
    grid: 'grid gap-6',
    list: 'flex flex-col gap-4',
    compact: 'grid gap-3',
  },
};

const dashboardHeaderVariantsConfig = {
  variant: {
    default: [
      'p-6 border-b border-border',
    ],
    minimal: [
      'p-4',
    ],
    elevated: [
      'p-6 border-b border-border bg-muted/50',
    ],
  },
  size: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
};

const dashboardContentVariantsConfig = {
  variant: {
    default: [
      'p-6',
    ],
    minimal: [
      'p-4',
    ],
    elevated: [
      'p-6',
    ],
  },
  size: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
};

const dashboardWidgetVariantsConfig = {
  variant: {
    default: [
      'bg-background',
    ],
    minimal: [
      'bg-transparent',
    ],
    elevated: [
      'bg-background shadow-md',
    ],
  },
  size: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  },
  trend: {
    positive: 'border-l-4 border-l-success',
    negative: 'border-l-4 border-l-destructive',
    neutral: 'border-l-4 border-l-border',
  },
};

// Export CVA variants
export const dashboardVariants = cva(
  'w-full',
  {
    variants: dashboardVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      layout: 'grid',
    },
  }
);

export const dashboardHeaderVariants = cva(
  '',
  {
    variants: dashboardHeaderVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const dashboardContentVariants = cva(
  '',
  {
    variants: dashboardContentVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const dashboardWidgetVariants = cva(
  '',
  {
    variants: dashboardWidgetVariantsConfig,
    defaultVariants: {
      variant: 'default',
      size: 'md',
      trend: 'neutral',
    },
  }
);
