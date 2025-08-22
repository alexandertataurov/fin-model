import * as React from 'react';
import { cn } from '../../../utils/cn';
import { SeparatorProps, SeparatorRef } from './Separator.types';
import { separatorVariants } from './Separator.variants';

const Separator = React.forwardRef<SeparatorRef, SeparatorProps>(
  ({ className, orientation, decorative, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          separatorVariants({ orientation, decorative }),
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
