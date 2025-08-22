import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { getToken } from '../../tokens';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Select } from '../../molecules/Select';
import { Checkbox } from '../../atoms/Checkbox';

import { Textarea } from '../../atoms/Textarea';
import { FormProps, FormRef, FormContextValue } from './Form.types';
import {
  formVariants,
  formSectionVariants,
  formActionsVariants,
} from './Form.variants';

const FormContext = React.createContext<FormContextValue | null>(null);

const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within a Form');
  }
  return context;
};

const StyledForm = styled.form<{
  $variant: string;
  $size: string;
  $layout: string;
}>`
  width: 100%;
  ${({ $variant, $size, $layout }) =>
    formVariants({ variant: $variant, size: $size, layout: $layout })}
`;

const StyledFormSection = styled.div<{ $variant: string; $size: string }>`
  ${({ $variant, $size }) =>
    formSectionVariants({ variant: $variant, size: $size })}
`;

const StyledFormActions = styled.div<{
  $variant: string;
  $size: string;
  $alignment: string;
}>`
  display: flex;
  align-items: center;
  gap: ${getToken('spacing.3')};
  margin-top: ${getToken('spacing.6')};

  ${({ $alignment }) => {
    switch ($alignment) {
      case 'left':
        return 'justify-content: flex-start;';
      case 'center':
        return 'justify-content: center;';
      case 'right':
        return 'justify-content: flex-end;';
      case 'space-between':
        return 'justify-content: space-between;';
      default:
        return 'justify-content: flex-end;';
    }
  }}

  ${({ $variant, $size }) =>
    formActionsVariants({ variant: $variant, size: $size })}
`;

const StyledFormError = styled.div`
  color: ${getToken('colors.destructive')};
  font-size: ${getToken('typography.fontSize.sm')};
  margin-top: ${getToken('spacing.2')};
`;

const StyledFormSuccess = styled.div`
  color: ${getToken('colors.success')};
  font-size: ${getToken('typography.fontSize.sm')};
  margin-top: ${getToken('spacing.2')};
`;

const Form = React.forwardRef<FormRef, FormProps>(
  (
    {
      fields = [],
      variant = 'default',
      size = 'md',
      layout = 'vertical',
      actions = [],
      onSubmit,
      onReset,
      loading = false,
      error,
      success,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handle field change
    const handleFieldChange = useCallback(
      (fieldName: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));

        // Clear field error when user starts typing
        if (errors[fieldName]) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      },
      [errors]
    );

    // Handle form submission
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const newErrors: Record<string, string> = {};
        fields.forEach(field => {
          if (field.required && !formData[field.name]) {
            newErrors[field.name] = `${field.label} is required`;
          }

          if (field.validation) {
            const validationResult = field.validation(
              formData[field.name],
              formData
            );
            if (validationResult) {
              newErrors[field.name] = validationResult;
            }
          }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
          onSubmit?.(formData);
        }
      },
      [fields, formData, onSubmit]
    );

    // Handle form reset
    const handleReset = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        setFormData({});
        setErrors({});
        onReset?.();
      },
      [onReset]
    );

    // Render field based on type
    const renderField = useCallback(
      (field: any) => {
        const fieldValue = formData[field.name] ?? field.defaultValue ?? '';
        const fieldError = errors[field.name];

        const commonProps = {
          value: fieldValue,
          onChange: (value: any) => handleFieldChange(field.name, value),
          error: !!fieldError,
          helperText: fieldError,
          disabled: loading || field.disabled,
          size,
          variant,
        };

        switch (field.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
          case 'tel':
          case 'url':
            return (
              <Input
                {...commonProps}
                type={field.type}
                placeholder={field.placeholder}
                label={field.label}
                required={field.required}
              />
            );

          case 'textarea':
            return (
              <Textarea
                {...commonProps}
                placeholder={field.placeholder}
                label={field.label}
                required={field.required}
                rows={field.rows}
              />
            );

          case 'select':
            return (
              <Select
                {...commonProps}
                placeholder={field.placeholder}
                label={field.label}
                required={field.required}
                options={field.options}
                multiple={field.multiple}
              />
            );

          case 'checkbox':
            return (
              <Checkbox
                {...commonProps}
                label={field.label}
                required={field.required}
              />
            );

          case 'custom':
            return field.render ? field.render(commonProps) : null;

          default:
            return null;
        }
      },
      [formData, errors, loading, size, variant, handleFieldChange]
    );

    const contextValue: FormContextValue = {
      formData,
      setFormData,
      errors,
      setErrors,
      loading,
      variant,
      size,
      onFieldChange: handleFieldChange,
    };

    return (
      <FormContext.Provider value={contextValue}>
        <StyledForm
          ref={ref}
          $variant={variant}
          $size={size}
          $layout={layout}
          onSubmit={handleSubmit}
          className={className}
          style={style}
          {...props}
        >
          {/* Form Fields */}
          <StyledFormSection $variant={variant} $size={size}>
            {fields.map((field, index) => (
              <div key={field.name || index}>{renderField(field)}</div>
            ))}
            {children}
          </StyledFormSection>

          {/* Form Messages */}
          {error && <StyledFormError>{error}</StyledFormError>}
          {success && <StyledFormSuccess>{success}</StyledFormSuccess>}

          {/* Form Actions */}
          {actions.length > 0 && (
            <StyledFormActions
              $variant={variant}
              $size={size}
              $alignment={actions[0]?.alignment || 'right'}
            >
              {actions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type || 'button'}
                  variant={action.variant || 'default'}
                  size={size}
                  disabled={loading || action.disabled}
                  onClick={action.type === 'reset' ? handleReset : undefined}
                >
                  {action.icon && <Icon name={action.icon} size="sm" />}
                  {action.label}
                </Button>
              ))}
            </StyledFormActions>
          )}
        </StyledForm>
      </FormContext.Provider>
    );
  }
);

Form.displayName = 'Form';

export { Form, useFormContext };
