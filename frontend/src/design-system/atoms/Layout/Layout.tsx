import * as React from 'react';
import { cn } from '../../../utils/cn';
import { LayoutProps, LayoutRef } from './Layout.types';
import { layoutVariants } from './Layout.variants';

const Layout = React.forwardRef<LayoutRef, LayoutProps>(
  (
    {
      as: Component = 'div',
      className,
      container,
      padding,
      maxWidth,
      centered,
      layout,
      flexDirection,
      flexJustify,
      flexAlign,
      flexWrap,
      gridColumns,
      gap,
      margin,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          layoutVariants({
            container,
            padding,
            maxWidth,
            centered,
            layout,
            flexDirection,
            flexJustify,
            flexAlign,
            flexWrap,
            gridColumns,
            gap,
            margin,
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

Layout.displayName = 'Layout';

export { Layout };
