import * as React from 'react';
import { cn } from '../../../utils/cn';
import { Calendar } from '../Calendar';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
// Popover atom is not used in the current implementation, it's commented out.
// import { Popover } from '../../atoms/Popover';

import {
  DatePickerProps,
  DatePickerRef,
  DatePickerContextValue,
} from './DatePicker.types';
import {
  datePickerVariants,
  datePickerTriggerVariants,
  datePickerContentVariants,
  datePickerHeaderVariants,
  datePickerFooterVariants,
  datePickerInputWrapperVariants,
  calendarWrapperVariants,
  iconButtonVariants,
} from './DatePicker.variants';

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
  null
);

const useDatePickerContext = () => {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error('DatePicker components must be used within a DatePicker');
  }
  return context;
};

const DatePicker = React.forwardRef<DatePickerRef, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Select date...',
      format = 'MM/dd/yyyy',
      variant = 'outline',
      size = 'md',
      disabled = false,
      error = false,
      helperText,
      minDate,
      maxDate,
      disabledDates,
      mode = 'single',
      showClearButton = true,
      showTodayButton = true,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Format date for display
    const formatDate = React.useCallback(
      (date: Date | Date[] | null): string => {
        if (!date) return '';

        if (Array.isArray(date)) {
          if (date.length === 0) return '';
          if (date.length === 1) return formatDate(date[0]);
          return `${formatDate(date[0])} - ${formatDate(date[date.length - 1])}`;
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return format
          .replace('MM', month)
          .replace('dd', day)
          .replace('yyyy', year.toString());
      },
      [format]
    );

    // Parse date from input
    const parseDate = React.useCallback((input: string): Date | null => {
      if (!input) return null;

      // Simple parsing for MM/dd/yyyy format
      const parts = input.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1;
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          const date = new Date(year, month, day);
          if (
            date.getMonth() === month &&
            date.getDate() === day &&
            date.getFullYear() === year
          ) {
            return date;
          }
        }
      }

      return null;
    }, []);

    // Update input value when value changes
    React.useEffect(() => {
      setInputValue(formatDate(value));
    }, [value, formatDate]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const parsedDate = parseDate(newValue);
      if (parsedDate && onChange) {
        onChange(parsedDate);
      }
    };

    // Handle calendar selection
    const handleCalendarChange = (selectedDate: Date | Date[] | null) => {
      if (onChange) {
        onChange(selectedDate);
      }
      setInputValue(formatDate(selectedDate));

      // Close popover for single selection
      if (mode === 'single' && selectedDate && !Array.isArray(selectedDate)) {
        setIsOpen(false);
      }
    };

    // Handle clear
    const handleClear = () => {
      if (onChange) {
        onChange(null);
      }
      setInputValue('');
      setIsOpen(false);
    };

    // Handle today button
    const handleToday = () => {
      const today = new Date();
      if (onChange) {
        onChange(today);
      }
      setInputValue(formatDate(today));
      setIsOpen(false);
    };

    // Handle outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen]);

    const contextValue: DatePickerContextValue = {
      isOpen,
      setIsOpen,
      value,
      onChange: handleCalendarChange,
      variant,
      size,
      disabled,
      error,
    };

    return (
      <DatePickerContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            datePickerVariants({ variant, size, disabled }),
            className
          )}
          style={style}
          {...props}
        >
          <div
            ref={triggerRef}
            className={cn(
              datePickerTriggerVariants({ variant, size, disabled, error })
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <div className={cn(datePickerInputWrapperVariants())}>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                variant={variant}
                size={size}
                disabled={disabled}
                error={error}
                helperText={helperText}
                readOnly={!props.editable}
              />
            </div>
            <button
              type="button"
              className={cn(iconButtonVariants({ size }))}
              disabled={disabled}
              onClick={e => {
                e.stopPropagation();
                if (!disabled) {
                  setIsOpen(!isOpen);
                }
              }}
            >
              <Icon name="Calendar" size={size} /> {/* Simplified Icon size */}
            </button>
          </div>

          {isOpen && (
            <div
              ref={contentRef}
              className={cn(datePickerContentVariants({ variant, size }))}
            >
              <div className={cn(datePickerHeaderVariants())}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon name="X" size="sm" />
                </Button>
                <span className="text-sm font-medium">Select Date</span>
                <div className="w-8" /> {/* Hardcoded width, consider token */}
              </div>

              <div className={cn(calendarWrapperVariants())}>
                <Calendar
                  mode={mode}
                  selected={value}
                  onSelect={handleCalendarChange}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDays={disabledDates}
                // variant and size props are not directly passed to Calendar,
                // as Calendar has its own variants and sizes.
                // If Calendar needs to inherit these, they should be explicitly passed.
                />
              </div>

              <div className={cn(datePickerFooterVariants())}>
                <div className="flex gap-2">
                  {showTodayButton && (
                    <Button variant="outline" size="sm" onClick={handleToday}>
                      Today
                    </Button>
                  )}
                  {showClearButton && value && (
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  )}
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DatePickerContext.Provider>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker, useDatePickerContext };
