import * as React from 'react';

import { cn } from './utils';

export type CardProps = React.ComponentProps<'div'> & {
  interactive?: boolean;
  hover?: boolean;
  sx?: any;
  as?: any;
};

function Card({
  className,
  interactive: _interactive,
  hover: _hover,
  sx: _sx,
  as: _as,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
        className
      )}
      {...props}
    />
  );
}

interface CardHeaderProps extends React.ComponentProps<'div'> {
  actions?: React.ReactNode;
}

function CardHeader({ className, actions, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    >
      {actions && <div className="flex justify-end">{actions}</div>}
    </div>
  );
}

interface CardTitleProps extends React.ComponentProps<'div'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

function CardTitle({ className, as = 'h4', ...props }: CardTitleProps) {
  const Component = as as any;
  return (
    <Component
      data-slot="card-title"
      className={cn('leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6 [&:last-child]:pb-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pb-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
