import * as React from 'react';

export type InputOTPVariant = 'outline' | 'filled' | 'ghost';
export type InputOTPSize = 'sm' | 'md' | 'lg';

export interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The OTP value */
  value?: string;

  /** Callback when OTP value changes */
  onChange?: (value: string) => void;

  /** Number of OTP digits */
  length?: number;

  /** Visual variant of the input OTP */
  variant?: InputOTPVariant;

  /** Size of the input OTP */
  size?: InputOTPSize;

  /** Whether the input OTP is disabled */
  disabled?: boolean;

  /** Whether the input OTP has an error state */
  error?: boolean;

  /** Separator character between digits */
  separator?: string;

  /** Placeholder character for empty slots */
  placeholder?: string;

  /** Whether to auto-focus the first slot */
  autoFocus?: boolean;

  /** Auto-complete attribute for the hidden input */
  autoComplete?: string;

  /** Custom className */
  className?: string;

  /** Custom style */
  style?: React.CSSProperties;

  /** Children components */
  children?: React.ReactNode;
}

export interface InputOTPGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: InputOTPVariant;

  /** Size */
  size?: InputOTPSize;

  /** Children */
  children: React.ReactNode;
}

export interface InputOTPSlotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Index of the slot */
  index: number;

  /** Visual variant */
  variant?: InputOTPVariant;

  /** Size */
  size?: InputOTPSize;

  /** Whether the slot is active */
  isActive?: boolean;

  /** Whether the slot has a value */
  hasValue?: boolean;

  /** Whether the slot has an error */
  isError?: boolean;

  /** Children */
  children?: React.ReactNode;
}

export interface InputOTPSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: InputOTPVariant;

  /** Size */
  size?: InputOTPSize;

  /** Separator character */
  separator?: string;

  /** Children */
  children?: React.ReactNode;
}

export interface InputOTPContextValue {
  /** Current OTP value */
  value: string;

  /** Change handler */
  onChange?: (value: string) => void;

  /** Number of digits */
  length: number;

  /** Currently active slot index */
  activeIndex: number;

  /** Function to set active index */
  setActiveIndex: (index: number) => void;

  /** Visual variant */
  variant: InputOTPVariant;

  /** Size */
  size: InputOTPSize;

  /** Whether disabled */
  disabled: boolean;

  /** Whether has error */
  error: boolean;

  /** Separator character */
  separator: string;

  /** Placeholder character */
  placeholder: string;
}

// Ref types
export type InputOTPRef = HTMLDivElement;
export type InputOTPGroupRef = HTMLDivElement;
export type InputOTPSlotRef = HTMLDivElement;
export type InputOTPSeparatorRef = HTMLDivElement;
