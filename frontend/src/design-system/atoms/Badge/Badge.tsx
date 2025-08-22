import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { BadgeProps, BadgeRef } from './Badge.types';
import { badgeVariants } from './Badge.variants';

const Badge = React.forwardRef<BadgeRef, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      children,
      ...props
    },
    ref
  ) => {
    const tokens = useDesignTokens();

    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          '--badge-bg': tokens.getThemeColor('background'),
          '--badge-color': tokens.getThemeColor('foreground'),
          '--badge-border': tokens.getThemeColor('border'),
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
