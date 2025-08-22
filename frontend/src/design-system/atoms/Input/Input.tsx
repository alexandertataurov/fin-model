import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { InputProps, InputRef } from './Input.types';
import { inputVariants } from './Input.variants';

const Input = React.forwardRef<InputRef, InputProps>(
  (
    {
      className,
      variant,
      size,
      error,
      disabled,
      borderWidth,
      borderRadius,
      shadow,
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
      <div className="relative">
        <input
          className={cn(
            inputVariants({
              variant,
              size,
              spacing,
              padding,
              margin,
              motion,
              transition,
              borderWidth,
              borderRadius,
              shadow,
            }),
            className
          )}
          ref={ref}
          disabled={disabled}
          style={{
            '--input-bg': tokens.getThemeColor('input'),
            '--input-color': tokens.getThemeColor('foreground'),
            '--input-border': tokens.getThemeColor('border'),
            '--input-border-error': tokens.getColor('destructive'),
            '--input-shadow': tokens.getBoxShadow(shadow || 'none'),
            '--input-radius': tokens.getBorderRadius(borderRadius || 'md'),
            '--input-padding': tokens.getSpacing(padding || '3'),
            '--input-margin': tokens.getSpacing(margin || '0'),
            '--input-transition': tokens.getMotion('duration', motion || 'normal'),
          } as React.CSSProperties}
          {...props}
        />
        {error && (
          <div
            className="absolute -bottom-6 left-0 text-sm text-red-500"
            style={{
              '--error-color': tokens.getColor('destructive'),
            } as React.CSSProperties}
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
