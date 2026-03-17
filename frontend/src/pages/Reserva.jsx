import { useState } from 'react'
import { Plus, Shield, Settings } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import ProgressRing from '../components/ui/ProgressRing'
import Skeleton from '../components/ui/Skeleton'
import ReservaForm from '../components/forms/ReservaForm'
import useReserva from '../hooks/useReserva'
import { formatBRL, formatDate } from '../utils/formatters'

export default function Reserva() {
  const { historico, status, loading, saving, criarAporte, atualizarMeta } = useReserva()
  const [showForm, setShowForm] = useState(false)
  const [showMetaForm, setShowMetaForm] = useState(false)
  const [metaForm, setMetaForm] = useState({ meta: '', meses_meta: '' })

  const handleSave = async (formData) => {
    const ok = await criarAporte(formData)
    if (ok) setShowForm(false)
  }

  const openMetaForm = () => {
    setMetaForm({
      meta: status?.meta?.toString() || '12000',
      meses_meta: status?.meses_meta?.toString() || '6',
    })
    setShowMetaForm(true)
  }

  const handleMetaSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const meta = parseFloat(metaForm.meta)
    const meses = parseInt(metaForm.meses_meta)
    if (!meta || meta <= 0 || !meses || meses <= 0) return
    try {
      const ok = await atualizarMeta(meta, meses)
      if (ok) setShowMetaForm(false)
    } catch (err) {
      console.error('Erro ao atualizar meta:', err)
    }
  }

  return (
    <PageWrapper>
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-80" />
          <Skeleton variant="card" className="lg:col-span-2 h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <Card>
            <div className="flex flex-col items-center py-4">
              <div className="p-3 rounded-2xl bg-accent-purple/10 mb-4">
                <Shield size={24} className="text-accent-purple" />
              </div>
              <h3 className="text-sm font-medium text-white/50 mb-6">Reserva de Emergência</h3>
              <ProgressRing
                progress={status?.progresso_pct || 0}
                label="da meta"
                sublabel={formatBRL(status?.meta || 0)}
              />
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Saldo Atual</span>
                  <span className="font-mono font-semibold text-accent-green">{formatBRL(status?.saldo_atual)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Falta</span>
                  <span className="font-mono text-white/60">{formatBRL(status?.falta)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Aporte Mensal Necessário</span>
                  <span className="font-mono text-accent-blue">{formatBRL(status?.aporte_mensal_necessario)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total de Aportes</span>
                  <span className="font-mono text-white/60">{status?.total_aportes}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full mt-6">
                <Button icon={Plus} className="flex-1" onClick={() => setShowForm(true)}>
                  Novo Aporte
                </Button>
                <Button icon={Settings} variant="secondary" onClick={openMetaForm}>
                  Meta
                </Button>
              </div>
            </div>
          </Card>

          {/* History */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-sm font-semibold text-white/60 mb-4">Histórico de Aportes</h3>
              <div className="space-y-1">
                {historico.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0">
                    <div>
                      <p className="text-sm text-white/80">{item.descricao}</p>
                      <p className="text-xs text-white/30">{formatDate(item.data)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-sm font-medium ${item.valor >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {item.valor >= 0 ? '+' : ''}{formatBRL(item.valor)}
                      </span>
                    </div>
                  </div>
                ))}
                {!historico.items.length && (
                  <p className="text-center text-sm text-white/30 py-8">Nenhum aporte registrado</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      <ReservaForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} loading={saving} />

      <Modal isOpen={showMetaForm} onClose={() => setShowMetaForm(false)} title="Editar Meta da Reserva" size="sm">
        <form onSubmit={handleMetaSave} className="space-y-4">
          <Input
            label="Valor da Meta (R$)"
            type="number"
            step="0.01"
            value={metaForm.meta}
            onChange={(e) => setMetaForm((f) => ({ ...f, meta: e.target.value }))}
            placeholder="Ex: 15000"
          />
          <Input
            label="Meses para atingir"
            type="number"
            value={metaForm.meses_meta}
            onChange={(e) => setMetaForm((f) => ({ ...f, meses_meta: e.target.value }))}
            placeholder="Ex: 12"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowMetaForm(false)} type="button">Cancelar</Button>
            <Button className="flex-1" type="submit" loading={saving}>Salvar</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
