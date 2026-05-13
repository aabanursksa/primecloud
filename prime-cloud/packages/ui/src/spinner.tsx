import React from 'react'
import { cn } from './index'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-6 h-6 border-2 border-border-soft border-t-main-purple rounded-full animate-spin" />
    </div>
  )
}
