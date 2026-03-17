import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Tooltip from '../components/ui/Tooltip'
import DespesaForm from '../components/forms/DespesaForm'
import useDespesas from '../hooks/useDespesas'
import { formatBRL, formatDate } from '../utils/formatters'

const columns = [
  { key: 'data', label: 'Data', sortable: true, render: (v) => formatDate(v) },
  { key: 'descricao', label: 'Descrição', sortable: true },
  { key: 'categoria', label: 'Categoria', render: (v) => <Badge color="purple" size="sm">{v}</Badge> },
  { key: 'tipo', label: 'Tipo', render: (v) => <Badge color={v === 'Fixa' ? 'info' : 'warning'} size="sm" dot>{v}</Badge> },
  { key: 'forma_pagamento', label: 'Pagamento' },
  { key: 'valor', label: 'Valor', align: 'right', mono: true, sortable: true, render: (v) => <span className="text-accent-red">{formatBRL(v)}</span> },
]

export default function Despesas() {
  const location = useLocation()
  const { items, total, page, pages, loading, saving, fetch, criar, atualizar, deletar } = useDespesas()
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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40">{total} registro(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true) }}>Nova Despesa</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={items} loading={loading} page={page} totalPages={pages}
          onPageChange={(p) => fetch(p)} emptyMessage="Nenhuma despesa neste período"
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

      <DespesaForm isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null) }} onSave={handleSave} editData={editItem} loading={saving} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={async () => { await deletar(deleteId); setDeleteId(null) }} title="Excluir Despesa" message="Tem certeza?" confirmLabel="Excluir" />
    </PageWrapper>
  )
}
