import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { orders, branches } from '@/data/mockData'
import { Search, Plus } from 'lucide-react'

export default function Orders() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const currency = language === 'ar' ? 'ر.س' : 'SAR'

  const statuses = ['all', 'new', 'preparing', 'ready', 'delivered', 'cancelled']

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesBranch = branchFilter === 'all' || order.branch === parseInt(branchFilter)
    return matchesSearch && matchesStatus && matchesBranch
  })

  const formatCurrency = (value: number) => `${value.toFixed(2)} ${currency}`

  const statusLabels: Record<string, { en: string; ar: string }> = {
    new: { en: 'New', ar: 'جديد' },
    preparing: { en: 'Preparing', ar: 'قيد التحضير' },
    ready: { en: 'Ready', ar: 'جاهز' },
    delivered: { en: 'Delivered', ar: 'تم التوصيل' },
    cancelled: { en: 'Cancelled', ar: 'ملغي' },
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    preparing: 'bg-warning/10 text-warning',
    ready: 'bg-success/10 text-success',
    delivered: 'bg-success/10 text-success',
    cancelled: 'bg-error/10 text-error',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">{t('Orders', 'الطلبات')}</h1>
          <p className="text-text-secondary mt-1 text-sm">{t('Manage and track all orders', 'إدارة وتتبع جميع الطلبات')}</p>
        </div>
        <button className="px-4 py-2.5 bg-main-purple hover:bg-light-purple text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          {t('New Order', 'طلب جديد')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border-soft shadow-sm">
        <div className="p-4 border-b border-border-soft">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search orders...', 'بحث عن الطلبات...')}
                className="w-full pl-10 pr-4 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors cursor-pointer"
            >
              <option value="all">{t('All Status', 'جميع الحالات')}</option>
              {statuses.filter(s => s !== 'all').map((s) => (
                <option key={s} value={s}>{t(statusLabels[s].en, statusLabels[s].ar)}</option>
              ))}
            </select>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors cursor-pointer"
            >
              <option value="all">{t('All Branches', 'جميع الفروع')}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{t(b.en, b.ar)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-text-secondary text-xs uppercase">
                <th className="text-left px-4 py-3 font-medium">{t('Order', 'الطلب')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('Customer', 'العميل')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('Branch', 'الفرع')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('Time', 'الوقت')}</th>
                <th className="text-right px-4 py-3 font-medium">{t('Total', 'المجموع')}</th>
                <th className="text-center px-4 py-3 font-medium">{t('Status', 'الحالة')}</th>
                <th className="text-right px-4 py-3 font-medium">{t('Actions', 'الإجراءات')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const branch = branches.find((b) => b.id === order.branch)
                return (
                  <tr key={order.id} className="border-b border-border-soft/50 hover:bg-bg-main/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-main">{order.id}</td>
                    <td className="px-4 py-3 text-text-secondary">{order.customer}</td>
                    <td className="px-4 py-3 text-text-secondary">{branch ? t(branch.en, branch.ar) : '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{order.time}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {t(statusLabels[order.status].en, statusLabels[order.status].ar)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-sm text-main-purple hover:text-light-purple font-medium transition-colors cursor-pointer">
                        {t('View', 'عرض')}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-soft text-xs text-text-light">
          {t('Showing', 'عرض')} {filteredOrders.length} {t('of', 'من')} {orders.length} {t('orders', 'طلبات')}
        </div>
      </div>
    </div>
  )
}
