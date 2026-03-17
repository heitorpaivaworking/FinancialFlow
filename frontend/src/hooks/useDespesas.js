import { useState, useEffect, useCallback } from 'react'
import { despesasApi } from '../api/despesas'
import useAppStore from '../store/useAppStore'

export default function useDespesas() {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [data, setData] = useState({ items: [], total: 0, page: 1, per_page: 20, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await despesasApi.listar({ mes: mesSelecionado, ano: anoSelecionado, page })
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [mesSelecionado, anoSelecionado])

  useEffect(() => { fetch() }, [fetch])

  const criar = async (formData) => {
    setSaving(true)
    try { await despesasApi.criar(formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const atualizar = async (id, formData) => {
    setSaving(true)
    try { await despesasApi.atualizar(id, formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const deletar = async (id) => {
    try { await despesasApi.deletar(id); await fetch(); return true }
    catch (err) { setError(err.message); return false }
  }

  return { ...data, loading, error, saving, fetch, criar, atualizar, deletar }
}
