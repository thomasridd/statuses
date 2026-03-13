import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Log' },
    { to: '/badges', label: 'Badges' },
    { to: '/goals', label: 'Goals' },
    { to: '/analytics', label: 'Stats' },
    { to: '/library', label: 'Library' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex">
        {links.map(link => {
          const active = pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors ${
                active ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-500'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
