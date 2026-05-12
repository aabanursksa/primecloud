import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'

interface PaymentModalProps {
  total: number
  onComplete: (received: number) => void
  onClose: () => void
  submitting: boolean
}

export default function PaymentModal({ total, onComplete, onClose, submitting }: PaymentModalProps) {
  const [received, setReceived] = useState('')

  const change = Math.max(0, (parseFloat(received) || 0) - total / 100)

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border-soft flex items-center justify-between">
          <h3 className="text-lg font-bold">الدفع</h3>
          <button onClick={onClose} className="p-1 text-text-light hover:text-text-main cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">المبلغ المستحق</span>
            <span className="text-xl font-bold text-main-purple">{(total / 100).toFixed(2)} SAR</span>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">المبلغ المستلم</label>
            <input
              type="number"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 text-lg font-bold bg-bg-main border border-border-soft rounded-xl outline-none focus:border-main-purple text-left"
              dir="ltr"
              autoFocus
            />
          </div>
          {parseFloat(received) >= total / 100 && (
            <div className="flex justify-between text-sm text-success font-semibold">
              <span>الباقي</span>
              <span>{(change / 100).toFixed(2)} SAR</span>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium border border-border-soft hover:bg-bg-main transition-colors cursor-pointer">
              إلغاء
            </button>
            <button
              onClick={() => onComplete(parseFloat(received) || 0)}
              disabled={submitting || parseFloat(received) < total / 100}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-main-purple text-white hover:bg-light-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {submitting ? 'جاري المعالجة...' : 'إتمام البيع'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
