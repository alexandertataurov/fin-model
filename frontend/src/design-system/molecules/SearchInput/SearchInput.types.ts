import * as React from 'react';

export interface SearchInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  className?: string;
}

export type SearchInputRef = React.ForwardedRef<HTMLInputElement>;
