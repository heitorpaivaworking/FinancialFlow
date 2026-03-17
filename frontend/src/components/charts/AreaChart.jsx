import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatBRLShort } from '../../utils/formatters'
import { CHART_COLORS } from '../../utils/constants'

export default function AreaChart({
  data,
  areas = [],
  xKey = 'mes',
  height = 300,
  stacked = false,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data}>
        <defs>
          {areas.map((area, i) => (
            <linearGradient key={area.dataKey} id={`grad-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={area.color || CHART_COLORS[i]} stopOpacity={0.3} />
              <stop offset="100%" stopColor={area.color || CHART_COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#8892B0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8892B0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatBRLShort}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8892B0' }} iconType="circle" iconSize={8} />
        {areas.map((area, i) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name || area.dataKey}
            stroke={area.color || CHART_COLORS[i]}
            strokeWidth={2}
            fill={`url(#grad-${area.dataKey})`}
            stackId={stacked ? 'patrimonio' : undefined}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </ReAreaChart>
    </ResponsiveContainer>
  )
}
