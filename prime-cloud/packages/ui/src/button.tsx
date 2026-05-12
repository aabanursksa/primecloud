import { cn } from './index'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-main-purple text-white hover:bg-light-purple',
        variant === 'secondary' && 'border border-border-soft hover:bg-bg-main',
        variant === 'ghost' && 'hover:bg-bg-main text-text-secondary',
        variant === 'danger' && 'bg-error text-white hover:bg-error/90',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className,
      )}
      {...props}
    />
  )
}
