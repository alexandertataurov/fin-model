import React from 'react';
import { cn } from '@/utils/cn';
import { DesignSystem, componentStyles } from './utils/designSystem';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled' | 'interactive';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hover?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  header,
  footer,
  hover = false,
  selected = false,
  disabled = false,
  className,
  ...props
}) => {
  // Map interactive variant to default for DesignSystem.card
  const designSystemVariant = variant === 'interactive' ? 'default' : variant;
  const baseClasses = DesignSystem.card(designSystemVariant);

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const interactiveClasses =
    hover && !disabled
      ? [
          'cursor-pointer',
          'transition-all duration-normal',
          'hover:shadow-md hover:scale-[1.02]',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ]
      : [];

  const selectedClasses = selected
    ? ['ring-2 ring-primary ring-offset-2', 'bg-primary/5']
    : [];

  const disabledClasses = disabled
    ? ['opacity-50', 'cursor-not-allowed', 'pointer-events-none']
    : [];

  const cardClasses = cn(
    baseClasses,
    paddingClasses[padding],
    interactiveClasses,
    selectedClasses,
    disabledClasses,
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {header && (
        <div className="mb-4 pb-4 border-b border-border/50">{header}</div>
      )}

      <div className="space-y-4">{children}</div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-border/50">{footer}</div>
      )}
    </div>
  );
};

// Specialized card variants
export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
}> = ({ title, value, subtitle, trend, icon, variant = 'default' }) => {
  const variantClasses = {
    default: 'border-primary/20 bg-primary/5',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    info: 'border-info/20 bg-info/5',
  };

  return (
    <EnhancedCard
      variant="outline"
      className={cn('relative overflow-hidden', variantClasses[variant])}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center text-xs">
              <span
                className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background/80">
            {icon}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'highlight';
}> = ({ title, description, icon, action, variant = 'default' }) => {
  return (
    <EnhancedCard
      variant="default"
      hover={true}
      className={cn(
        'group',
        variant === 'highlight' &&
          'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
      )}
    >
      <div className="flex items-start space-x-4">
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg',
            'bg-primary/10 text-primary',
            'group-hover:bg-primary/20 group-hover:scale-110',
            'transition-all duration-normal'
          )}
        >
          {icon}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </div>
    </EnhancedCard>
  );
};
