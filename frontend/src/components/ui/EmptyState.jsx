import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  message = 'Nenhum registro encontrado',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-white/[0.03] mb-4">
        <Icon size={32} className="text-white/20" />
      </div>
      <p className="text-sm font-medium text-white/40">{message}</p>
      {description && (
        <p className="text-xs text-white/25 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
