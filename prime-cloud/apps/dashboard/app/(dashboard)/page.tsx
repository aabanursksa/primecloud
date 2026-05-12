'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { DollarSign, FileText, ShoppingCart, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalVat: 0, count: 0 })

  useEffect(() => {
    api.get('/invoices/stats').then(setStats).catch(() => {})
  }, [])

  const cards = [
    { label: 'إجمالي الإيرادات', value: `${(stats.totalRevenue / 100).toFixed(2)} SAR`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'ضريبة القيمة المضافة', value: `${(stats.totalVat / 100).toFixed(2)} SAR`, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'عدد الفواتير', value: stats.count.toString(), icon: FileText, color: 'text-main-purple', bg: 'bg-main-purple/10' },
    { label: 'عمليات اليوم', value: '—', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">لوحة التحكم</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">{card.label}</span>
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-main">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
