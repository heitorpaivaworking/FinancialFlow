import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { MESES } from '../../utils/constants'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/receitas': 'Receitas',
  '/despesas': 'Despesas',
  '/contas-fixas': 'Contas Fixas',
  '/investimentos': 'Investimentos',
  '/reserva': 'Reserva de Emergência',
  '/mei': 'Controle MEI',
}

export default function Header({ onNewEntry }) {
  const location = useLocation()
  const { mesSelecionado, anoSelecionado, mesAnterior, mesSeguinte, setMes, setAno } =
    useAppStore()
  const [showNewMenu, setShowNewMenu] = useState(false)

  const title = PAGE_TITLES[location.pathname] || 'FinanceFlow'

  const newOptions = [
    { label: 'Nova Receita', type: 'receita' },
    { label: 'Nova Despesa', type: 'despesa' },
    { label: 'Novo Investimento', type: 'investimento' },
    { label: 'Lançamento MEI', type: 'mei' },
  ]

  return (
    <header className="sticky top-0 z-40 h-[60px] bg-surface/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-full px-6">
        {/* Title */}
        <h1 className="text-lg font-semibold text-white">{title}</h1>

        {/* Period Selector + New Button */}
        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-elevated rounded-lg border border-white/[0.06] p-0.5">
            <button
              onClick={mesAnterior}
              className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-3">
              <select
                value={mesSelecionado}
                onChange={(e) => setMes(e.target.value)}
                className="bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
              >
                {MESES.map((m) => (
                  <option key={m} value={m} className="bg-surface">
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={anoSelecionado}
                onChange={(e) => setAno(Number(e.target.value))}
                className="bg-transparent text-sm font-mono text-white/60 appearance-none cursor-pointer focus:outline-none"
              >
                {[2023, 2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y} className="bg-surface">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={mesSeguinte}
              className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* New Entry Button */}
          <div className="relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="flex items-center gap-2 bg-accent-blue text-white px-4 py-2 rounded-lg
                         text-sm font-medium hover:bg-accent-blue/90 transition-colors"
            >
              <Plus size={16} />
              Novo
            </button>

            {showNewMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNewMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-52 py-1.5 bg-overlay border border-white/10 rounded-xl shadow-modal animate-scale-in">
                  {newOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        setShowNewMenu(false)
                        onNewEntry?.(opt.type)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <Plus size={14} className="inline mr-2 opacity-40" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
