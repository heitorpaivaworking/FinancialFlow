import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import DatePicker from '../ui/DatePicker'
import Button from '../ui/Button'
import { formatDateISO, formatBRL } from '../../utils/formatters'

export default function MEIForm({ isOpen, onClose, onSave, editData, loading }) {
  const [form, setForm] = useState({
    data: '', cliente: '', servico: '', valor_bruto: '',
    aliquota_imposto: '0.06', nota_fiscal: false, observacoes: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data?.split('T')[0] || '',
        cliente: editData.cliente || '', servico: editData.servico || '',
        valor_bruto: editData.valor_bruto?.toString() || '',
        aliquota_imposto: editData.aliquota_imposto?.toString() || '0.06',
        nota_fiscal: editData.nota_fiscal || false,
        observacoes: editData.observacoes || '',
      })
    } else {
      setForm({
        data: formatDateISO(new Date()), cliente: '', servico: '', valor_bruto: '',
        aliquota_imposto: '0.06', nota_fiscal: false, observacoes: '',
      })
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
    if (!form.cliente.trim()) errs.cliente = 'Obrigatório'
    if (!form.servico.trim()) errs.servico = 'Obrigatório'
    if (!form.valor_bruto || parseFloat(form.valor_bruto) <= 0) errs.valor_bruto = 'Deve ser positivo'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const imposto = form.valor_bruto ? parseFloat(form.valor_bruto) * parseFloat(form.aliquota_imposto || 0) : 0
  const liquido = form.valor_bruto ? parseFloat(form.valor_bruto) - imposto : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      valor_bruto: parseFloat(form.valor_bruto),
      aliquota_imposto: parseFloat(form.aliquota_imposto),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Editar Lançamento MEI' : 'Novo Lançamento MEI'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <DatePicker label="Data" value={form.data} onChange={(e) => handleChange('data', e.target.value)} error={errors.data} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cliente" value={form.cliente} onChange={(e) => handleChange('cliente', e.target.value)} error={errors.cliente} />
          <Input label="Serviço" value={form.servico} onChange={(e) => handleChange('servico', e.target.value)} error={errors.servico} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Valor Bruto (R$)" type="number" step="0.01" value={form.valor_bruto} onChange={(e) => handleChange('valor_bruto', e.target.value)} error={errors.valor_bruto} />
          <Input label="Alíquota Imposto" type="number" step="0.01" min="0" max="1" value={form.aliquota_imposto} onChange={(e) => handleChange('aliquota_imposto', e.target.value)} />
        </div>

        {/* Preview imposto */}
        {form.valor_bruto && (
          <div className="bg-elevated rounded-lg p-3 border border-white/[0.06]">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/40">Imposto (6%)</span>
              <span className="font-mono text-accent-red">{formatBRL(imposto)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Valor Líquido</span>
              <span className="font-mono text-accent-green font-semibold">{formatBRL(liquido)}</span>
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.nota_fiscal}
            onChange={(e) => handleChange('nota_fiscal', e.target.checked)}
            className="rounded border-white/20 bg-elevated text-accent-blue focus:ring-accent-blue/40"
          />
          <span className="text-sm text-white/60">Nota fiscal emitida</span>
        </label>
        <Input label="Observações" value={form.observacoes} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
          <Button className="flex-1" type="submit" loading={loading}>{editData ? 'Salvar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
