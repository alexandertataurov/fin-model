import { cva } from 'class-variance-authority';

export const layoutVariants = cva(
  ['w-full'], // Base class
  {
    variants: {
      container: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
      },
      maxWidth: {
        prose: 'max-w-prose',
        content: 'max-w-[1200px]',
        wide: 'max-w-[1400px]',
        full: 'max-w-full',
      },
      centered: {
        true: 'mx-auto',
      },
      layout: {
        flex: 'flex',
        grid: 'grid',
        block: 'block',
        inline: 'inline',
        'inline-flex': 'inline-flex',
        'inline-grid': 'inline-grid',
      },
      flexDirection: {
        row: 'flex-row',
        col: 'flex-col',
        rowReverse: 'flex-row-reverse',
        colReverse: 'flex-col-reverse',
      },
      flexJustify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      flexAlign: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      flexWrap: {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        wrapReverse: 'flex-wrap-reverse',
      },
      gridColumns: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
      },
      margin: {
        none: 'm-0',
        sm: 'm-1',
        md: 'm-2',
        lg: 'm-3',
        xl: 'm-4',
      },
    },
    defaultVariants: {},
  }
);
