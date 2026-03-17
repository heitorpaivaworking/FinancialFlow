import {
  LineChart as ReLineChart,
  Line,
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

export default function LineChart({
  data,
  lines = [],
  xKey = 'mes',
  height = 300,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data}>
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
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color || CHART_COLORS[i]}
            strokeWidth={2}
            dot={{ fill: line.color || CHART_COLORS[i], r: 3 }}
            activeDot={{ r: 5 }}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  )
}
