import { cva } from 'class-variance-authority';

export const calendarVariants = cva(
  'flex flex-col w-full max-w-80 bg-background border border-border rounded-lg p-4 shadow-sm',
  {
    variants: {
      // Add any top-level calendar variants here if needed
    },
    defaultVariants: {},
  }
);

export const calendarHeaderVariants = cva(
  'flex items-center justify-between mb-4',
  {
    variants: {
      // Add any header variants here if needed
    },
    defaultVariants: {},
  }
);

export const calendarTitleVariants = cva(
  'bg-transparent border-none text-lg font-semibold text-foreground cursor-pointer p-2 rounded-md transition-colors duration-fast ease-in-out hover:bg-muted-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      // Add any title variants here if needed
    },
    defaultVariants: {},
  }
);

export const calendarNavVariants = cva('flex items-center gap-1', {
  variants: {
    // Add any nav variants here if needed
  },
  defaultVariants: {},
});

export const calendarGridVariants = cva('grid grid-cols-7 gap-1', {
  variants: {
    // Add any grid variants here if needed
  },
  defaultVariants: {},
});

export const calendarDayHeaderVariants = cva(
  'flex items-center justify-center h-8 text-xs font-medium text-muted-foreground uppercase tracking-wide',
  {
    variants: {
      // Add any day header variants here if needed
    },
    defaultVariants: {},
  }
);

export const calendarDayVariants = cva(
  'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-all duration-fast ease-in-out',
  {
    variants: {
      isSelected: {
        true: 'bg-primary text-primary-foreground font-semibold',
        false: '',
      },
      isToday: {
        true: 'bg-accent-50 text-accent-700 border border-accent-200',
        false: '',
      },
      isOutsideMonth: {
        true: 'opacity-50',
        false: '',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
      isInRange: {
        true: 'bg-primary-50 text-primary-700',
        false: '',
      },
      isRangeStart: {
        true: 'bg-primary text-primary-foreground font-semibold',
        false: '',
      },
      isRangeEnd: {
        true: 'bg-primary text-primary-foreground font-semibold',
        false: '',
      },
    },
    compoundVariants: [
      {
        isSelected: true,
        isToday: true,
        className: 'bg-primary text-primary-foreground font-semibold', // Selected overrides today
      },
      {
        isSelected: false,
        isToday: false,
        isDisabled: false,
        className: 'hover:bg-muted-50', // Default hover
      },
      {
        isSelected: true,
        isDisabled: false,
        className: 'hover:bg-primary-600', // Selected hover
      },
      {
        isInRange: true,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
        className: 'hover:bg-primary-100', // In range hover
      },
    ],
    defaultVariants: {
      isSelected: false,
      isToday: false,
      isOutsideMonth: false,
      isDisabled: false,
      isInRange: false,
      isRangeStart: false,
      isRangeEnd: false,
    },
  }
);
