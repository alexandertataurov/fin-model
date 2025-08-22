import React from 'react';

export interface RadioProps extends React.ComponentPropsWithoutRef<'input'> {
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export interface RadioRef extends HTMLInputElement {}
