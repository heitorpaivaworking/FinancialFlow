import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'
import { FONTES_RECEITA, TIPOS_RECEITA, FORMAS_PAGAMENTO } from '../../utils/constants'
import { formatDateISO } from '../../utils/formatters'

const emptyForm = {
  data: '',
  fonte: '',
  tipo: '',
  descricao: '',
  valor: '',
  forma_pagamento: '',
  observacoes: '',
}

export default function ReceitaForm({ isOpen, onClose, onSave, editData, loading }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data?.split('T')[0] || '',
        fonte: editData.fonte || '',
        tipo: editData.tipo || '',
        descricao: editData.descricao || '',
        valor: editData.valor?.toString() || '',
        forma_pagamento: editData.forma_pagamento || '',
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
    if (!form.data) errs.data = 'Data é obrigatória'
    if (!form.fonte) errs.fonte = 'Fonte é obrigatória'
    if (!form.tipo) errs.tipo = 'Tipo é obrigatório'
    if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória'
    if (!form.valor || parseFloat(form.valor) <= 0) errs.valor = 'Valor deve ser positivo'
    if (!form.forma_pagamento) errs.forma_pagamento = 'Forma de pagamento é obrigatória'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      valor: parseFloat(form.valor),
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? 'Editar Receita' : 'Nova Receita'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DatePicker label="Data" value={form.data} onChange={(e) => handleChange('data', e.target.value)} error={errors.data} />
          <Select label="Tipo" options={TIPOS_RECEITA} value={form.tipo} onChange={(e) => handleChange('tipo', e.target.value)} error={errors.tipo} />
        </div>
        <Select label="Fonte" options={FONTES_RECEITA} value={form.fonte} onChange={(e) => handleChange('fonte', e.target.value)} error={errors.fonte} />
        <Input label="Descrição" value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} placeholder="Descrição da receita" error={errors.descricao} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Valor (R$)" type="number" step="0.01" min="0" value={form.valor} onChange={(e) => handleChange('valor', e.target.value)} placeholder="0,00" error={errors.valor} />
          <Select label="Forma de Pagamento" options={FORMAS_PAGAMENTO} value={form.forma_pagamento} onChange={(e) => handleChange('forma_pagamento', e.target.value)} error={errors.forma_pagamento} />
        </div>
        <Input label="Observações" value={form.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button className="flex-1" type="submit" loading={loading}>
            {editData ? 'Salvar' : 'Criar Receita'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
