import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useDesignTokens } from '../../../hooks/useDesignTokens';
import { IconProps, IconRef } from './Icon.types';
import { iconVariants } from './Icon.variants';
import * as LucideIcons from 'lucide-react';

const Icon = React.forwardRef<IconRef, IconProps>(
  (
    {
      className,
      name,
      size = 'md',
      color,
      children,
      spacing,
      padding,
      margin,
      motion,
      transition,
      ...props
    },
    ref
  ) => {
    const tokens = useDesignTokens();

    // Normalize name to PascalCase (e.g., 'bell' -> 'Bell', 'user-check' -> 'UserCheck')
    function toPascalCase(str: string) {
      return str
        .replace(/(^|[-_\s])(\w)/g, (_, __, c) => c ? c.toUpperCase() : '')
        .replace(/[^a-zA-Z0-9]/g, '');
    }
    const normalizedName = name ? toPascalCase(name) : '';
    let LucideIcon = null;
    if (normalizedName) {
      LucideIcon = (LucideIcons as any)[normalizedName] || (LucideIcons as any)[normalizedName + 'Icon'];
    }

    if (!LucideIcon) {
      console.warn(`Icon "${name}" (normalized: "${normalizedName}") not found in Lucide icons`);
      return null;
    }

    const sizeMap = {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
    };

    return (
      <LucideIcon
        ref={ref}
        className={cn(
          iconVariants({
            size,
            spacing,
            padding,
            margin,
            motion,
            transition,
          }),
          className
        )}
        size={sizeMap[size]}
        color={color || tokens.getColor('foreground')}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };
