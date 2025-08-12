import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium",
    "w-fit whitespace-nowrap shrink-0 gap-1",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "transition-[color,box-shadow] overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-primary text-primary-foreground",
          "[a&]:hover:bg-primary/90",
        ],
        secondary: [
          "border-transparent bg-secondary text-secondary-foreground",
          "[a&]:hover:bg-secondary/90",
        ],
        destructive: [
          "border-transparent bg-destructive text-white",
          "[a&]:hover:bg-destructive/90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60",
        ],
        outline: [
          "text-foreground",
          "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ],
        success: [
          "border-transparent bg-success text-success-foreground",
          "[a&]:hover:bg-success/90",
        ],
        warning: [
          "border-transparent bg-warning text-warning-foreground",
          "[a&]:hover:bg-warning/90",
        ],
        info: [
          "border-transparent bg-info text-info-foreground",
          "[a&]:hover:bg-info/90",
        ],
        muted: [
          "border-transparent bg-muted text-muted-foreground",
          "[a&]:hover:bg-muted/90",
        ],
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs [&>svg]:size-2.5",
        md: "px-2 py-0.5 text-xs [&>svg]:size-3",
        lg: "px-2.5 py-1 text-sm [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
