import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  [
    'flex min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none',
    'placeholder:text-muted-foreground',
    'transition-all ease-smooth duration-normal',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-16 text-xs px-2 py-2',
        md: 'min-h-20 text-sm px-3 py-2',
        lg: 'min-h-24 text-base px-4 py-3',
      },
      variant: {
        default: '',
        filled:
          'bg-muted-50 border-transparent hover:bg-muted-100 focus-visible:bg-background',
        outline: 'bg-transparent border-2',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: 'border-input',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      error: false,
      resize: 'vertical',
    },
  }
);
