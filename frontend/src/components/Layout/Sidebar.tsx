type View = 'dashboard' | 'model'

interface Props {
  active: View
  onSelect: (view: View) => void
}

function Sidebar({ active, onSelect }: Props) {
  const items = ['Dashboard', 'Model'] as const
  return (
    <aside className="sidebar">
      <ul>
        {items.map((item) => {
          const key = item.toLowerCase() as View
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(key)}
                className={active === key ? 'active' : ''}
              >
                {item}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
