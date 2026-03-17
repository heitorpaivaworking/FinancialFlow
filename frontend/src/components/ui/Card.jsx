const variantStyles = {
  default: 'bg-elevated border-white/[0.06] shadow-card',
  glass: 'bg-white/[0.03] backdrop-blur-xl border-white/[0.10]',
  stat: 'bg-elevated border-white/[0.06] shadow-card',
  flat: 'bg-elevated border-white/[0.06]',
}

export default function Card({
  children,
  variant = 'default',
  accent,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={`
        relative rounded-lg border overflow-hidden
        transition-all duration-200
        ${variantStyles[variant]}
        ${hover ? 'hover:border-white/[0.12] hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: accent }}
        />
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

export function KPICard({ icon: Icon, label, value, trend, accent, sparkData }) {
  return (
    <Card variant="stat" accent={accent} hover>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="p-2 rounded-lg"
              style={{ background: `${accent}15` }}
            >
              <Icon size={18} style={{ color: accent }} />
            </div>
          )}
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
            {label}
          </span>
        </div>
        {trend && (
          <span
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
              trend.color === 'positive'
                ? 'bg-accent-green/10 text-accent-green'
                : trend.color === 'negative'
                  ? 'bg-accent-red/10 text-accent-red'
                  : 'bg-white/5 text-white/40'
            }`}
          >
            {trend.icon} {trend.label}
          </span>
        )}
      </div>
      <div className="font-mono text-2xl font-semibold text-white animate-number-up">
        {value}
      </div>
    </Card>
  )
}
