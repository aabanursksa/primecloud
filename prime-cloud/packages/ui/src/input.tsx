import { cn } from './index'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-text-secondary">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none transition-colors focus:border-main-purple',
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
