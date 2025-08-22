import React from 'react';

export interface TabsProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  children?: React.ReactNode;
  className?: string;
}

export interface TabsListProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  activationMode: 'automatic' | 'manual';
}

export interface TabsRef extends HTMLDivElement {}
export interface TabsListRef extends HTMLDivElement {}
export interface TabsTriggerRef extends HTMLButtonElement {}
export interface TabsContentRef extends HTMLDivElement {}
