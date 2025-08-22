import * as React from 'react';
import { FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import * as FormPrimitive from '@radix-ui/react-form';
import { Slot } from '@radix-ui/react-slot';

// Re-export FormProvider from react-hook-form
export { FormProvider } from 'react-hook-form';

// Context types
export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  id: string;
  hasError: boolean;
  formDescriptionId: string;
  formMessageId: string;
};

export type FormItemContextValue = {
  id: string;
};

// Component Props
export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<typeof FormPrimitive.Label> {}

export interface FormControlProps
  extends React.ComponentPropsWithoutRef<typeof Slot> {}

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {}
