import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { getToken } from '../tokens';

const cardVariants = cva(
  [
    // Base styles
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-md hover:shadow-lg',
        outline: 'border-border bg-transparent',
        ghost: 'border-transparent bg-transparent shadow-none',
        interactive: [
          'border-border cursor-pointer',
          'hover:shadow-md hover:border-primary/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'active:scale-[0.98]',
        ],
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

const cardHeaderVariants = cva(['flex flex-col space-y-1.5'], {
  variants: {
    padding: {
      none: '',
      sm: 'pb-3',
      md: 'pb-4',
      lg: 'pb-6',
      xl: 'pb-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

const cardTitleVariants = cva(['text-2xl font-semibold leading-none'], {
  variants: {
    size: {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

const cardDescriptionVariants = cva(['text-sm text-muted-foreground'], {
  variants: {},
  defaultVariants: {},
});

const cardContentVariants = cva(['pt-0'], {
  variants: {},
  defaultVariants: {},
});

const cardFooterVariants = cva(['flex items-center pt-0'], {
  variants: {
    padding: {
      none: '',
      sm: 'pt-3',
      md: 'pt-4',
      lg: 'pt-6',
      xl: 'pt-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      style={{
        borderWidth: getToken('borderWidth.sm'),
        transitionTimingFunction: getToken('motion.easing.inOut'),
      }}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ padding, className }))}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(cardTitleVariants({ size, className }))}
      style={{
        letterSpacing: getToken('typography.letterSpacing.tight'),
      }}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(cardDescriptionVariants({ className }))}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ className }))}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ padding, className }))}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants,
};
