import type { ReactNode } from 'react'
import ThemeToggle from '../ui/ThemeToggle'
import styles from './TopBar.module.css'

interface Props {
  children?: ReactNode
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

function TopBar({ children, theme, onToggleTheme }: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.title}>Fin Model</div>
      <nav aria-label="Main" className={styles.actions}>
        {children}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </nav>
    </header>
  )
}

export default TopBar
