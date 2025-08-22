import { cva } from 'class-variance-authority';

export const dropdownMenuContentVariants = cva(
  'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
  {
    variants: {
      align: {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0',
      },
      // Animation variants based on data attributes (assuming Radix UI or similar)
      state: {
        open: 'animate-in fade-in-0 zoom-in-95',
        closed: 'animate-out fade-out-0 zoom-out-95',
      },
      side: {
        bottom: 'slide-in-from-top-2',
        left: 'slide-in-from-right-2',
        right: 'slide-in-from-left-2',
        top: 'slide-in-from-bottom-2',
      },
    },
    defaultVariants: {
      align: 'end',
    },
  }
);

export const dropdownMenuItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
  {
    variants: {
      // Assuming data-[disabled] is handled by Radix UI or similar
      // focus: 'focus:bg-accent focus:text-accent-foreground', // Handled by Tailwind's focus pseudo-class
      // disabled: 'data-[disabled]:pointer-events-none data-[disabled]:opacity-50', // Handled by Tailwind's data pseudo-class
    },
    defaultVariants: {},
  }
);
