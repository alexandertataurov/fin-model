import { cva } from 'class-variance-authority';

export const tableVariants = cva('w-full border-collapse text-sm', {
  variants: {},
  defaultVariants: {},
});

export const tableHeaderVariants = cva('bg-muted text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export const tableBodyVariants = cva('bg-background', {
  variants: {},
  defaultVariants: {},
});

export const tableRowVariants = cva('border-b border-border', {
  variants: {},
  defaultVariants: {},
});

export const tableHeadVariants = cva('px-3 py-2 text-left font-medium', {
  variants: {},
  defaultVariants: {},
});

export const tableCellVariants = cva('px-3 py-2 text-left', {
  variants: {},
  defaultVariants: {},
});
