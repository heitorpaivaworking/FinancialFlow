import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatBRL = (value) => {
  if (value == null) return 'R$ —'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export const formatBRLShort = (value) => {
  if (value == null) return 'R$ —'
  if (Math.abs(value) >= 1000) {
    return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`
  }
  return formatBRL(value)
}

export const formatPct = (value, showSign = false) => {
  if (value == null) return '—'
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
  return showSign && value > 0 ? `+${formatted}` : formatted
}

export const formatDate = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'dd/MM/yyyy', { locale: ptBR })

export const formatDateLong = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

export const formatDateISO = (date) =>
  format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd')

export const trendInfo = (current, previous) => {
  if (!previous || previous === 0) return { icon: '→', color: 'neutral', pct: null, label: '—' }
  const pct = (current - previous) / Math.abs(previous)
  return {
    icon: pct > 0 ? '↑' : '↓',
    color: pct > 0 ? 'positive' : 'negative',
    pct,
    label: formatPct(pct, true),
  }
}
