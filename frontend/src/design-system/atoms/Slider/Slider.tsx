import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../../../utils/cn';
import { SliderProps } from './Slider.types';
import {
  sliderContainer,
  sliderTrack,
  sliderRange,
  sliderThumb,
} from './Slider.variants';

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue = 50,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      size = 'md',
      variant = 'default',
      orientation = 'horizontal',
      showValue = false,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useState(value ?? defaultValue);

    useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(value);
      }
    }, [value]);

    const values = useMemo(() => {
      return Array.isArray(currentValue) ? currentValue : [currentValue];
    }, [currentValue]);

    const handleThumbChange = (index: number, newValue: number) => {
      const newValues = [...values];
      newValues[index] = Math.max(min, Math.min(max, newValue));
      const result = newValues.length === 1 ? newValues[0] : newValues;
      setCurrentValue(result);
      onValueChange?.(result);
    };

    return (
      <div
        className={cn(sliderContainer({ orientation, disabled }), className)}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={
          Array.isArray(currentValue) ? currentValue[0] : currentValue
        }
        {...props}
      >
        <div className={sliderTrack({ orientation, size })}>
          {(() => {
            const vals = Array.isArray(currentValue)
              ? currentValue
              : [currentValue];
            const start = ((vals[0] - min) / (max - min)) * 100;
            const end = ((vals[vals.length - 1] - min) / (max - min)) * 100;
            const style =
              orientation === 'horizontal'
                ? { left: `${start}%`, width: `${end - start}%` }
                : { bottom: `${start}%`, height: `${end - start}%` };
            return (
              <div
                className={sliderRange({ variant, orientation })}
                style={style}
              />
            );
          })()}
        </div>
        {values.map((val, index) => {
          const pct = ((val - min) / (max - min)) * 100;
          const style =
            orientation === 'horizontal'
              ? { left: `${pct}%`, transform: 'translateX(-50%)' }
              : { bottom: `${pct}%`, transform: 'translateY(50%)' };
          return (
            <div
              key={index}
              className={sliderThumb({ size })}
              style={style}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={e => {
                if (disabled) return;
                const change =
                  e.key === 'ArrowRight' || e.key === 'ArrowUp'
                    ? step
                    : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
                      ? -step
                      : 0;
                if (change !== 0) {
                  e.preventDefault();
                  handleThumbChange(index, val + change);
                }
              }}
            >
              {showValue && (
                <div
                  className={cn(
                    orientation === 'horizontal'
                      ? 'absolute -top-6 left-1/2 -translate-x-1/2'
                      : 'absolute left-6 top-1/2 -translate-y-1/2',
                    'text-xs font-medium text-muted-700'
                  )}
                >
                  {Math.round(val)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
