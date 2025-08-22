import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { toggleVariants } from './Toggle.variants';
import { ToggleProps } from './Toggle.types';

// Migrated to CVA + Tailwind classes

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed,
      defaultPressed = false,
      disabled = false,
      size = 'md',
      variant = 'default',
      onPressedChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(pressed ?? defaultPressed);

    useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    const handleClick = () => {
      if (!disabled) {
        const newValue = !isPressed;
        setIsPressed(newValue);
        onPressedChange?.(newValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isPressed}
        disabled={disabled}
        className={cn(
          toggleVariants({ size, variant, pressed: isPressed }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
