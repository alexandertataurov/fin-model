import * as React from 'react';
import { cn } from '../../../utils/cn';
// No need for getToken here, as CVA will generate Tailwind classes directly

import {
  InputOTPProps,
  InputOTPRef,
  InputOTPContextValue,
} from './InputOTP.types';
import {
  inputOTPVariants,
  inputOTPSlotVariants,
  inputOTPSeparatorVariants,
  caretVariants,
} from './InputOTP.variants';

// Define blink animation in global CSS or a utility if not already present
// @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

const useInputOTPContext = () => {
  const context = React.useContext(InputOTPContext);
  if (!context) {
    throw new Error('InputOTP components must be used within an InputOTP');
  }
  return context;
};

const InputOTP = React.forwardRef<InputOTPRef, InputOTPProps>(
  (
    {
      value = '',
      onChange,
      length = 4,
      variant = 'outline',
      size = 'md',
      disabled = false,
      error = false,
      separator = '',
      placeholder = '○',
      autoFocus = false,
      autoComplete = 'one-time-code',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isFocused, setIsFocused] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    // Ensure value is string and has correct length
    const normalizedValue = String(value || '')
      .padEnd(length, '')
      .slice(0, length);
    const valueArray = normalizedValue.split('');

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const inputValue = e.target.value;
      let newValue = '';

      // Handle paste
      if (inputValue.length > 1) {
        newValue = inputValue.slice(0, length).replace(/[^0-9]/g, '');
      } else {
        // Handle single character
        const char = inputValue.replace(/[^0-9]/g, '');
        if (char) {
          newValue =
            normalizedValue.slice(0, activeIndex) +
            char +
            normalizedValue.slice(activeIndex + 1);
        }
      }

      if (onChange) {
        onChange(newValue);
      }

      // Move to next slot
      if (newValue.length > normalizedValue.length) {
        const nextIndex = Math.min(activeIndex + 1, length - 1);
        setActiveIndex(nextIndex);
      }
    };

    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Backspace':
          e.preventDefault();
          if (normalizedValue[activeIndex]) {
            // Clear current slot
            const newValue =
              normalizedValue.slice(0, activeIndex) +
              ' ' +
              normalizedValue.slice(activeIndex + 1);
            if (onChange) onChange(newValue.replace(/\s/g, ''));
          } else {
            // Move to previous slot
            const prevIndex = Math.max(activeIndex - 1, 0);
            setActiveIndex(prevIndex);
            const newValue =
              normalizedValue.slice(0, prevIndex) +
              ' ' +
              normalizedValue.slice(prevIndex + 1);
            if (onChange) onChange(newValue.replace(/\s/g, ''));
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setActiveIndex(Math.max(activeIndex - 1, 0));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setActiveIndex(Math.min(activeIndex + 1, length - 1));
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(length - 1);
          break;
        case 'Tab':
          // Let default behavior handle tab navigation
          break;
        default:
          // Handle number input
          if (/^[0-9]$/.test(e.key)) {
            const newValue =
              normalizedValue.slice(0, activeIndex) +
              e.key +
              normalizedValue.slice(activeIndex + 1);
            if (onChange) onChange(newValue);
            const nextIndex = Math.min(activeIndex + 1, length - 1);
            setActiveIndex(nextIndex);
          }
          break;
      }
    };

    // Handle slot click
    const handleSlotClick = (index: number) => {
      if (disabled) return;
      setActiveIndex(index);
      hiddenInputRef.current?.focus();
    };

    // Handle focus
    const handleFocus = () => {
      setIsFocused(true);
    };

    // Handle blur
    const handleBlur = () => {
      setIsFocused(false);
    };

    // Auto-focus first slot
    React.useEffect(() => {
      if (autoFocus && !disabled) {
        setActiveIndex(0);
        hiddenInputRef.current?.focus();
      }
    }, [autoFocus, disabled]);

    // Update hidden input value
    React.useEffect(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = normalizedValue;
      }
    }, [normalizedValue]);

    const contextValue: InputOTPContextValue = {
      value: normalizedValue,
      onChange,
      length,
      activeIndex,
      setActiveIndex,
      variant,
      size,
      disabled,
      error,
      separator,
      placeholder,
    };

    return (
      <InputOTPContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            inputOTPVariants({ variant, size, disabled }),
            className
          )}
          style={style}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={disabled ? -1 : 0}
          {...props}
        >
          <input
            ref={hiddenInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={autoComplete}
            value={normalizedValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 w-full h-full pointer-events-none" // Tailwind classes
          />

          {Array.from({ length }, (_, index) => (
            <React.Fragment key={index}>
              <div
                className={cn(
                  inputOTPSlotVariants({
                    variant,
                    size,
                    isActive: activeIndex === index && isFocused,
                    hasValue: !!valueArray[index],
                    isError: error,
                    isFirst: index === 0,
                    isLast: index === length - 1,
                  })
                )}
                onClick={() => handleSlotClick(index)}
                role="button"
                tabIndex={-1}
              >
                {valueArray[index] ||
                  (activeIndex === index && isFocused ? '' : placeholder)}
                {activeIndex === index && isFocused && !valueArray[index] && (
                  <div className={cn(caretVariants())} />
                )}
              </div>

              {separator && index < length - 1 && (
                <div
                  className={cn(inputOTPSeparatorVariants({ variant, size }))}
                >
                  {separator}
                </div>
              )}
            </React.Fragment>
          ))}

          {children}
        </div>
      </InputOTPContext.Provider>
    );
  }
);

InputOTP.displayName = 'InputOTP';

// Sub-components for backward compatibility
const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, children, ...props }, ref) => {
  const context = useInputOTPContext();
  return (
    <div
      ref={ref}
      className={cn(
        inputOTPVariants({ variant: context.variant, size: context.size }),
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, style, children, ...props }, ref) => {
  const context = useInputOTPContext();
  const isActive = context.activeIndex === index;
  const hasValue = !!context.value[index];

  return (
    <div
      ref={ref}
      className={cn(
        inputOTPSlotVariants({
          variant: context.variant,
          size: context.size,
          isActive: isActive,
          hasValue: hasValue,
          isError: context.error,
          isFirst: index === 0,
          isLast: index === context.length - 1,
        }),
        className
      )}
      style={style}
      onClick={() => context.setActiveIndex(index)}
      role="button"
      tabIndex={-1}
      {...props}
    >
      {children ||
        context.value[index] ||
        (isActive ? '' : context.placeholder)}
      {isActive && !context.value[index] && (
        <div className={cn(caretVariants())} />
      )}
    </div>
  );
});

InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, children, ...props }, ref) => {
  const context = useInputOTPContext();

  return (
    <div
      ref={ref}
      className={cn(
        inputOTPSeparatorVariants({
          variant: context.variant,
          size: context.size,
        }),
        className
      )}
      style={style}
      role="separator"
      {...props}
    >
      {children || context.separator}
    </div>
  );
});

InputOTPSeparator.displayName = 'InputOTPSeparator';

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  useInputOTPContext,
};
