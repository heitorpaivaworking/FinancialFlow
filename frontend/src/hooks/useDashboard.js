import { useState, useEffect, useCallback } from 'react'
import { dashboardApi } from '../api/dashboard'
import useAppStore from '../store/useAppStore'

export default function useDashboard() {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [kpis, setKpis] = useState(null)
  const [evolucao, setEvolucao] = useState([])
  const [categorias, setCategorias] = useState([])
  const [patrimonio, setPatrimonio] = useState([])
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kp, ev, cat, pat, tr] = await Promise.all([
        dashboardApi.kpis({ mes: mesSelecionado, ano: anoSelecionado }),
        dashboardApi.evolucaoMensal(anoSelecionado),
        dashboardApi.gastosCategorias({ mes: mesSelecionado, ano: anoSelecionado }),
        dashboardApi.patrimonio(anoSelecionado),
        dashboardApi.ultimasTransacoes(8),
      ])
      setKpis(kp)
      setEvolucao(ev)
      setCategorias(cat)
      setPatrimonio(pat)
      setTransacoes(tr)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [mesSelecionado, anoSelecionado])

  useEffect(() => { fetch() }, [fetch])

  return { kpis, evolucao, categorias, patrimonio, transacoes, loading, error, fetch }
}
