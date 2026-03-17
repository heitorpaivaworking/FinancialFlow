import { useState, useEffect, useCallback } from 'react'
import { investimentosApi } from '../api/investimentos'
import useAppStore from '../store/useAppStore'

export default function useInvestimentos() {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [data, setData] = useState({ items: [], total: 0, page: 1, per_page: 20, pages: 1 })
  const [resumo, setResumo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const [list, res] = await Promise.all([
        investimentosApi.listar({ mes: mesSelecionado, ano: anoSelecionado, page }),
        investimentosApi.resumoTotal({ ano: anoSelecionado }),
      ])
      setData(list)
      setResumo(res)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [mesSelecionado, anoSelecionado])

  useEffect(() => { fetch() }, [fetch])

  const criar = async (formData) => {
    setSaving(true)
    try { await investimentosApi.criar(formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const atualizar = async (id, formData) => {
    setSaving(true)
    try { await investimentosApi.atualizar(id, formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const deletar = async (id) => {
    try { await investimentosApi.deletar(id); await fetch(); return true }
    catch (err) { setError(err.message); return false }
  }

  return { ...data, resumo, loading, error, saving, fetch, criar, atualizar, deletar }
}
