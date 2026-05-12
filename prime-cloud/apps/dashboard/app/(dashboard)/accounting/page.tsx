'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function AccountingPage() {
  const [report, setReport] = useState<any>(null)
  const [type, setType] = useState('trial-balance')
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    setLoading(true)
    try {
      let res
      if (type === 'trial-balance') res = await api.get('/accounting/trial-balance')
      else if (type === 'income-statement') res = await api.get('/accounting/income-statement?startDate=2026-01-01&endDate=2026-12-31')
      else res = await api.get('/accounting/balance-sheet')
      setReport(res)
    } catch { setReport(null) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">المحاسبة</h1>
      <div className="bg-white rounded-xl border border-border-soft p-5">
        <div className="flex gap-3 mb-5">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple"
          >
            <option value="trial-balance">ميزان المراجعة</option>
            <option value="income-statement">قائمة الدخل</option>
            <option value="balance-sheet">الميزانية العمومية</option>
          </select>
          <button
            onClick={fetchReport}
            disabled={loading}
            className="px-4 py-2 text-sm font-bold bg-main-purple text-white rounded-lg hover:bg-light-purple disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'جاري التحميل...' : 'عرض التقرير'}
          </button>
        </div>
        {report && (
          <pre className="bg-bg-main rounded-lg p-4 text-xs overflow-x-auto">
            {JSON.stringify(report, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
