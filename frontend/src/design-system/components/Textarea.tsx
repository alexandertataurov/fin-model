import * as React from 'react';
import { cn } from '@/utils/cn';

export type TextareaProps = React.ComponentProps<'textarea'> & {
  error?: boolean;
  helperText?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            [
              "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none transition-colors duration-normal",
              // Autofill styling for better design system compliance
              "[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground",
              "[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]",
              "[&:-webkit-autofill]:border-ring [&:-webkit-autofill]:ring-2 [&:-webkit-autofill]:ring-ring [&:-webkit-autofill]:ring-offset-2",
              "[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal",
              // Autofill focus states
              "[&:-webkit-autofill:focus]:border-ring [&:-webkit-autofill:focus]:ring-2 [&:-webkit-autofill:focus]:ring-ring [&:-webkit-autofill:focus]:ring-offset-2",
              // Autofill hover states
              "[&:-webkit-autofill:hover]:border-ring",
              // Dark mode autofill support
              "dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground",
              "dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]",
              "dark:[&:-webkit-autofill]:border-ring dark:[&:-webkit-autofill]:ring-2 dark:[&:-webkit-autofill]:ring-ring dark:[&:-webkit-autofill]:ring-offset-2",
              // Error state with autofill
              error ? [
                "border-destructive focus-visible:ring-destructive",
                "[&:-webkit-autofill]:border-destructive [&:-webkit-autofill]:ring-destructive",
                "[&:-webkit-autofill:focus]:border-destructive [&:-webkit-autofill:focus]:ring-destructive"
              ] : "border-input",
            ],
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

Textarea.displayName = "Textarea";

export { Textarea };
