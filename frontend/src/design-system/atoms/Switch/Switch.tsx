import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { switchContainer, switchThumb } from './Switch.variants';
import { SwitchProps } from './Switch.types';

// Migrated to CVA + Tailwind classes

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      size = 'md',
      variant = 'default',
      onCheckedChange,
      className,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(checked ?? defaultChecked);

    useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleClick = () => {
      if (!disabled) {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onCheckedChange?.(newValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        className={cn(
          switchContainer({ size, variant, checked: isChecked }),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className={switchThumb({ size, checked: isChecked })} />
      </button>
    );
  }
);

Switch.displayName = 'Switch';
