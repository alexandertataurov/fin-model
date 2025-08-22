import React from 'react';

export interface ToggleProps extends React.ComponentPropsWithoutRef<'button'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'destructive';
  onPressedChange?: (pressed: boolean) => void;
  className?: string;
}

export interface ToggleRef extends HTMLButtonElement {}
