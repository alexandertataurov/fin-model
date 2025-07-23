import React, { useState, useEffect, forwardRef } from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
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
  helpText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type = 'text',
      variant = 'outlined',
      showPasswordToggle = false,
      autoSave = false,
      autoSaveDelay = 1000,
      onAutoSave,
      validationRules,
      showValidationIcon = true,
      helpText,
      helperText,
      error,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    const isPasswordField = type === 'password' || showPasswordToggle;
    const actualType = isPasswordField && showPassword ? 'text' : type;

    // Validation function
    const validateValue = (val: string): string | null => {
      if (!validationRules) return null;

      if (validationRules.required && !val.trim()) {
        return 'This field is required';
      }

      if (validationRules.minLength && val.length < validationRules.minLength) {
        return `Minimum length is ${validationRules.minLength} characters`;
      }

      if (validationRules.maxLength && val.length > validationRules.maxLength) {
        return `Maximum length is ${validationRules.maxLength} characters`;
      }

      if (validationRules.pattern && !validationRules.pattern.test(val)) {
        return 'Invalid format';
      }

      if (validationRules.custom) {
        return validationRules.custom(val);
      }

      return null;
    };

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
            console.error('Auto-save failed:', error);
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
    }, [internalValue, autoSave, onAutoSave, autoSaveDelay]);

    // Validation on value change
    useEffect(() => {
      const errorMsg = validateValue(internalValue as string);
      setValidationError(errorMsg);
    }, [internalValue, validationRules]);

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

    const getValidationIcon = () => {
      if (!showValidationIcon || !internalValue) return null;

      if (validationError) {
        return <ErrorIcon color="error" fontSize="small" />;
      }

      return <CheckCircle color="success" fontSize="small" />;
    };

    const getAutoSaveIcon = () => {
      if (!autoSave) return null;

      if (isSaving) {
        return <SaveIcon color="action" fontSize="small" sx={{ animation: 'pulse 1s infinite' }} />;
      }

      if (isSaved) {
        return <CheckCircle color="success" fontSize="small" />;
      }

      return null;
    };

    const endAdornmentElements = [];

    // Add validation icon
    const validationIcon = getValidationIcon();
    if (validationIcon) {
      endAdornmentElements.push(validationIcon);
    }

    // Add auto-save icon
    const autoSaveIcon = getAutoSaveIcon();
    if (autoSaveIcon) {
      endAdornmentElements.push(autoSaveIcon);
    }

    // Add password toggle
    if (isPasswordField && showPasswordToggle) {
      endAdornmentElements.push(
        <IconButton
          key="password-toggle"
          onClick={togglePasswordVisibility}
          edge="end"
          size="small"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      );
    }

    const finalError = error || !!validationError;
    const finalHelperText = helperText || validationError;

    return (
      <Box>
        <MuiTextField
          {...props}
          ref={ref}
          type={actualType}
          variant={variant}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={finalError}
          helperText={finalHelperText}
          InputProps={{
            ...props.InputProps,
            endAdornment: endAdornmentElements.length > 0 ? (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {endAdornmentElements}
                </Box>
              </InputAdornment>
            ) : props.InputProps?.endAdornment,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 2,
                },
              },
            },
            ...props.sx,
          }}
        />
        
        {helpText && !finalHelperText && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {helpText}
          </Typography>
        )}
      </Box>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField; 