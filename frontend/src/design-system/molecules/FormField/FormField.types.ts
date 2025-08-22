import * as React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export type FormFieldRef = React.ForwardedRef<HTMLDivElement>;
