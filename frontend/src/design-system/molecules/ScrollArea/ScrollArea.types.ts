import React from 'react';

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export interface ScrollBarProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}
