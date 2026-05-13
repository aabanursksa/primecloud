import React from 'react'
import { cn } from './index'

export interface SelectOption {
  value: string
  label: string
}

export function Select({ options, className, label, error, ...props }: { options: SelectOption[]; label?: string; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-text-secondary">{label}</label>}
      <select
        className={cn(
          'w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none transition-colors focus:border-main-purple',
          error && 'border-error',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
