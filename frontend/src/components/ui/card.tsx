import * as React from 'react';

import { cn } from './utils';

export type CardProps = React.ComponentProps<'div'> & {
  interactive?: boolean;
  hover?: boolean;
  sx?: any;
  as?: any;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, hover, sx: _sx, as: _as, ...props }, ref) => {
    return (
      <div
        data-slot="card"
        className={cn(
          'bg-card text-card-foreground flex flex-col gap-6 rounded-lg border shadow-sm',
          'transition-all duration-normal',
          interactive && 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          hover && 'hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.ComponentProps<'div'> {
  actions?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => {
    return (
      <div
        data-slot="card-header"
        className={cn(
          '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {actions && (
          <div data-slot="card-actions" className="flex justify-end">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.ComponentProps<'div'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as = 'h4', ...props }, ref) => {
    const Component = as as any;
    return (
      <Component
        data-slot="card-title"
        className={cn('leading-none', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        data-slot="card-description"
        className={cn('text-muted-foreground', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        data-slot="card-action"
        className={cn(
          'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CardAction.displayName = 'CardAction';

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        data-slot="card-content"
        className={cn('px-6 [&:last-child]:pb-6', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        data-slot="card-footer"
        className={cn('flex items-center px-6 pb-6 [.border-t]:pt-6', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
