import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../atoms'; // Import Icon atom

import {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectValueProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectContextValue,
} from './Select.types';

import {
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  selectValueVariants,
  selectGroupVariants,
  selectLabelVariants,
  selectSeparatorVariants,
} from './Select.variants';

const SelectContext = createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select component');
  }
  return context;
};

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [open, setOpen] = useState(false);
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setOpen(false);
      },
      [controlledValue, onValueChange]
    );

    const contextValue: SelectContextValue = {
      value,
      onValueChange: handleValueChange,
      disabled,
      open,
      setOpen,
    };

    return (
      <SelectContext.Provider value={contextValue}>
        <div ref={ref} className={cn('relative w-full', className)} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(
  (
    { children, size = 'md', disabled, placeholder, className, ...props },
    ref
  ) => {
    const { value, open, setOpen } = useSelectContext();

    const handleClick = () => {
      if (!disabled) {
        setOpen(!open);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(selectTriggerVariants({ size, disabled }), className)}
        onClick={handleClick}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        {...props}
      >
        <span className={cn(selectValueVariants())}>
          {children || placeholder}
        </span>
        <Icon name="ChevronDown" size="sm" />
      </button>
    );
  }
);

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ children, className, ...props }, ref) => {
  const { open } = useSelectContext();

  return (
    <div
      ref={ref}
      className={cn(selectContentVariants({ open }), className)}
      role="listbox"
      {...props}
    >
      {children}
    </div>
  );
});

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, children, className, ...props }, ref) => {
    const { value: currentValue, onValueChange } = useSelectContext();
    const isSelected = currentValue === value;

    const handleClick = () => {
      if (!disabled) {
        onValueChange(value);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          selectItemVariants({ selected: isSelected, disabled }),
          className
        )}
        onClick={handleClick}
        role="option"
        aria-selected={isSelected}
        data-disabled={disabled}
        {...props}
      >
        {children}
        {isSelected && <Icon name="Check" size="sm" />}
      </div>
    );
  }
);

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children, className, ...props }, ref) => {
    const { value } = useSelectContext();

    return (
      <span
        ref={ref}
        className={cn(selectValueVariants(), className)}
        {...props}
      >
        {children || (value ? value : placeholder)}
      </span>
    );
  }
);

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(selectGroupVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(selectLabelVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  SelectSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(selectSeparatorVariants(), className)}
      {...props}
    />
  );
});

Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';
SelectValue.displayName = 'SelectValue';
SelectGroup.displayName = 'SelectGroup';
SelectLabel.displayName = 'SelectLabel';
SelectSeparator.displayName = 'SelectSeparator';
