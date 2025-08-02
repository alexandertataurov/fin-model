import * as React from 'react';

import { cn } from '@/utils/cn';

export type InputProps = React.ComponentProps<'input'> & {
  error?: boolean;
  helperText?: string;
};

function Input({
  className,
  type,
  error: _error,
  helperText: _helperText,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base transition-[border-color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring',
        'aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
