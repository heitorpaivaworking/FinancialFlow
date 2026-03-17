import { formatBRL } from '../../utils/formatters'

export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-overlay/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-modal px-4 py-3">
      <p className="text-xs text-white/40 mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm mb-1 last:mb-0">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-white/60">{entry.name}:</span>
          <span className="font-mono font-medium text-white">
            {formatter ? formatter(entry.value) : formatBRL(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
