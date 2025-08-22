import React from 'react';
import { cn } from '../../../utils/cn';
import { TextareaProps, TextareaRef } from './Textarea.types';
import { textareaVariants } from './Textarea.variants';

// Migrated to CVA + Tailwind classes

export const Textarea = React.forwardRef<TextareaRef, TextareaProps>(
  (
    {
      error,
      helperText,
      variant = 'default',
      size = 'md',
      resize = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <textarea
          ref={ref}
          className={cn(
            textareaVariants({ error, variant, size, resize }),
            className
          )}
          aria-invalid={error}
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

Textarea.displayName = 'Textarea';
