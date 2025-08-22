import React from 'react';

export interface AvatarProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<'img'> {
  src: string;
  alt: string;
  className?: string;
}

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<'div'> {
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

export interface AvatarRef extends HTMLDivElement {}
