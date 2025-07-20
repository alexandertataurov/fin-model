import type { ReactNode } from 'react'
import Button from '../ui/Button'

interface Props {
  children?: ReactNode
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

function TopBar({ children, theme, onToggleTheme }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-title">Fin Model</div>
      <nav className="topbar-actions">
        {children}
        <Button onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
      </nav>
    </header>
  )
}

export default TopBar
