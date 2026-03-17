import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  TrendingUp,
  Shield,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const navSections = [
  {
    label: 'Visão Geral',
    items: [{ to: '/', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Lançamentos',
    items: [
      { to: '/receitas', icon: ArrowDownCircle, label: 'Receitas' },
      { to: '/despesas', icon: ArrowUpCircle, label: 'Despesas' },
      { to: '/contas-fixas', icon: Calendar, label: 'Contas Fixas' },
    ],
  },
  {
    label: 'Crescimento',
    items: [
      { to: '/investimentos', icon: TrendingUp, label: 'Investimentos' },
      { to: '/reserva', icon: Shield, label: 'Reserva' },
    ],
  },
  {
    label: 'MEI',
    items: [{ to: '/mei', icon: Briefcase, label: 'Controle MEI' }],
  },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, apiOnline } = useAppStore()

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-surface border-r border-white/[0.06]
        flex flex-col z-30 transition-all duration-300 ease-out
        ${sidebarCollapsed ? 'w-16' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-white/[0.06]">
        <div className="p-1.5 rounded-lg bg-accent-blue/15">
          <TrendingUp size={20} className="text-accent-blue" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-base font-bold text-white tracking-tight">
            FinanceFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-accent-blue/15 text-accent-blue'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={18} />
                  {!sidebarCollapsed && item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline ? 'bg-accent-green animate-pulse' : 'bg-accent-red'
                }`}
              />
              <span className="text-[10px] text-white/30">
                {apiOnline ? 'API Online' : 'API Offline'}
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5
                       transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        {!sidebarCollapsed && (
          <div className="text-[10px] text-white/15 mt-1">v1.0.0</div>
        )}
      </div>
    </aside>
  )
}
