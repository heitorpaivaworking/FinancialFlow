import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'
import { CATEGORIAS_DESPESA, FORMAS_PAGAMENTO } from '../../utils/constants'
import { formatDateISO } from '../../utils/formatters'

const TIPOS = ['Fixa', 'Variável']
const CATEGORIAS = Object.keys(CATEGORIAS_DESPESA)

const emptyForm = {
  data: '', categoria: '', subcategoria: '', descricao: '',
  tipo: '', forma_pagamento: '', valor: '', observacoes: '',
}

export default function DespesaForm({ isOpen, onClose, onSave, editData, loading }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [subcategorias, setSubcategorias] = useState([])

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data?.split('T')[0] || '',
        categoria: editData.categoria || '',
        subcategoria: editData.subcategoria || '',
        descricao: editData.descricao || '',
        tipo: editData.tipo || '',
        forma_pagamento: editData.forma_pagamento || '',
        valor: editData.valor?.toString() || '',
        observacoes: editData.observacoes || '',
      })
      if (editData.categoria && CATEGORIAS_DESPESA[editData.categoria]) {
        setSubcategorias(CATEGORIAS_DESPESA[editData.categoria].subs)
      }
    } else {
      setForm({ ...emptyForm, data: formatDateISO(new Date()) })
      setSubcategorias([])
    }
    setErrors({})
  }, [editData, isOpen])

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    if (field === 'categoria') {
      setSubcategorias(CATEGORIAS_DESPESA[value]?.subs || [])
      setForm((f) => ({ ...f, categoria: value, subcategoria: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.data) errs.data = 'Data é obrigatória'
    if (!form.categoria) errs.categoria = 'Categoria é obrigatória'
    if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória'
    if (!form.tipo) errs.tipo = 'Tipo é obrigatório'
    if (!form.forma_pagamento) errs.forma_pagamento = 'Obrigatório'
    if (!form.valor || parseFloat(form.valor) <= 0) errs.valor = 'Valor deve ser positivo'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form, valor: parseFloat(form.valor) })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Editar Despesa' : 'Nova Despesa'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DatePicker label="Data" value={form.data} onChange={(e) => handleChange('data', e.target.value)} error={errors.data} />
          <Select label="Tipo" options={TIPOS} value={form.tipo} onChange={(e) => handleChange('tipo', e.target.value)} error={errors.tipo} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Categoria" options={CATEGORIAS} value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)} error={errors.categoria} />
          <Select label="Subcategoria" options={subcategorias} value={form.subcategoria} onChange={(e) => handleChange('subcategoria', e.target.value)} placeholder="Opcional" />
        </div>
        <Input label="Descrição" value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} error={errors.descricao} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Valor (R$)" type="number" step="0.01" min="0" value={form.valor} onChange={(e) => handleChange('valor', e.target.value)} error={errors.valor} />
          <Select label="Pagamento" options={FORMAS_PAGAMENTO} value={form.forma_pagamento} onChange={(e) => handleChange('forma_pagamento', e.target.value)} error={errors.forma_pagamento} />
        </div>
        <Input label="Observações" value={form.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
          <Button className="flex-1" type="submit" loading={loading}>{editData ? 'Salvar' : 'Criar Despesa'}</Button>
        </div>
      </form>
    </Modal>
  )
}
