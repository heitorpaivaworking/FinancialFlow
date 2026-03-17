import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { MESES } from '../../utils/constants'
import useAppStore from '../../store/useAppStore'

const CATEGORIAS = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Assinaturas', 'Educação', 'Tecnologia', 'Outros']

export default function ContaFixaForm({ isOpen, onClose, onSave, editData, loading }) {
  const { mesSelecionado, anoSelecionado } = useAppStore()
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setForm({
        nome: editData.nome || '', categoria: editData.categoria || '',
        valor: editData.valor?.toString() || '', dia_vencimento: editData.dia_vencimento?.toString() || '',
        mes_ref: editData.mes_ref || mesSelecionado, ano_ref: editData.ano_ref?.toString() || anoSelecionado.toString(),
        observacao: editData.observacao || '',
      })
    } else {
      setForm({
        nome: '', categoria: '', valor: '', dia_vencimento: '',
        mes_ref: mesSelecionado, ano_ref: anoSelecionado.toString(), observacao: '',
      })
    }
    setErrors({})
  }, [editData, isOpen, mesSelecionado, anoSelecionado])

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nome.trim()) errs.nome = 'Obrigatório'
    if (!form.categoria) errs.categoria = 'Obrigatório'
    if (!form.valor || parseFloat(form.valor) <= 0) errs.valor = 'Deve ser positivo'
    if (!form.dia_vencimento || parseInt(form.dia_vencimento) < 1 || parseInt(form.dia_vencimento) > 31) errs.dia_vencimento = '1-31'
    setErrors(errs)
    return !Object.keys(errs).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      valor: parseFloat(form.valor),
      dia_vencimento: parseInt(form.dia_vencimento),
      ano_ref: parseInt(form.ano_ref),
      status: editData?.status || 'Pendente',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Editar Conta Fixa' : 'Nova Conta Fixa'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" value={form.nome || ''} onChange={(e) => handleChange('nome', e.target.value)} placeholder="Ex: Aluguel" error={errors.nome} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Categoria" options={CATEGORIAS} value={form.categoria || ''} onChange={(e) => handleChange('categoria', e.target.value)} error={errors.categoria} />
          <Input label="Valor (R$)" type="number" step="0.01" value={form.valor || ''} onChange={(e) => handleChange('valor', e.target.value)} error={errors.valor} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Dia Vencimento" type="number" min="1" max="31" value={form.dia_vencimento || ''} onChange={(e) => handleChange('dia_vencimento', e.target.value)} error={errors.dia_vencimento} />
          <Select label="Mês Ref." options={MESES} value={form.mes_ref || ''} onChange={(e) => handleChange('mes_ref', e.target.value)} />
          <Input label="Ano Ref." type="number" value={form.ano_ref || ''} onChange={(e) => handleChange('ano_ref', e.target.value)} />
        </div>
        <Input label="Observação" value={form.observacao || ''} onChange={(e) => handleChange('observacao', e.target.value)} placeholder="Opcional" />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
          <Button className="flex-1" type="submit" loading={loading}>{editData ? 'Salvar' : 'Criar'}</Button>
        </div>
      </form>
    </Modal>
  )
}
