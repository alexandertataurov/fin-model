import type { ReactNode } from 'react'
import { forwardRef } from 'react'

interface Props {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}
const Card = forwardRef<HTMLDivElement, Props>(
  ({ children, variant = 'primary', className = '' }, ref) => {
    const variantClass =
      variant === 'secondary'
        ? 'bg-gray-50 dark:bg-gray-700'
        : 'bg-white dark:bg-gray-800';
    return (
      <div
        ref={ref}
        className={`rounded border p-4 shadow dark:border-gray-600 ${variantClass} ${className}`.trim()}
      >
        {children}
      </div>
    );
  },
);

export default Card
