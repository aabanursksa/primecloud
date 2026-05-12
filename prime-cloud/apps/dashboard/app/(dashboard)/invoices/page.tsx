'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Invoice {
  id: string
  type: string
  status: string
  total: number
  createdAt: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/invoices').then((res) => {
      setInvoices(Array.isArray(res) ? res : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">الفواتير</h1>
      <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-main border-b border-border-soft">
              <th className="text-right p-4 font-medium text-text-secondary">#</th>
              <th className="text-right p-4 font-medium text-text-secondary">النوع</th>
              <th className="text-right p-4 font-medium text-text-secondary">الحالة</th>
              <th className="text-right p-4 font-medium text-text-secondary">المجموع</th>
              <th className="text-right p-4 font-medium text-text-secondary">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border-soft hover:bg-bg-main/50">
                <td className="p-4 font-mono text-xs">{inv.id.slice(0, 8)}</td>
                <td className="p-4">{inv.type}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {inv.status === 'paid' ? 'مدفوع' : 'معلق'}
                  </span>
                </td>
                <td className="p-4 font-medium">{(inv.total / 100).toFixed(2)} SAR</td>
                <td className="p-4 text-text-secondary">{new Date(inv.createdAt).toLocaleDateString('ar-SA')}</td>
              </tr>
            ))}
            {!loading && invoices.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-text-light">لا توجد فواتير</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
