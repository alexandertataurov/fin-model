import React from 'react';

export interface SwitchProps extends React.ComponentPropsWithoutRef<'button'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export interface SwitchRef extends HTMLButtonElement {}
