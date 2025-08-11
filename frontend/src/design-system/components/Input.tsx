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
            // Autofill styling for better design system compliance
            '[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground',
            '[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
            '[&:-webkit-autofill]:border-ring [&:-webkit-autofill]:ring-2 [&:-webkit-autofill]:ring-ring [&:-webkit-autofill]:ring-offset-2',
            '[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal',
            // Autofill focus states
            '[&:-webkit-autofill:focus]:border-ring [&:-webkit-autofill:focus]:ring-2 [&:-webkit-autofill:focus]:ring-ring [&:-webkit-autofill:focus]:ring-offset-2',
            // Autofill hover states
            '[&:-webkit-autofill:hover]:border-ring',
            // Dark mode autofill support
            'dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground',
            'dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
            'dark:[&:-webkit-autofill]:border-ring dark:[&:-webkit-autofill]:ring-2 dark:[&:-webkit-autofill]:ring-ring dark:[&:-webkit-autofill]:ring-offset-2',
            // Error state with autofill
            error ? [
              'border-destructive focus-visible:ring-destructive',
              '[&:-webkit-autofill]:border-destructive [&:-webkit-autofill]:ring-destructive',
              '[&:-webkit-autofill:focus]:border-destructive [&:-webkit-autofill:focus]:ring-destructive'
            ] : 'border-input',
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
