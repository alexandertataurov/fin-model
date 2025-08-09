import * as React from 'react';
import { Input, type InputProps } from './Input';

export type DatePickerProps = Omit<InputProps, 'type'>;

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => (
  <Input ref={ref} type="date" {...props} />
));

DatePicker.displayName = 'DatePicker';

export { DatePicker };
