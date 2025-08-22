import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { layoutVariants } from './Layout.variants';

export interface LayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof layoutVariants> {
  as?:
    | 'div'
    | 'main'
    | 'section'
    | 'article'
    | 'header'
    | 'footer'
    | 'aside'
    | 'nav';
}

export type LayoutRef = React.ForwardedRef<HTMLDivElement>;
