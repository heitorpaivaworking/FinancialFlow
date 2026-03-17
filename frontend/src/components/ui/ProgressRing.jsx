import { useEffect, useState } from 'react'

export default function ProgressRing({
  progress = 0,
  size = 180,
  strokeWidth = 10,
  label,
  sublabel,
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.min(progress, 100))
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getColor = () => {
    if (animatedProgress >= 80) return '#10D98A'
    if (animatedProgress >= 50) return '#4F8EF7'
    if (animatedProgress >= 25) return '#FFB547'
    return '#FF5757'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: `drop-shadow(0 0 6px ${getColor()}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold text-white">
          {Math.round(animatedProgress)}%
        </span>
        {label && <span className="text-xs text-white/40 mt-1">{label}</span>}
        {sublabel && <span className="text-xs text-white/25">{sublabel}</span>}
      </div>
    </div>
  )
}
