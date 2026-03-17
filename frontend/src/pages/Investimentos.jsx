import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Tooltip from '../components/ui/Tooltip'
import InvestimentoForm from '../components/forms/InvestimentoForm'
import useInvestimentos from '../hooks/useInvestimentos'
import { formatBRL, formatPct, formatDate } from '../utils/formatters'

const columns = [
  { key: 'data', label: 'Data', sortable: true, render: (v) => formatDate(v) },
  { key: 'ativo', label: 'Ativo', render: (v, row) => (
    <div>
      <span className="font-medium text-white">{v}</span>
      <span className="text-xs text-white/30 ml-2">{row.tipo_investimento}</span>
    </div>
  )},
  { key: 'categoria', label: 'Categoria', render: (v) => <Badge color={v === 'Renda Fixa' ? 'info' : 'warning'} size="sm">{v}</Badge> },
  { key: 'valor_investido', label: 'Investido', align: 'right', mono: true, sortable: true, render: (v) => formatBRL(v) },
  { key: 'valor_atual', label: 'Atual', align: 'right', mono: true, sortable: true, render: (v) => formatBRL(v) },
  { key: 'lucro', label: 'Lucro', align: 'right', mono: true, sortable: true, render: (v) => (
    <span className={v >= 0 ? 'text-accent-green' : 'text-accent-red'}>{formatBRL(v)}</span>
  )},
  { key: 'rentabilidade_pct', label: 'Rent.', align: 'right', mono: true, render: (v) => (
    <span className={v >= 0 ? 'text-accent-green' : 'text-accent-red'}>{formatPct(v, true)}</span>
  )},
]

export default function Investimentos() {
  const location = useLocation()
  const { items, total, page, pages, resumo, loading, saving, fetch, criar, atualizar, deletar } = useInvestimentos()
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

  return (
    <PageWrapper>
      {/* Summary */}
      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card accent="#4F8EF7">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Investido</p>
            <p className="font-mono text-xl font-semibold">{formatBRL(resumo.total_investido)}</p>
          </Card>
          <Card accent="#FFB547">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Valor Atual</p>
            <p className="font-mono text-xl font-semibold">{formatBRL(resumo.total_atual)}</p>
          </Card>
          <Card accent={resumo.lucro_total >= 0 ? '#10D98A' : '#FF5757'}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Lucro Total</p>
            <p className={`font-mono text-xl font-semibold ${resumo.lucro_total >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatBRL(resumo.lucro_total)}
            </p>
          </Card>
          <Card accent="#A78BFA">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Rentabilidade</p>
            <p className={`font-mono text-xl font-semibold ${resumo.rentabilidade_media >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatPct(resumo.rentabilidade_media, true)}
            </p>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{total} investimento(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true) }}>Novo Investimento</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={items} loading={loading} page={page} totalPages={pages}
          onPageChange={(p) => fetch(p)} emptyMessage="Nenhum investimento"
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

      <InvestimentoForm isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null) }} onSave={handleSave} editData={editItem} loading={saving} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await deletar(deleteId); setDeleteId(null) }} title="Excluir Investimento" message="Tem certeza?" confirmLabel="Excluir" />
    </PageWrapper>
  )
}
