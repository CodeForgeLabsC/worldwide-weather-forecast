import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function GlassPanel({ children, className, ...rest }: GlassPanelProps) {
  return (
    <div className={cn('glass-panel rounded-2xl', className)} {...rest}>
      {children}
    </div>
  )
}
