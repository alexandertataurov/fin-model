import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
// No need for getToken here, as CVA will generate Tailwind classes directly

import {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsContextValue,
} from './Tabs.types';

import {
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
} from './Tabs.variants';

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      activationMode = 'automatic',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    const contextValue: TabsContextValue = {
      value,
      onValueChange: handleValueChange,
      orientation,
      activationMode,
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(tabsVariants({ orientation }), className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(tabsListVariants(), className)}
        role="tablist"
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ value, disabled, children, className, onClick, ...props }, ref) => {
  const {
    value: currentValue,
    onValueChange,
    activationMode,
  } = useTabsContext();
  const isActive = currentValue === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && activationMode === 'automatic') {
      onValueChange(value);
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={cn(tabsTriggerVariants({ isActive, disabled }), className)}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, className, ...props }, ref) => {
    const { value: currentValue } = useTabsContext();
    const isActive = currentValue === value;

    return (
      <div
        ref={ref}
        className={cn(tabsContentVariants({ isActive }), className)}
        role="tabpanel"
        aria-hidden={!isActive}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';
