import * as React from 'react';

export interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  children?: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  motion?: 'none' | 'normal' | 'fast' | 'slow';
  transition?: 'none' | 'normal' | 'fast' | 'slow' | 'colors' | 'transform' | 'opacity';
}

export type IconRef = React.ForwardedRef<SVGSVGElement>;
