import React from 'react';

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface CardHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface CardTitleProps extends React.ComponentPropsWithoutRef<'h3'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface CardDescriptionProps
  extends React.ComponentPropsWithoutRef<'p'> {
  className?: string;
}

export interface CardContentProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

export interface CardFooterProps extends React.ComponentPropsWithoutRef<'div'> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface CardRef extends HTMLDivElement {}
