import { useState, useEffect, useCallback } from 'react'
import { contasFixasApi } from '../api/contasFixas'
import useAppStore from '../store/useAppStore'

export default function useContasFixas() {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [data, setData] = useState({ items: [], total: 0, total_valor: 0, total_pago: 0, total_pendente: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await contasFixasApi.listar({ mes_ref: mesSelecionado, ano_ref: anoSelecionado })
      setData(result)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [mesSelecionado, anoSelecionado])

  useEffect(() => { fetch() }, [fetch])

  const criar = async (formData) => {
    setSaving(true)
    try { await contasFixasApi.criar(formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const atualizar = async (id, formData) => {
    setSaving(true)
    try { await contasFixasApi.atualizar(id, formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const togglePagar = async (id) => {
    try { await contasFixasApi.togglePagar(id); await fetch(); return true }
    catch (err) { setError(err.message); return false }
  }

  const deletar = async (id) => {
    try { await contasFixasApi.deletar(id); await fetch(); return true }
    catch (err) { setError(err.message); return false }
  }

  const replicar = async (formData) => {
    setSaving(true)
    try { await contasFixasApi.replicar(formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  return { ...data, loading, error, saving, fetch, criar, atualizar, togglePagar, deletar, replicar }
}
