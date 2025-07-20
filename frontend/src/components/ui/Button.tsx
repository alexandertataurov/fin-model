import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

function Button({ children, className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-sm dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
