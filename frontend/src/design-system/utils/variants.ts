import { cva } from 'class-variance-authority';

// Core design system variants using CVA

export const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: [
          'border-input',
          // Autofill styling for default variant
          '[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground',
          '[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          '[&:-webkit-autofill]:border-ring [&:-webkit-autofill]:ring-2 [&:-webkit-autofill]:ring-ring [&:-webkit-autofill]:ring-offset-2',
          '[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal',
          '[&:-webkit-autofill:focus]:border-ring [&:-webkit-autofill:focus]:ring-2 [&:-webkit-autofill:focus]:ring-ring [&:-webkit-autofill:focus]:ring-offset-2',
          '[&:-webkit-autofill:hover]:border-ring',
          'dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground',
          'dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          'dark:[&:-webkit-autofill]:border-ring dark:[&:-webkit-autofill]:ring-2 dark:[&:-webkit-autofill]:ring-ring dark:[&:-webkit-autofill]:ring-offset-2',
        ],
        error: [
          'border-destructive focus-visible:ring-destructive',
          // Autofill styling for error variant
          '[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground',
          '[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          '[&:-webkit-autofill]:border-destructive [&:-webkit-autofill]:ring-destructive',
          '[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal',
          '[&:-webkit-autofill:focus]:border-destructive [&:-webkit-autofill:focus]:ring-destructive',
          '[&:-webkit-autofill:hover]:border-destructive',
          'dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground',
          'dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          'dark:[&:-webkit-autofill]:border-destructive dark:[&:-webkit-autofill]:ring-destructive',
        ],
        success: [
          'border-success focus-visible:ring-success',
          // Autofill styling for success variant
          '[&:-webkit-autofill]:bg-background [&:-webkit-autofill]:text-foreground',
          '[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          '[&:-webkit-autofill]:border-success [&:-webkit-autofill]:ring-success',
          '[&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-normal',
          '[&:-webkit-autofill:focus]:border-success [&:-webkit-autofill:focus]:ring-success',
          '[&:-webkit-autofill:hover]:border-success',
          'dark:[&:-webkit-autofill]:bg-background dark:[&:-webkit-autofill]:text-foreground',
          'dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_hsl(var(--background))_inset]',
          'dark:[&:-webkit-autofill]:border-success dark:[&:-webkit-autofill]:ring-success',
        ],
      },
      size: {
        default: 'h-9 px-3 py-1',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'shadow-lg border-border/50',
        outline: 'border-2 border-border shadow-none',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success:
          'border-transparent bg-success text-success-foreground shadow hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success:
          'border-success/50 text-success dark:text-success-foreground [&>svg]:text-success',
        warning:
          'border-warning/50 text-warning dark:text-warning-foreground [&>svg]:text-warning',
        info: 'border-info/50 text-info dark:text-info-foreground [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
