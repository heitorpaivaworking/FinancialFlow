export default function ProgressBar({ value = 0, max = 100, color = '#4F8EF7', className = '' }) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full h-2 bg-white/[0.06] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  )
}
