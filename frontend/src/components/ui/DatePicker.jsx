import { Calendar } from 'lucide-react'

export default function DatePicker({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-white/50 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="date"
          className={`
            w-full bg-elevated border rounded-lg pl-9 pr-3 py-2.5 text-sm text-white
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue/50
            [color-scheme:dark]
            ${error ? 'border-accent-red/50' : 'border-white/10 hover:border-white/15'}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-accent-red">{error}</p>}
    </div>
  )
}
