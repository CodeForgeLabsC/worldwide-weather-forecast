import { cn } from '@/lib/cn'

interface LoadingSkeletonProps {
  className?: string
  'aria-label'?: string
}

/** A single skeleton block. Compose several for card-shaped loading states. */
export function LoadingSkeleton({ className, 'aria-label': ariaLabel }: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Loading'}
      className={cn('animate-pulse rounded-lg bg-slate-900/8', className)}
    />
  )
}
