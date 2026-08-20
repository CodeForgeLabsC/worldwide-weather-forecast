import { AlertTriangle, RotateCw } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

/** Small, contextual error UI meant to live inside a single card — never a full-page takeover. */
export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-start gap-2 text-sm text-ink-muted', className)}
    >
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-md border border-slate-900/10 px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-slate-900/5"
        >
          <RotateCw className="size-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  )
}
