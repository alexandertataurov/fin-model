import React from 'react';
import { cn } from '../../../utils/cn';
import { ProgressProps } from './Progress.types';
import { progressContainer, progressIndicator } from './Progress.variants';

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showValue = false,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(progressContainer({ size }), className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={progressIndicator({ variant })}
          style={{ width: `${percentage}%` }}
        />
        {showValue && (
          <div className="absolute inset-0 grid place-items-center text-xs font-medium text-muted-700 z-10">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
