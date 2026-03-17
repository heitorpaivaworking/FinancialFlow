import { ChevronDown } from 'lucide-react'

export default function Select({
  label,
  options = [],
  error,
  placeholder = 'Selecione...',
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/50 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full bg-elevated border rounded-lg px-3 py-2.5 text-sm text-white
            appearance-none cursor-pointer
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue/50
            ${error ? 'border-accent-red/50' : 'border-white/10 hover:border-white/15'}
          `}
          {...props}
        >
          <option value="" className="bg-surface text-white/40">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
              className="bg-surface text-white"
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-accent-red">{error}</p>}
    </div>
  )
}
