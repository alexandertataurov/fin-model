import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: Props) {
  return (
    <div className={`rounded border p-4 shadow ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card
