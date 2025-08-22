import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

export type LabelRef = React.ForwardedRef<
  React.ElementRef<typeof LabelPrimitive.Root>
>;
