import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { LabelProps, LabelRef } from './Label.types';
import { labelVariants } from './Label.variants';

const Label = React.forwardRef<LabelRef, LabelProps>(
  (
    {
      className,
      variant,
      size,
      required,
      children,
      spacing,
      padding,
      margin,
      motion,
      transition,
      ...props
    },
    ref
  ) => {
    const tokens = useDesignTokens();

    return (
      <label
        className={cn(
          labelVariants({
            variant,
            size,
            spacing,
            padding,
            margin,
            motion,
            transition,
          }),
          className
        )}
        ref={ref}
        style={{
          '--label-color': tokens.getThemeColor('foreground'),
          '--label-color-required': tokens.getColor('destructive'),
          '--label-padding': tokens.getSpacing(padding || '0'),
          '--label-margin': tokens.getSpacing(margin || '0'),
          '--label-gap': tokens.getSpacing(spacing || '1'),
          '--label-transition': tokens.getMotion('duration', motion || 'normal'),
        } as React.CSSProperties}
        {...props}
      >
        {children}
        {required && (
          <span
            className="text-red-500 ml-1"
            style={{
              '--required-color': tokens.getColor('destructive'),
            } as React.CSSProperties}
          >
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
