const colorMap = {
  success: 'bg-accent-green/10 text-accent-green',
  danger: 'bg-accent-red/10 text-accent-red',
  warning: 'bg-accent-gold/10 text-accent-gold',
  info: 'bg-accent-blue/10 text-accent-blue',
  purple: 'bg-accent-purple/10 text-accent-purple',
  cyan: 'bg-accent-cyan/10 text-accent-cyan',
  default: 'bg-white/5 text-white/60',
}

const sizeMap = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function Badge({
  children,
  color = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium font-mono
        ${colorMap[color]} ${sizeMap[size]} ${className}
      `}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
