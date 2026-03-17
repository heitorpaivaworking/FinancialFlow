import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'
import { formatDateISO } from '../../utils/formatters'

export default function ReservaForm({ isOpen, onClose, onSave, loading }) {
  const [form, setForm] = useState({ data: '', descricao: '', valor: '', observacoes: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setForm({ data: formatDateISO(new Date()), descricao: '', valor: '', observacoes: '' })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.data) errs.data = 'Obrigatório'
    if (!form.descricao.trim()) errs.descricao = 'Obrigatório'
    if (!form.valor || parseFloat(form.valor) === 0) errs.valor = 'Não pode ser zero'
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
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Aporte/Retirada" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <DatePicker label="Data" value={form.data} onChange={(e) => handleChange('data', e.target.value)} error={errors.data} />
        <Input label="Descrição" value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} placeholder="Ex: Aporte mensal" error={errors.descricao} />
        <Input label="Valor (R$)" type="number" step="0.01" value={form.valor} onChange={(e) => handleChange('valor', e.target.value)} placeholder="Positivo=aporte, Negativo=retirada" error={errors.valor} />
        <Input label="Observações" value={form.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
          <Button className="flex-1" type="submit" loading={loading}>Registrar</Button>
        </div>
      </form>
    </Modal>
  )
}
