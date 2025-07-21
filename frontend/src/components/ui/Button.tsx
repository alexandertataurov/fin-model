import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, variant = 'primary', className = '', ...rest }, ref) => {
    const variantClass =
      variant === 'secondary'
        ? 'border border-gray-400 bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700'
        : 'border border-blue-700 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-400 dark:hover:bg-blue-600'

    return (
      <button
        ref={ref}
        type="button"
        className={`rounded px-2 py-1 text-sm font-mono ${variantClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </button>
    )
  },
)

export default Button
