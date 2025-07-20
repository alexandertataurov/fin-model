import { forwardRef } from 'react';
import styles from './Field.module.css';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...rest }, ref) => (
    <input ref={ref} className={`${styles.field} ${className}`.trim()} {...rest} />
  )
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...rest }, ref) => (
    <select ref={ref} className={`${styles.field} ${className}`.trim()} {...rest} />
  )
);
