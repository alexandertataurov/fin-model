import React from 'react';
import { cn } from '../../../utils/cn'; // Assuming cn is available
import { ButtonGroupProps } from './ButtonGroup.types';
import { buttonGroupVariants } from './ButtonGroup.variants';

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = 'horizontal',
      size = 'md',
      variant = 'default',
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);

    const renderChildren = childrenArray.map((child, index) => {
      if (React.isValidElement(child)) {
        const isFirst = index === 0;
        const isLast = index === childrenArray.length - 1;

        let childClassName = '';
        if (orientation === 'horizontal') {
          if (isFirst) {
            childClassName = 'rounded-l-md';
          } else if (isLast) {
            childClassName = 'rounded-r-md border-r border-border';
          }
          // Remove right border for all but last in horizontal
          if (!isLast) {
            childClassName += ' border-r-0';
          }
        } else {
          // vertical
          if (isFirst) {
            childClassName = 'rounded-t-md';
          } else if (isLast) {
            childClassName = 'rounded-b-md border-b border-border';
          }
          // Remove bottom border for all but last in vertical
          if (!isLast) {
            childClassName += ' border-b-0';
          }
        }

        // Apply base reset and then specific rounded/border classes
        const finalChildClassName = cn(
          'rounded-none', // Reset default button rounded
          childClassName,
          child.props.className // Preserve existing child classes
        );

        return React.cloneElement(child, {
          className: finalChildClassName,
          disabled: disabled || child.props.disabled, // Propagate disabled state
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn(
          buttonGroupVariants({ orientation, size, variant }),
          className
        )}
        role="group"
        {...props}
      >
        {renderChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';
