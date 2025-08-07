import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';
import { DesignSystem } from './utils/designSystem';
import { cva, type VariantProps } from 'class-variance-authority';

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-normal disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 active:scale-[0.98]',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm active:scale-[0.98]',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground hover:bg-success/90 shadow-sm active:scale-[0.98]',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm active:scale-[0.98]',
        info: 'bg-info text-info-foreground hover:bg-info/90 shadow-sm active:scale-[0.98]',
        gradient: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-sm active:scale-[0.98]',
        glass: 'bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2 text-base has-[>svg]:px-3',
        sm: 'h-8 px-3 text-sm gap-1.5 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 text-lg has-[>svg]:px-4',
        xl: 'h-12 px-8 text-lg has-[>svg]:px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const buttonClasses = cn(
      enhancedButtonVariants({ variant, size, animation, className }),
      fullWidth && 'w-full',
      loading && 'relative',
      disabled && 'opacity-50 cursor-not-allowed'
    );

    return (
      <Comp
        data-slot="button"
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        
        {!loading && (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children && <span className="flex-shrink-0">{children}</span>}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Specialized button components
export const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}> = ({ icon, label, onClick, variant = 'default', size = 'default' }) => {
  return (
    <EnhancedButton
      variant={variant}
      size={size}
      onClick={onClick}
      leftIcon={icon}
      className="group"
    >
      <span className="group-hover:translate-x-0.5 transition-transform">
        {label}
      </span>
    </EnhancedButton>
  );
};

export const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  tooltip?: string;
}> = ({ icon, onClick, variant = 'ghost', size = 'default', tooltip }) => {
  const sizeMap: Record<string, 'icon-sm' | 'icon' | 'icon-lg'> = {
    sm: 'icon-sm',
    default: 'icon',
    lg: 'icon-lg',
  };

  return (
    <EnhancedButton
      variant={variant}
      size={sizeMap[size]}
      onClick={onClick}
      title={tooltip}
      className="group"
    >
      <span className="group-hover:scale-110 transition-transform">
        {icon}
      </span>
    </EnhancedButton>
  );
};

export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}> = ({ loading, children, onClick, variant = 'default', size = 'default' }) => {
  return (
    <EnhancedButton
      variant={variant}
      size={size}
      loading={loading}
      onClick={onClick}
      disabled={loading}
    >
      {children}
    </EnhancedButton>
  );
}; 