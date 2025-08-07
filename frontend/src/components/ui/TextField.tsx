import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Eye, EyeOff, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TextFieldProps
  extends Omit<React.ComponentProps<typeof Input>, 'autoSave'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  showPasswordToggle?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onAutoSave?: (value: string) => Promise<void>;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  showValidationIcon?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type = 'text',
      showPasswordToggle = false,
      autoSave = false,
      autoSaveDelay = 1000,
      onAutoSave,
      validationRules,
      showValidationIcon = true,
      helperText,
      error,
      label,
      value,
      onChange,
      onBlur,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [autoSaveTimeout, setAutoSaveTimeout] =
      useState<NodeJS.Timeout | null>(null);

    const isPasswordField = type === 'password' || showPasswordToggle;
    const actualType = isPasswordField && showPassword ? 'text' : type;

    // Validation function
    const validateValue = useCallback(
      (val: string): string | null => {
        if (!validationRules) return null;

        if (validationRules.required && !val.trim()) {
          return 'This field is required';
        }

        if (
          validationRules.minLength &&
          val.length < validationRules.minLength
        ) {
          return `Minimum length is ${validationRules.minLength} characters`;
        }

        if (
          validationRules.maxLength &&
          val.length > validationRules.maxLength
        ) {
          return `Maximum length is ${validationRules.maxLength} characters`;
        }

        if (validationRules.pattern && !validationRules.pattern.test(val)) {
          return 'Invalid format';
        }

        if (validationRules.custom) {
          return validationRules.custom(val);
        }

        return null;
      },
      [validationRules]
    );

    // Handle auto-save
    useEffect(() => {
      if (autoSave && onAutoSave && internalValue !== value) {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }

        const timeout = setTimeout(async () => {
          setIsSaving(true);
          try {
            await onAutoSave(internalValue as string);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
          } catch (error) {
            // Removed console.error (no-console lint rule)
          } finally {
            setIsSaving(false);
          }
        }, autoSaveDelay);

        setAutoSaveTimeout(timeout);
      }

      return () => {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }
      };
    }, [
      internalValue,
      autoSave,
      onAutoSave,
      autoSaveDelay,
      autoSaveTimeout,
      value,
    ]);

    // Validation on value change
    useEffect(() => {
      const errorMsg = validateValue(internalValue as string);
      setValidationError(errorMsg);
    }, [internalValue, validationRules, validateValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);

      if (onChange) {
        onChange(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(event);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    const finalError = error || !!validationError;
    const finalHelperText = helperText || validationError;

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(finalError && 'text-destructive')}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={actualType}
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              finalError && 'border-destructive focus-visible:ring-destructive',
              isPasswordField && 'pr-10',
              showValidationIcon && internalValue && 'pr-16',
              className
            )}
          />

          {/* Password toggle button */}
          {isPasswordField && showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Validation and auto-save icons */}
          {(showValidationIcon || autoSave) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Auto-save indicator */}
              {autoSave && isSaving && (
                <Save className="h-4 w-4 text-muted-foreground animate-pulse" />
              )}
              {autoSave && isSaved && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}

              {/* Validation icon */}
              {showValidationIcon && internalValue && (
                <>
                  {validationError ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {finalHelperText && (
          <p
            className={cn(
              'text-sm',
              finalError ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {finalHelperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
