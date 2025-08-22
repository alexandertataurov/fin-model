import React from 'react';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export interface CheckboxRef extends HTMLInputElement {}
