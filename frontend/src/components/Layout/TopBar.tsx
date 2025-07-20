import type { ReactNode } from 'react'
import Button from '../ui/Button'
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
      <nav className={styles.actions}>
        {children}
        <Button onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
      </nav>
    </header>
  )
}

export default TopBar
