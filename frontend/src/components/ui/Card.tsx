import * as React from "react";

import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  interactive?: boolean;
  sx?: Record<string, unknown>;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, interactive, sx, ...props }, ref) => {
    return (
      <div
        ref={ref}
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
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & {
  actions?: React.ReactNode;
}>(({ className, actions, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
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
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"div"> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}>(({ className, as: Comp = 'h4', ...props }, ref) => {
  return (
    <Comp
      ref={ref}
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

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

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { sx?: Record<string, unknown> }>(({ className, sx, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      style={sx}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

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