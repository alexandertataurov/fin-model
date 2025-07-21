import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, variant = 'primary', className = '', ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      className={[
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  ),
)

export default Button
