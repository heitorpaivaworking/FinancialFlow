import { useState, useEffect, useCallback } from 'react'
import { reservaApi } from '../api/reserva'

export default function useReserva() {
  const [historico, setHistorico] = useState({ items: [], saldo_atual: 0 })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [hist, st] = await Promise.all([reservaApi.listar(), reservaApi.status()])
      setHistorico(hist)
      setStatus(st)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const criarAporte = async (formData) => {
    setSaving(true)
    try { await reservaApi.criar(formData); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  const atualizarMeta = async (meta, meses_meta) => {
    setSaving(true)
    try { await reservaApi.atualizarMeta({ meta, meses_meta }); await fetch(); return true }
    catch (err) { setError(err.message); return false }
    finally { setSaving(false) }
  }

  return { historico, status, loading, error, saving, fetch, criarAporte, atualizarMeta }
}
