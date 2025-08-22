import React, { useState, useRef, useEffect } from 'react';
// Button atom is imported but not directly used in the component's structure,
// so it's not needed for the component's internal styling.
// import { Button } from '@/design-system/atoms';
import { cn } from '../../../utils/cn'; // Assuming cn is available

import {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from './DropdownMenu.types';

import {
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
} from './DropdownMenu.variants';

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  asChild,
  children,
}) => {
  return <>{children}</>;
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'end',
  className = '',
  forceMount = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  // Determine side for animation if using Radix UI data attributes
  // For now, we'll just use a placeholder 'bottom' if not explicitly set by a Radix component
  const side = 'bottom'; // Placeholder, actual value would come from Radix UI context or prop

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onClick: (e: any) => {
                e.stopPropagation();
                handleTriggerClick();
                child.props.onClick?.(e);
              },
            });
          }
          return child;
        })}
      </div>
      {(isOpen || forceMount) && (
        <div
          ref={contentRef}
          className={cn(
            dropdownMenuContentVariants({
              align,
              state: isOpen ? 'open' : 'closed',
              side,
            }),
            className
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <button
      className={cn(
        dropdownMenuItemVariants(),
        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', // Add specific Tailwind classes
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
