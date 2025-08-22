import React from 'react';

export interface SelectProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  position?: 'popper' | 'item';
  className?: string;
}

export interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface SelectValueProps
  extends React.ComponentPropsWithoutRef<'span'> {
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface SelectGroupProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface SelectRef extends HTMLDivElement {}
export interface SelectTriggerRef extends HTMLButtonElement {}
export interface SelectContentRef extends HTMLDivElement {}
export interface SelectItemRef extends HTMLDivElement {}
export interface SelectValueRef extends HTMLSpanElement {}
export interface SelectGroupRef extends HTMLDivElement {}
export interface SelectLabelRef extends HTMLDivElement {}
export interface SelectSeparatorRef extends HTMLDivElement {}
