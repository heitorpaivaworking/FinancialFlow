import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Tooltip from '../components/ui/Tooltip'
import ProgressBar from '../components/ui/ProgressBar'
import MEIForm from '../components/forms/MEIForm'
import useMEI from '../hooks/useMEI'
import { formatBRL, formatPct, formatDate } from '../utils/formatters'
import { LIMITE_MEI_ANUAL } from '../utils/constants'

const columns = [
  { key: 'data', label: 'Data', sortable: true, render: (v) => formatDate(v) },
  { key: 'cliente', label: 'Cliente', sortable: true },
  { key: 'servico', label: 'Serviço' },
  { key: 'valor_bruto', label: 'Bruto', align: 'right', mono: true, sortable: true, render: (v) => formatBRL(v) },
  { key: 'imposto', label: 'Imposto', align: 'right', mono: true, render: (v) => <span className="text-accent-red">{formatBRL(v)}</span> },
  { key: 'valor_liquido', label: 'Líquido', align: 'right', mono: true, render: (v) => <span className="text-accent-green">{formatBRL(v)}</span> },
  { key: 'nota_fiscal', label: 'NF', render: (v) => <Badge color={v ? 'success' : 'default'} size="sm">{v ? 'Sim' : 'Não'}</Badge> },
]

export default function MEI() {
  const location = useLocation()
  const { items, total, page, pages, resumoAnual, loading, saving, fetch, criar, atualizar, deletar } = useMEI()
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (location.state?.openNew) { setShowForm(true); window.history.replaceState({}, '') }
  }, [location.state])

  const handleSave = async (formData) => {
    const ok = editItem ? await atualizar(editItem.id, formData) : await criar(formData)
    if (ok) { setShowForm(false); setEditItem(null) }
  }

  const pctLimite = resumoAnual ? (resumoAnual.total_bruto / LIMITE_MEI_ANUAL) * 100 : 0
  const limiteColor = pctLimite > 80 ? '#FF5757' : pctLimite > 60 ? '#FFB547' : '#10D98A'

  return (
    <PageWrapper>
      {/* Annual Summary */}
      {resumoAnual && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card accent="#4F8EF7">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Faturamento Bruto</p>
              <p className="font-mono text-xl font-semibold">{formatBRL(resumoAnual.total_bruto)}</p>
            </Card>
            <Card accent="#FF5757">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Imposto Total</p>
              <p className="font-mono text-xl font-semibold text-accent-red">{formatBRL(resumoAnual.total_imposto)}</p>
            </Card>
            <Card accent="#10D98A">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Líquido Total</p>
              <p className="font-mono text-xl font-semibold text-accent-green">{formatBRL(resumoAnual.total_liquido)}</p>
            </Card>
            <Card accent="#A78BFA">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Serviços</p>
              <p className="font-mono text-xl font-semibold">{resumoAnual.qtd_servicos}</p>
            </Card>
          </div>

          {/* Annual Limit */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {pctLimite > 80 && <AlertTriangle size={16} className="text-accent-red" />}
                <span className="text-sm font-medium text-white/60">Limite MEI Anual</span>
              </div>
              <div className="text-sm font-mono">
                <span className="text-white/80">{formatBRL(resumoAnual.total_bruto)}</span>
                <span className="text-white/30"> / {formatBRL(LIMITE_MEI_ANUAL)}</span>
                <span className="ml-2" style={{ color: limiteColor }}>{pctLimite.toFixed(1)}%</span>
              </div>
            </div>
            <ProgressBar value={resumoAnual.total_bruto} max={LIMITE_MEI_ANUAL} color={limiteColor} />
          </Card>
        </>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{total} lançamento(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true) }}>Novo Lançamento</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={items} loading={loading} page={page} totalPages={pages}
          onPageChange={(p) => fetch(p)} emptyMessage="Nenhum lançamento MEI"
          actions={(row) => (
            <>
              <Tooltip text="Editar">
                <button onClick={(e) => { e.stopPropagation(); setEditItem(row); setShowForm(true) }}
                  className="p-1.5 rounded-lg text-white/30 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors">
                  <Pencil size={14} />
                </button>
              </Tooltip>
              <Tooltip text="Excluir">
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(row.id) }}
                  className="p-1.5 rounded-lg text-white/30 hover:text-accent-red hover:bg-accent-red/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </Tooltip>
            </>
          )}
        />
      </Card>

      <MEIForm isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null) }} onSave={handleSave} editData={editItem} loading={saving} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await deletar(deleteId); setDeleteId(null) }} title="Excluir Lançamento" message="Tem certeza?" confirmLabel="Excluir" />
    </PageWrapper>
  )
}
