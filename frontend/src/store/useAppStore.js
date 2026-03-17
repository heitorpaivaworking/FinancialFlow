import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MESES } from '../utils/constants'

const now = new Date()

const useAppStore = create(
  persist(
    (set, get) => ({
      // Período selecionado
      mesSelecionado: MESES[now.getMonth()],
      anoSelecionado: now.getFullYear(),

      setMes: (mes) => set({ mesSelecionado: mes }),
      setAno: (ano) => set({ anoSelecionado: ano }),

      mesAnterior: () => {
        const { mesSelecionado, anoSelecionado } = get()
        const idx = MESES.indexOf(mesSelecionado)
        if (idx === 0) {
          set({ mesSelecionado: MESES[11], anoSelecionado: anoSelecionado - 1 })
        } else {
          set({ mesSelecionado: MESES[idx - 1] })
        }
      },

      mesSeguinte: () => {
        const { mesSelecionado, anoSelecionado } = get()
        const idx = MESES.indexOf(mesSelecionado)
        if (idx === 11) {
          set({ mesSelecionado: MESES[0], anoSelecionado: anoSelecionado + 1 })
        } else {
          set({ mesSelecionado: MESES[idx + 1] })
        }
      },

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // API status
      apiOnline: true,
      setApiOnline: (status) => set({ apiOnline: status }),
    }),
    {
      name: 'financeflow-store',
      partialize: (state) => ({
        mesSelecionado: state.mesSelecionado,
        anoSelecionado: state.anoSelecionado,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)

export default useAppStore
