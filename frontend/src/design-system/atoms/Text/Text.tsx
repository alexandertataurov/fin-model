import * as React from 'react';
import { cn } from '../../../utils/cn';
import { TextProps, TextRef } from './Text.types';
import { textVariants } from './Text.variants';

const Text = React.forwardRef<TextRef, TextProps>(
  (
    {
      as: Component = 'p',
      className,
      variant,
      size,
      weight,
      color,
      align,
      truncate,
      fontFamily,
      lineHeight,
      letterSpacing,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          textVariants({
            variant,
            size,
            weight,
            color,
            align,
            truncate,
            fontFamily,
            lineHeight,
            letterSpacing,
            className,
          })
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export { Text };
