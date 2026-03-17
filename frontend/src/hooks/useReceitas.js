import { useState, useEffect, useCallback } from 'react'
import { receitasApi } from '../api/receitas'
import useAppStore from '../store/useAppStore'

export default function useReceitas() {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [data, setData] = useState({ items: [], total: 0, page: 1, per_page: 20, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await receitasApi.listar({ mes: mesSelecionado, ano: anoSelecionado, page })
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
    try {
      await receitasApi.criar(formData)
      await fetch()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const atualizar = async (id, formData) => {
    setSaving(true)
    try {
      await receitasApi.atualizar(id, formData)
      await fetch()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const deletar = async (id) => {
    try {
      await receitasApi.deletar(id)
      await fetch()
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  return { ...data, loading, error, saving, fetch, criar, atualizar, deletar }
}
