import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'
import { TIPOS_INVESTIMENTO } from '../../utils/constants'
import { formatDateISO } from '../../utils/formatters'

const CATEGORIAS = ['Renda Fixa', 'Renda Variável']
const emptyForm = {
  data: '', tipo_investimento: '', categoria: '', ativo: '',
  valor_investido: '', valor_atual: '', quantidade: '', corretora: '', observacoes: '',
}

export default function InvestimentoForm({ isOpen, onClose, onSave, editData, loading }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data?.split('T')[0] || '',
        tipo_investimento: editData.tipo_investimento || '',
        categoria: editData.categoria || '',
        ativo: editData.ativo || '',
        valor_investido: editData.valor_investido?.toString() || '',
        valor_atual: editData.valor_atual?.toString() || '',
        quantidade: editData.quantidade?.toString() || '',
        corretora: editData.corretora || '',
        observacoes: editData.observacoes || '',
      })
    } else {
      setForm({ ...emptyForm, data: formatDateISO(new Date()) })
    }
    setErrors({})
  }, [editData, isOpen])

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.data) errs.data = 'Obrigatório'
    if (!form.tipo_investimento) errs.tipo_investimento = 'Obrigatório'
    if (!form.categoria) errs.categoria = 'Obrigatório'
    if (!form.ativo.trim()) errs.ativo = 'Obrigatório'
    if (!form.valor_investido || parseFloat(form.valor_investido) <= 0) errs.valor_investido = 'Deve ser positivo'
    if (form.valor_atual === '' || parseFloat(form.valor_atual) < 0) errs.valor_atual = 'Inválido'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      valor_investido: parseFloat(form.valor_investido),
      valor_atual: parseFloat(form.valor_atual),
      quantidade: form.quantidade ? parseFloat(form.quantidade) : null,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Editar Investimento' : 'Novo Investimento'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DatePicker label="Data" value={form.data} onChange={(e) => handleChange('data', e.target.value)} error={errors.data} />
          <Select label="Tipo" options={TIPOS_INVESTIMENTO} value={form.tipo_investimento} onChange={(e) => handleChange('tipo_investimento', e.target.value)} error={errors.tipo_investimento} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Categoria" options={CATEGORIAS} value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)} error={errors.categoria} />
          <Input label="Ativo" value={form.ativo} onChange={(e) => handleChange('ativo', e.target.value)} placeholder="Ex: PETR4" error={errors.ativo} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Valor Investido (R$)" type="number" step="0.01" value={form.valor_investido} onChange={(e) => handleChange('valor_investido', e.target.value)} error={errors.valor_investido} />
          <Input label="Valor Atual (R$)" type="number" step="0.01" value={form.valor_atual} onChange={(e) => handleChange('valor_atual', e.target.value)} error={errors.valor_atual} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Quantidade" type="number" step="0.0001" value={form.quantidade} onChange={(e) => handleChange('quantidade', e.target.value)} placeholder="Opcional" />
          <Input label="Corretora" value={form.corretora} onChange={(e) => handleChange('corretora', e.target.value)} placeholder="Opcional" />
        </div>
        <Input label="Observações" value={form.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
          <Button className="flex-1" type="submit" loading={loading}>{editData ? 'Salvar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
