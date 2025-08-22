import { cva } from 'class-variance-authority';

export const tooltipContainerVariants = cva('relative inline-block', {
  variants: {},
  defaultVariants: {},
});

export const tooltipTriggerVariants = cva('inline-block cursor-pointer', {
  variants: {},
  defaultVariants: {},
});

export const tooltipContentVariants = cva(
  'absolute z-50 bg-background text-foreground border border-border rounded-md shadow-lg p-2.5 text-sm leading-tight max-w-80 word-wrap-break-word whitespace-nowrap pointer-events-none transition-all duration-normal ease-out',
  {
    variants: {
      open: {
        true: 'opacity-100 visible scale-100',
        false: 'opacity-0 invisible scale-95',
      },
      side: {
        top: '',
        right: '',
        bottom: '',
        left: '',
      },
      align: {
        start: '',
        center: '',
        end: '',
      },
    },
    compoundVariants: [
      // Positioning for top side
      {
        side: 'top',
        align: 'start',
        className: 'bottom-[calc(100%+4px)] left-0', // sideOffset 4px
      },
      {
        side: 'top',
        align: 'center',
        className: 'bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2',
      },
      {
        side: 'top',
        align: 'end',
        className: 'bottom-[calc(100%+4px)] right-0',
      },
      // Positioning for right side
      {
        side: 'right',
        align: 'start',
        className: 'left-[calc(100%+4px)] top-0',
      },
      {
        side: 'right',
        align: 'center',
        className: 'left-[calc(100%+4px)] top-1/2 -translate-y-1/2',
      },
      {
        side: 'right',
        align: 'end',
        className: 'left-[calc(100%+4px)] bottom-0',
      },
      // Positioning for bottom side
      {
        side: 'bottom',
        align: 'start',
        className: 'top-[calc(100%+4px)] left-0',
      },
      {
        side: 'bottom',
        align: 'center',
        className: 'top-[calc(100%+4px)] left-1/2 -translate-x-1/2',
      },
      {
        side: 'bottom',
        align: 'end',
        className: 'top-[calc(100%+4px)] right-0',
      },
      // Positioning for left side
      {
        side: 'left',
        align: 'start',
        className: 'right-[calc(100%+4px)] top-0',
      },
      {
        side: 'left',
        align: 'center',
        className: 'right-[calc(100%+4px)] top-1/2 -translate-y-1/2',
      },
      {
        side: 'left',
        align: 'end',
        className: 'right-[calc(100%+4px)] bottom-0',
      },
    ],
    defaultVariants: {
      open: false,
      side: 'top',
      align: 'center',
    },
  }
);

export const tooltipArrowVariants = cva(
  'absolute size-0 border-4 border-transparent', // size-0 for width/height 0, border-4 for border-width 4px
  {
    variants: {
      side: {
        top: 'top-full border-t-border',
        right: 'right-full border-r-border',
        bottom: 'bottom-full border-b-border',
        left: 'left-full border-l-border',
      },
    },
    compoundVariants: [
      {
        side: 'top',
        className: 'left-1/2 -translate-x-1/2',
      },
      {
        side: 'right',
        className: 'top-1/2 -translate-y-1/2',
      },
      {
        side: 'bottom',
        className: 'left-1/2 -translate-x-1/2',
      },
      {
        side: 'left',
        className: 'top-1/2 -translate-y-1/2',
      },
    ],
    defaultVariants: {
      side: 'top',
    },
  }
);

// Combined tooltipVariants export for backward compatibility
export const tooltipVariants = {
  container: tooltipContainerVariants,
  trigger: tooltipTriggerVariants,
  content: tooltipContentVariants,
  arrow: tooltipArrowVariants,
};
