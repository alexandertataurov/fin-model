import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn'; // Assuming cn is available here
import { Icon } from '../../atoms'; // Import Icon atom
import { ChevronDown } from 'lucide-react'; // Keep for Icon atom usage

import {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionContextValue,
} from './Accordion.types';

import {
  accordionContainer,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionTriggerIconVariants,
  accordionContentVariants,
} from './Accordion.variants';

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion components must be used within an Accordion component'
    );
  }
  return context;
};

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      collapsible = false,
      value: controlledValue,
      defaultValue,
      onValueChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue || (type === 'single' ? '' : [])
    );
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = useCallback(
      (newValue: string | string[]) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    const contextValue: AccordionContextValue = {
      type,
      collapsible,
      value,
      onValueChange: handleValueChange,
    };

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionContainer(), className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ value, disabled, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(accordionItemVariants(), className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, disabled, className, onClick, ...props }, ref) => {
  const { type, collapsible, value, onValueChange } = useAccordionContext();
  const itemValue = (children as React.ReactElement)?.props?.value; // Assuming value is passed as a prop to the child of AccordionTrigger

  const isOpen =
    type === 'single'
      ? value === itemValue
      : Array.isArray(value) && value.includes(itemValue);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && itemValue) {
      if (type === 'single') {
        const newValue = collapsible && value === itemValue ? '' : itemValue;
        onValueChange(newValue);
      } else {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(itemValue)
          ? currentValues.filter(v => v !== itemValue)
          : [...currentValues, itemValue];
        onValueChange(newValues);
      }
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={cn(accordionTriggerVariants({ isOpen, disabled }), className)}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <Icon
        icon={ChevronDown}
        className={cn(accordionTriggerIconVariants({ isOpen }))}
      />
    </button>
  );
});

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, ref) => {
  const { type, value } = useAccordionContext();
  const itemValue = (children as React.ReactElement)?.props?.value; // Assuming value is passed as a prop to the child of AccordionContent

  const isOpen =
    type === 'single'
      ? value === itemValue
      : Array.isArray(value) && value.includes(itemValue);

  return (
    <div
      ref={ref}
      className={cn(accordionContentVariants({ isOpen }), className)}
      aria-hidden={!isOpen}
      {...props}
    >
      {children}
    </div>
  );
});

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';
