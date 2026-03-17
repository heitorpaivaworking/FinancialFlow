import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, Clock, Copy } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Tooltip from '../components/ui/Tooltip'
import ProgressBar from '../components/ui/ProgressBar'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ContaFixaForm from '../components/forms/ContaFixaForm'
import useContasFixas from '../hooks/useContasFixas'
import { formatBRL } from '../utils/formatters'

export default function ContasFixas() {
  const { items, total_valor, total_pago, total_pendente, loading, saving, criar, atualizar, togglePagar, deletar } = useContasFixas()
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = async (formData) => {
    const ok = editItem ? await atualizar(editItem.id, formData) : await criar(formData)
    if (ok) { setShowForm(false); setEditItem(null) }
  }

  const pctPago = total_valor > 0 ? (total_pago / total_valor) * 100 : 0

  return (
    <PageWrapper>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card accent="#4F8EF7">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total</p>
          <p className="font-mono text-xl font-semibold">{formatBRL(total_valor)}</p>
        </Card>
        <Card accent="#10D98A">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Pago</p>
          <p className="font-mono text-xl font-semibold text-accent-green">{formatBRL(total_pago)}</p>
        </Card>
        <Card accent="#FF5757">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Pendente</p>
          <p className="font-mono text-xl font-semibold text-accent-red">{formatBRL(total_pendente)}</p>
        </Card>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/40">Progresso de pagamento</span>
          <span className="text-sm font-mono text-white/60">{pctPago.toFixed(0)}%</span>
        </div>
        <ProgressBar value={total_pago} max={total_valor} color="#10D98A" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{items.length} conta(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true) }}>Nova Conta Fixa</Button>
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="space-y-3"><Skeleton variant="card" count={5} /></div>
      ) : !items.length ? (
        <EmptyState message="Nenhuma conta fixa neste período" />
      ) : (
        <div className="space-y-2">
          {items.map((conta) => (
            <Card key={conta.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePagar(conta.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      conta.status === 'Pago'
                        ? 'bg-accent-green/15 text-accent-green'
                        : 'bg-white/5 text-white/30 hover:bg-white/10'
                    }`}
                  >
                    {conta.status === 'Pago' ? <Check size={18} /> : <Clock size={18} />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${conta.status === 'Pago' ? 'text-white/40 line-through' : 'text-white'}`}>
                      {conta.nome}
                    </p>
                    <p className="text-xs text-white/30">
                      {conta.categoria} &middot; Venc. dia {conta.dia_vencimento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={conta.status === 'Pago' ? 'success' : conta.status === 'Atrasado' ? 'danger' : 'warning'} dot size="sm">
                    {conta.status}
                  </Badge>
                  <span className="font-mono text-sm font-medium text-white/80 w-28 text-right">
                    {formatBRL(conta.valor)}
                  </span>
                  <Tooltip text="Editar">
                    <button onClick={() => { setEditItem(conta); setShowForm(true) }} className="p-1.5 rounded-lg text-white/30 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                  </Tooltip>
                  <Tooltip text="Excluir">
                    <button onClick={() => setDeleteId(conta.id)} className="p-1.5 rounded-lg text-white/30 hover:text-accent-red hover:bg-accent-red/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ContaFixaForm isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null) }} onSave={handleSave} editData={editItem} loading={saving} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await deletar(deleteId); setDeleteId(null) }} title="Excluir Conta Fixa" message="Tem certeza?" confirmLabel="Excluir" />
    </PageWrapper>
  )
}
