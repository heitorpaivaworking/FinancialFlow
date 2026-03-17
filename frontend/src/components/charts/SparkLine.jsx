import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function SparkLine({ data = [], dataKey = 'value', color = '#4F8EF7', height = 32 }) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          animationDuration={400}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
