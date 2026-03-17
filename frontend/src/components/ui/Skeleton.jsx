const variants = {
  line: 'h-4 w-full rounded',
  card: 'h-32 w-full rounded-lg',
  'kpi-card': 'h-28 w-full rounded-lg',
  'table-row': 'h-12 w-full rounded',
  chart: 'h-64 w-full rounded-lg',
  circle: 'h-12 w-12 rounded-full',
}

export default function Skeleton({ variant = 'line', className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            animate-pulse
            bg-gradient-to-r from-elevated via-overlay to-elevated
            bg-[length:200%_100%]
            ${variants[variant]} ${className}
          `}
          style={{
            animation: 'shimmer 1.5s infinite',
          }}
        />
      ))}
    </>
  )
}
