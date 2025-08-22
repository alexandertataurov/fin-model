import React from 'react';

export interface ProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  showValue?: boolean;
  className?: string;
}

export interface ProgressRef extends HTMLDivElement {}
