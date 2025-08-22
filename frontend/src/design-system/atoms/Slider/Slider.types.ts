import React from 'react';

export interface SliderProps extends React.ComponentPropsWithoutRef<'input'> {
  value?: number | number[];
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  orientation?: 'horizontal' | 'vertical';
  showValue?: boolean;
  onValueChange?: (value: number | number[]) => void;
  className?: string;
}

export interface SliderRef extends HTMLInputElement {}
