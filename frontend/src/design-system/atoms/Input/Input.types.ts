import * as React from 'react';

export interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  helperText?: string;
}

export type InputRef = React.ForwardedRef<HTMLInputElement>;
