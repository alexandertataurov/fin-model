import * as React from 'react';

export type DatePickerMode = 'single' | 'multiple' | 'range';

export type DatePickerVariant = 'outline' | 'filled' | 'ghost';
export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The selected date(s) */
  value?: Date | Date[] | null;

  /** Callback when date selection changes */
  onChange?: (date: Date | Date[] | null) => void;

  /** Placeholder text for the input */
  placeholder?: string;

  /** Date format string (e.g., 'MM/dd/yyyy') */
  format?: string;

  /** Visual variant of the date picker */
  variant?: DatePickerVariant;

  /** Size of the date picker */
  size?: DatePickerSize;

  /** Whether the date picker is disabled */
  disabled?: boolean;

  /** Whether the date picker has an error state */
  error?: boolean;

  /** Helper text displayed below the input */
  helperText?: string;

  /** Minimum selectable date */
  minDate?: Date;

  /** Maximum selectable date */
  maxDate?: Date;

  /** Dates that should be disabled */
  disabledDates?: Date[];

  /** Selection mode */
  mode?: DatePickerMode;

  /** Whether to show the clear button */
  showClearButton?: boolean;

  /** Whether to show the today button */
  showTodayButton?: boolean;

  /** Whether the input is editable */
  editable?: boolean;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface DatePickerTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: DatePickerVariant;

  /** Size */
  size?: DatePickerSize;

  /** Whether disabled */
  disabled?: boolean;

  /** Whether has error */
  error?: boolean;

  /** Children */
  children: React.ReactNode;
}

export interface DatePickerContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: DatePickerVariant;

  /** Size */
  size?: DatePickerSize;

  /** Children */
  children: React.ReactNode;
}

export interface DatePickerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;

  /** Whether to show close button */
  showCloseButton?: boolean;

  /** Close button click handler */
  onClose?: () => void;

  /** Children */
  children?: React.ReactNode;
}

export interface DatePickerFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show today button */
  showTodayButton?: boolean;

  /** Whether to show clear button */
  showClearButton?: boolean;

  /** Whether to show done button */
  showDoneButton?: boolean;

  /** Today button click handler */
  onToday?: () => void;

  /** Clear button click handler */
  onClear?: () => void;

  /** Done button click handler */
  onDone?: () => void;

  /** Children */
  children?: React.ReactNode;
}

export interface DatePickerContextValue {
  /** Whether the date picker is open */
  isOpen: boolean;

  /** Function to set open state */
  setIsOpen: (open: boolean) => void;

  /** Current selected value */
  value?: Date | Date[] | null;

  /** Change handler */
  onChange?: (date: Date | Date[] | null) => void;

  /** Visual variant */
  variant: DatePickerVariant;

  /** Size */
  size: DatePickerSize;

  /** Whether disabled */
  disabled: boolean;

  /** Whether has error */
  error: boolean;
}

// Ref types
export type DatePickerRef = HTMLDivElement;
export type DatePickerTriggerRef = HTMLDivElement;
export type DatePickerContentRef = HTMLDivElement;
export type DatePickerHeaderRef = HTMLDivElement;
export type DatePickerFooterRef = HTMLDivElement;
