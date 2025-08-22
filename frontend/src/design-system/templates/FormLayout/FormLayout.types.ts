import * as React from 'react';

export type FormLayoutVariant = 'default' | 'minimal' | 'elevated';
export type FormLayoutSize = 'sm' | 'md' | 'lg';
export type FormLayoutLayout = 'centered' | 'full-width' | 'sidebar';

export interface FormLayoutAction {
  label: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  icon?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  disabled?: boolean;
  onClick?: () => void;
}

export interface FormLayoutSidebarSection {
  title?: string;
  content: React.ReactNode;
}

export interface FormLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header component */
  header?: React.ReactElement;

  /** Footer component */
  footer?: React.ReactElement;

  /** Form component */
  form?: React.ReactElement;

  /** Sidebar sections */
  sidebar?: FormLayoutSidebarSection[];

  /** Page title */
  title?: string;

  /** Breadcrumb navigation items */
  breadcrumb?: string[];

  /** Page actions */
  actions?: FormLayoutAction[];

  /** Visual variant of the layout */
  variant?: FormLayoutVariant;

  /** Size of the layout */
  size?: FormLayoutSize;

  /** Layout type */
  layout?: FormLayoutLayout;

  /** Callback when form is submitted */
  onFormSubmit?: (data: Record<string, any>) => Promise<void> | void;

  /** Callback when form is reset */
  onFormReset?: () => void;

  /** Callback when form is cancelled */
  onCancel?: () => void;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface FormLayoutContextValue {
  /** Current form data */
  formData: Record<string, any>;

  /** Function to set form data */
  setFormData: (data: Record<string, any>) => void;

  /** Current form errors */
  formErrors: Record<string, string>;

  /** Function to set form errors */
  setFormErrors: (errors: Record<string, string>) => void;

  /** Whether the form is submitting */
  isSubmitting: boolean;

  /** Visual variant */
  variant: FormLayoutVariant;

  /** Size */
  size: FormLayoutSize;

  /** Form submission handler */
  onFormSubmit: (data: Record<string, any>) => Promise<void> | void;

  /** Form reset handler */
  onFormReset: () => void;

  /** Cancel handler */
  onCancel: () => void;
}

// Ref types
export type FormLayoutRef = HTMLDivElement;
