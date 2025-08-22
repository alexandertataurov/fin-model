import React from 'react';
import { cn } from '../../../utils/cn'; // Assuming cn is available
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Icon } from '../../atoms'; // Import Icon atom

import {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from './Alert.types';
import {
  alertVariants,
  alertTitleVariants,
  alertDescriptionVariants,
} from './Alert.variants';

const getDefaultIcon = (variant: string) => {
  switch (variant) {
    case 'destructive':
      return XCircle;
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return null;
  }
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', icon, className, children, ...props }, ref) => {
    const DefaultIconComponent = getDefaultIcon(variant);
    const displayIcon =
      icon ||
      (DefaultIconComponent ? <Icon name={DefaultIconComponent.displayName || 'Info'} /> : null);

    return (
      <div
        ref={ref}
        className={cn(
          alertVariants({ variant, hasIcon: !!displayIcon }),
          className
        )}
        role="alert"
        {...props}
      >
        {displayIcon && <div className="col-start-1">{displayIcon}</div>}
        <div className="col-start-2">{children}</div>
      </div>
    );
  }
);

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(alertTitleVariants(), className)} {...props}>
        {children}
      </div>
    );
  }
);

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  AlertDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(alertDescriptionVariants(), className)}
      {...props}
    >
      {children}
    </div>
  );
});

Alert.displayName = 'Alert';
AlertTitle.displayName = 'AlertTitle';
AlertDescription.displayName = 'AlertDescription';
