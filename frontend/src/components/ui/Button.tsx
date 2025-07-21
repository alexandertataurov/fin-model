import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, variant = 'primary', className = '', ...rest }, ref) => {
    const baseClass = styles.button
    const variantClass =
      variant === 'secondary' ? styles.secondary : styles.primary

    return (
      <button
        ref={ref}
        type="button"
        className={`${baseClass} ${variantClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </button>
    )
  },
)

export default Button
