import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface Props {
  text: string
  children: ReactNode
}

function Tooltip({ text, children }: Props) {
  return (
    <span className={styles.wrapper}>
      {children}
      <span className={styles.tip}>{text}</span>
    </span>
  )
}

export default Tooltip
