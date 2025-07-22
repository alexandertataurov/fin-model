import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './Card.module.css'

interface Props {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}
const Card = forwardRef<HTMLDivElement, Props>(
  ({ children, variant = 'primary', className = '' }, ref) => (
    <div
      ref={ref}
      className={[
        styles.card,
        variant === 'secondary' ? styles.secondary : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  ),
);

export default Card
