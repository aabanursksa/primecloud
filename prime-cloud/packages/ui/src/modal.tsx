import React from 'react'
import { cn } from './index'

export function Modal({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; className?: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={cn('bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden', className)} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="p-5 border-b border-border-soft flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
