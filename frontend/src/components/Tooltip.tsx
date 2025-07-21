import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface Props {
  text: string
  id?: string
  children: ReactNode
}

function Tooltip({ text, id, children }: Props) {
  return (
    <span className={styles.wrapper}>
      {children}
      <span id={id} role="tooltip" className={styles.tip}>
        {text}
      </span>
    </span>
  )
}

export default Tooltip
