import * as React from "react";

import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  interactive?: boolean;
  sx?: Record<string, unknown>;
}

function Card({ className, hover, interactive, sx, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        interactive &&
          'cursor-pointer focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]',
        className,
      )}
      style={sx}
      {...props}
    />
  );
}

function CardHeader({ className, actions, children, ...props }: React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
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
  );
}

function CardTitle({ className, as: Comp = 'h4', ...props }: React.ComponentProps<"div"> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Comp
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: Record<string, unknown> }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      style={sx}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
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

export default Card;