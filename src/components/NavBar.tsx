import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Log', icon: '📋' },
    { to: '/analytics', label: 'Stats', icon: '📊' },
    { to: '/library', label: 'Library', icon: '⚙️' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex">
        {links.map(link => {
          const active = pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                active ? 'text-sky-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl mb-0.5">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
