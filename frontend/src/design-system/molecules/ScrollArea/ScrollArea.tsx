import React from 'react';
import { ScrollAreaProps, ScrollBarProps } from './ScrollArea.types'; // Import from types file
import { cn } from '../../../utils/cn'; // Assuming cn is available

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className = '',
  orientation = 'vertical',
}) => {
  return (
    <div
      className={cn(
        'relative overflow-auto',
        orientation === 'vertical'
          ? 'overflow-y-auto overflow-x-hidden'
          : 'overflow-x-auto overflow-y-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};

export const ScrollBar: React.FC<ScrollBarProps> = ({
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex touch-none select-none transition-colors duration-150 ease-out hover:bg-primary/20',
        '[&[data-orientation=vertical]]:h-full [&[data-orientation=vertical]]:w-2.5',
        '[&[data-orientation=horizontal]]:h-2.5 [&[data-orientation=horizontal]]:flex-col',
        className
      )}
      data-orientation={orientation}
    />
  );
};
