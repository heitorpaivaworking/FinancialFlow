import {
  BarChart as ReBarChart,
  Bar,
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

export default function BarChart({
  data,
  bars = [],
  xKey = 'mes',
  height = 300,
  stacked = false,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} barSize={16} barCategoryGap="25%">
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
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#8892B0' }}
          iconType="circle"
          iconSize={8}
        />
        {bars.map((bar, i) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            fill={bar.color || CHART_COLORS[i]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  )
}
