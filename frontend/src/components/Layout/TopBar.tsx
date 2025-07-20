import type { ReactNode } from 'react'

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
        <button type="button" onClick={onToggleTheme} className="btn">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </nav>
    </header>
  )
}

export default TopBar
