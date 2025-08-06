import * as React from 'react';

import { cn } from '@/utils/cn';

export type InputProps = React.ComponentProps<'input'> & {
  error?: boolean;
  helperText?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          data-slot="input"
          className={cn(
            'flex h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1',
            'text-base transition-colors duration-normal outline-none',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground',
            'selection:bg-primary selection:text-primary-foreground',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
            'md:text-sm',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
            className
          )}
          aria-invalid={error}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'text-sm',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
