import * as React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean;
    interactive?: boolean;
  }
>(({ className, hover, interactive, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    role={interactive ? 'button' : undefined}
    tabIndex={interactive ? 0 : undefined}
    className={cn(
      'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
      hover &&
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
      interactive &&
        'cursor-pointer focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actions?: React.ReactNode;
  }
>(({ className, actions, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">{children}</div>
      {actions && (
        <div data-slot="card-actions" className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  </div>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }
>(({ className, as: Comp = 'h3', ...props }, ref) => (
  <Comp
    ref={ref}
    data-slot="card-title"
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

export default Card;
