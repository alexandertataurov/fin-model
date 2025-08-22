import * as React from 'react';

export type FormVariant = 'default' | 'outline' | 'filled';
export type FormSize = 'sm' | 'md' | 'lg';
export type FormLayout = 'vertical' | 'horizontal' | 'grid';

export interface FormField {
  name: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'custom';
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  validation?: (value: any, formData: Record<string, any>) => string | null;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  multiple?: boolean;
  rows?: number;
  render?: (props: any) => React.ReactNode;
}

export interface FormAction {
  type: 'submit' | 'reset' | 'button';
  label: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  icon?: string;
  disabled?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  onClick?: () => void;
}

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Form fields configuration */
  fields?: FormField[];

  /** Visual variant of the form */
  variant?: FormVariant;

  /** Size of the form */
  size?: FormSize;

  /** Layout of the form */
  layout?: FormLayout;

  /** Form actions */
  actions?: FormAction[];

  /** Callback when form is submitted */
  onSubmit?: (data: Record<string, any>) => void;

  /** Callback when form is reset */
  onReset?: () => void;

  /** Whether the form is in loading state */
  loading?: boolean;

  /** Form error message */
  error?: string;

  /** Form success message */
  success?: string;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface FormContextValue {
  /** Current form data */
  formData: Record<string, any>;

  /** Function to set form data */
  setFormData: (data: Record<string, any>) => void;

  /** Current form errors */
  errors: Record<string, string>;

  /** Function to set form errors */
  setErrors: (errors: Record<string, string>) => void;

  /** Whether the form is loading */
  loading: boolean;

  /** Visual variant */
  variant: FormVariant;

  /** Size */
  size: FormSize;

  /** Field change handler */
  onFieldChange: (fieldName: string, value: any) => void;
}

// Ref types
export type FormRef = HTMLFormElement;
