import React from 'react';

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<'textarea'> {
  error?: boolean;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  className?: string;
}

export interface TextareaRef extends HTMLTextAreaElement {}
