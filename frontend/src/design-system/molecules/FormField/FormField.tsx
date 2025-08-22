import * as React from 'react';
import { cn } from '../../../utils/cn';
// No need for getToken here, as CVA will generate Tailwind classes directly

import { FormFieldProps, FormFieldRef } from './FormField.types';
import {
  formFieldContainerVariants,
  formFieldLabelVariants,
  formFieldHelperTextVariants,
  formFieldRequiredIndicatorVariants,
} from './FormField.variants';

const FormField = React.forwardRef<FormFieldRef, FormFieldProps>(
  (
    { label, required, error, helperText, children, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(formFieldContainerVariants(), 'mb-4', className)} // Use Tailwind class for margin-bottom
        {...props}
      >
        {label && (
          <label className={cn(formFieldLabelVariants({ error }))}>
            {label}
            {required && (
              <span className={cn(formFieldRequiredIndicatorVariants())}>
                *
              </span>
            )}
          </label>
        )}
        {children}
        {helperText && (
          <p className={cn(formFieldHelperTextVariants({ error }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
