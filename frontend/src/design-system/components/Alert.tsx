import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const alertVariants = cva(
  [
    "relative w-full rounded-lg border px-4 py-3 text-sm grid",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr]",
    "has-[>svg]:gap-x-3 gap-y-0.5 items-start",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ],
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: [
          "text-destructive bg-card [&>svg]:text-current",
          "*:data-[slot=alert-description]:text-destructive/90",
        ],
        success: [
          "text-success bg-success/10 border-success/20 [&>svg]:text-success",
          "*:data-[slot=alert-description]:text-success/90",
        ],
        warning: [
          "text-warning bg-warning/10 border-warning/20 [&>svg]:text-warning",
          "*:data-[slot=alert-description]:text-warning/90",
        ],
        info: [
          "text-info bg-info/10 border-info/20 [&>svg]:text-info",
          "*:data-[slot=alert-description]:text-info/90",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

export type AlertTitleProps = React.HTMLAttributes<HTMLDivElement>

const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn(
          "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
          className,
        )}
        {...props}
      />
    );
  }
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement>

const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-description"
        className={cn(
          "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
          className,
        )}
        {...props}
      />
    );
  }
);

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
