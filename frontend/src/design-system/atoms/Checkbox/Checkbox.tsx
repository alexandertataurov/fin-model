import React, { useState, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { checkboxContainer, checkboxIcon } from './Checkbox.variants';
import { CheckboxProps } from './Checkbox.types';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      size = 'md',
      variant = 'default',
      indeterminate = false,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        const newValue = event.target.checked;
        setIsChecked(newValue);
        onCheckedChange?.(newValue);
      }
    };

    return (
      <div
        className={cn(
          checkboxContainer({
            size,
            variant,
            checked: isChecked,
            indeterminate,
          }),
          className
        )}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              const newValue = !isChecked;
              setIsChecked(newValue);
              onCheckedChange?.(newValue);
            }
          }
        }}
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return;
          const newValue = !isChecked;
          setIsChecked(newValue);
          onCheckedChange?.(newValue);
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          className="absolute opacity-0 w-0 h-0"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <div
          className={checkboxIcon({
            size,
            visible: isChecked || indeterminate,
          })}
        >
          {indeterminate ? (
            <Minus className="w-full h-full" />
          ) : (
            <Check className="w-full h-full" />
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
