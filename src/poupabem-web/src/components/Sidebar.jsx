import { NavLink } from 'react-router-dom'
import { LayoutGrid, ArrowLeftRight, PiggyBank, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getInitials } from '../utils/format.js'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/cofrinhos', label: 'Cofrinhos', icon: PiggyBank }
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-[260px] bg-brand-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-7 flex items-center gap-3">
        <div className="relative">
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
            <ellipse cx="20" cy="22" rx="18" ry="14" fill="#FAFAF7" />
            <circle cx="25" cy="18" r="2" fill="#064E3B" />
            <rect x="9" y="34" width="4" height="7" rx="1.5" fill="#FAFAF7" />
            <rect x="26" y="34" width="4" height="7" rx="1.5" fill="#FAFAF7" />
            <path d="M3 20 Q0 16 4 14 L8 18 Z" fill="#FAFAF7" />
            <rect x="14" y="9" width="8" height="2" rx="1" fill="#FAFAF7" />
            <circle cx="38" cy="9" r="4" fill="#F59E0B" />
          </svg>
        </div>
        <span className="text-lg font-bold">PoupaBem</span>
      </div>

      {/* Nav */}
      <nav className="px-4 py-2 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2.5 my-1 rounded-[10px] text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-stone-300 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-brand-500 rounded-full" />
                )}
                <Icon size={18} className={isActive ? 'text-white' : 'text-muted'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-4">
        <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-brand-900 font-bold text-sm">
            {getInitials(user?.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate">{user?.fullName || 'Usuário'}</p>
            <p className="text-[11px] text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut size={16} className="text-muted" />
          </button>
        </div>
      </div>
    </aside>
  )
}
