import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-md font-medium',
    'transition-all duration-200 ease-in-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'active:scale-[0.98]',
    // Icon styles
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow-sm',
          'hover:bg-primary/90 hover:shadow-md',
          'focus-visible:ring-primary/20',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/90 hover:shadow-md',
          'focus-visible:ring-destructive/20',
        ],
        outline: [
          'border border-input bg-background',
          'hover:bg-accent hover:text-accent-foreground hover:shadow-sm',
          'focus-visible:ring-ring/20',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80 hover:shadow-md',
          'focus-visible:ring-secondary/20',
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-ring/20',
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline hover:text-primary/80',
          'focus-visible:ring-ring/20',
        ],
        success: [
          'bg-success text-success-foreground shadow-sm',
          'hover:bg-success/90 hover:shadow-md',
          'focus-visible:ring-success/20',
        ],
        warning: [
          'bg-warning text-warning-foreground shadow-sm',
          'hover:bg-warning/90 hover:shadow-md',
          'focus-visible:ring-warning/20',
        ],
        info: [
          'bg-info text-info-foreground shadow-sm',
          'hover:bg-info/90 hover:shadow-md',
          'focus-visible:ring-info/20',
        ],
      },
      size: {
        xs: 'h-6 px-2 text-xs gap-1 has-[>svg]:px-1.5',
        sm: 'h-8 px-3 text-sm gap-1.5 has-[>svg]:px-2.5',
        md: 'h-9 px-4 py-2 text-base gap-2 has-[>svg]:px-3',
        lg: 'h-10 px-6 text-lg gap-2 has-[>svg]:px-4',
        xl: 'h-12 px-8 text-xl gap-2 has-[>svg]:px-6',
        icon: {
          xs: 'size-6 p-0',
          sm: 'size-8 p-0',
          md: 'size-9 p-0',
          lg: 'size-10 p-0',
          xl: 'size-12 p-0',
        },
      },
      loading: {
        true: 'pointer-events-none opacity-75',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'icon',
        className: 'aspect-square',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isIconOnly = size?.toString().startsWith('icon');

    // When asChild is true, we need to ensure only one child is passed to the Slot
    const renderContent = () => {
      if (asChild) {
        // For asChild, we need to ensure there's exactly one child
        if (loading) {
          return (
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
        }

        if (isIconOnly) {
          return children;
        }

        // For non-icon buttons with asChild, wrap everything in a single div
        return (
          <div className="flex items-center gap-2">
            {leftIcon && leftIcon}
            {children}
            {rightIcon && rightIcon}
          </div>
        );
      }

      // For regular buttons, render normally
      return (
        <>
          {loading && (
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {!loading && leftIcon && !isIconOnly && leftIcon}
          {!isIconOnly && children}
          {!loading && rightIcon && !isIconOnly && rightIcon}
          {isIconOnly && children}
        </>
      );
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
