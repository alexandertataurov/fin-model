import React from 'react';

export interface AlertProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export interface AlertTitleProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface AlertDescriptionProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface AlertRef extends HTMLDivElement {}
