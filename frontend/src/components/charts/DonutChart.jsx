import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatBRL } from '../../utils/formatters'
import { CHART_COLORS } from '../../utils/constants'

export default function DonutChart({ data, height = 300, nameKey = 'categoria', valueKey = 'total' }) {
  const total = data.reduce((sum, d) => sum + d[valueKey], 0)

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey={valueKey}
            nameKey={nameKey}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          {/* Center label */}
          <text x="50%" y="46%" textAnchor="middle" fill="#8892B0" fontSize={12}>
            Total
          </text>
          <text x="50%" y="56%" textAnchor="middle" fill="#EEF2FF" fontSize={18} fontWeight={600} fontFamily="JetBrains Mono">
            {formatBRL(total)}
          </text>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-2 px-2">
        {data.map((item, i) => (
          <div key={item[nameKey]} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-white/60">{item[nameKey]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-white/80">{formatBRL(item[valueKey])}</span>
              <span className="font-mono text-xs text-white/30 w-10 text-right">
                {total > 0 ? `${((item[valueKey] / total) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
