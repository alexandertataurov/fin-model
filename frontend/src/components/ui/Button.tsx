import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
// Styles are applied using Tailwind classes to ensure consistency

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}
const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, variant = 'primary', className = '', ...rest }, ref) => {
    const variantClass =
      variant === 'secondary'
        ? 'bg-transparent border border-gray-400 text-gray-800 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'

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
