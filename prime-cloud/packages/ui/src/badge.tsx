import { cn } from './index'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export function Badge({ children, variant = 'neutral', className }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      variant === 'success' && 'bg-success/10 text-success',
      variant === 'warning' && 'bg-warning/10 text-warning',
      variant === 'error' && 'bg-error/10 text-error',
      variant === 'info' && 'bg-main-purple/10 text-main-purple',
      variant === 'neutral' && 'bg-text-light/10 text-text-light',
      className,
    )}>
      {children}
    </span>
  )
}
