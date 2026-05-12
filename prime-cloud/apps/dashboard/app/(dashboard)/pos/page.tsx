'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Plus, X, Search } from 'lucide-react'

interface Session {
  id: string
  status: string
  openedAt: string
  user: { id: string; name: string }
}

export default function POSPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/pos/sessions/branch/default').then((res) => {
      setSessions(Array.isArray(res) ? res : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">نقاط البيع</h1>
        <button className="px-4 py-2 text-sm font-bold bg-main-purple text-white rounded-lg hover:bg-light-purple transition-colors flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> جلسة جديدة
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
        <div className="p-4 border-b border-border-soft">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input type="text" placeholder="بحث..." className="w-full pr-10 pl-4 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-main border-b border-border-soft">
              <th className="text-right p-4 font-medium text-text-secondary">الكاشير</th>
              <th className="text-right p-4 font-medium text-text-secondary">الحالة</th>
              <th className="text-right p-4 font-medium text-text-secondary">تاريخ الفتح</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border-soft hover:bg-bg-main/50">
                <td className="p-4">{s.user.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'open' ? 'bg-success/10 text-success' : 'bg-text-light/10 text-text-light'}`}>
                    {s.status === 'open' ? 'مفتوحة' : 'مغلقة'}
                  </span>
                </td>
                <td className="p-4 text-text-secondary">{new Date(s.openedAt).toLocaleString('ar-SA')}</td>
              </tr>
            ))}
            {!loading && sessions.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-text-light">لا توجد جلسات</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
