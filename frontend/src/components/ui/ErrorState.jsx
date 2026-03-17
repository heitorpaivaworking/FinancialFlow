import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  message = 'Erro ao carregar dados',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-accent-red/10 mb-4">
        <AlertTriangle size={32} className="text-accent-red" />
      </div>
      <p className="text-sm font-medium text-white/60">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
