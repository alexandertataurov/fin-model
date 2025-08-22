import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { ButtonProps, ButtonRef } from './Button.types';
import { buttonVariants } from './Button.variants';

const Button = React.forwardRef<ButtonRef, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      elevation,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      borderWidth,
      shadow,
      borderRadius,
      spacing,
      padding,
      margin,
      motion,
      transition,
      layout,
      flexDirection,
      flexJustify,
      flexAlign,
      flexWrap,
      gridColumns,
      gridGap,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isIconOnly = size?.toString().startsWith('icon');
    const tokens = useDesignTokens();

    // When asChild is true, we need to ensure only one child is passed to the Slot
    const renderContent = () => {
      if (asChild) {
        // For asChild, we need to ensure there's exactly one child
        if (loading) {
          return (
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
        }

        if (isIconOnly) {
          return children;
        }

        // For non-icon buttons with asChild, wrap everything in a single div
        return (
          <div className="flex items-center gap-2">
            {leftIcon && leftIcon}
            {children}
            {rightIcon && rightIcon}
          </div>
        );
      }

      // For regular buttons, render normally
      return (
        <>
          {loading && (
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {!loading && leftIcon && leftIcon}
          {!loading && children}
          {!loading && rightIcon && rightIcon}
        </>
      );
    };

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            spacing,
            padding,
            margin,
            motion,
            transition,
            layout,
            flexDirection,
            flexJustify,
            flexAlign,
            flexWrap,
            gridColumns,
            gridGap,
            borderWidth,
            borderRadius,
            shadow,
            elevation,
          }),
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        style={{
          '--button-bg': tokens.getThemeColor('background'),
          '--button-color': tokens.getThemeColor('foreground'),
          '--button-border': tokens.getThemeColor('border'),
          '--button-shadow': tokens.getBoxShadow('base'),
          '--button-radius': tokens.getBorderRadius(borderRadius || 'md'),
          '--button-padding': tokens.getSpacing('4'),
          '--button-margin': tokens.getSpacing(
            ['sm', 'md', 'lg', 'xl', 'none'].includes(margin as string) ? '0' : ((margin as string || '0') as any)
          ),
          '--button-gap': tokens.getSpacing(
            ['sm', 'md', 'lg', 'xl', 'none'].includes(spacing as string) ? '2' : ((spacing as string || '2') as any)
          ),
          '--button-transition': tokens.getMotion('duration', motion || 'normal'),
        } as React.CSSProperties}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
