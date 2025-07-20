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
        ? 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'

    return (
      <button
        ref={ref}
        type="button"
        className={`rounded px-2 py-1 text-sm ${variantClass} ${className}`.trim()}
        {...rest}
      >
        {children}
      </button>
    )
  },
)

export default Button
