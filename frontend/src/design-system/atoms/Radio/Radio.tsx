import React, { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { RadioProps } from './Radio.types';
import { radioContainer, radioIndicator } from './Radio.variants';

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
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
          radioContainer({ size, variant, checked: isChecked }),
          className
        )}
        role="radio"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
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
        onClick={() => {
          if (disabled) return;
          const newValue = !isChecked;
          setIsChecked(newValue);
          onCheckedChange?.(newValue);
        }}
      >
        <input
          ref={ref}
          type="radio"
          value={value}
          className="absolute opacity-0 w-0 h-0"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <div className={radioIndicator({ size, variant, visible: isChecked })}>
          <Circle className="w-full h-full" fill="currentColor" />
        </div>
      </div>
    );
  }
);

Radio.displayName = 'Radio';
