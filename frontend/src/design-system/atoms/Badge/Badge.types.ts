import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from './Badge.variants';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export type BadgeRef = React.ForwardedRef<HTMLSpanElement>;
