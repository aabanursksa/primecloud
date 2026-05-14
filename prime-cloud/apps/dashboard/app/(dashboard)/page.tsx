'use client'

import { useEffect, useState, useMemo } from 'react'
import { api } from '@/lib/api'
import { Card, CardBody } from '@prime-cloud/ui'
import {
  DollarSign, FileText, ShoppingCart, TrendingUp,
  Store, Receipt, Package, Plus, ArrowLeftRight,
  Printer, Download, AlertTriangle, Clock,
  BarChart3, CreditCard, Smartphone, Wallet,
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalVat: number
  invoiceCount: number
  todayTransactions: number
  activeSessions: number
  activeBranches: number
  pendingZatca: number
  lowStockItems: number
}

interface RecentTransaction {
  id: string
  invoiceNumber: string
  customer: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  time: string
  paymentMethod: string
}

interface WeeklyRevenue {
  day: string
  amount: number
}

const demoStats: DashboardStats = {
  totalRevenue: 48750000,
  totalVat: 7312500,
  invoiceCount: 1247,
  todayTransactions: 38,
  activeSessions: 12,
  activeBranches: 5,
  pendingZatca: 3,
  lowStockItems: 7,
}

const demoTransactions: RecentTransaction[] = [
  { id: '1', invoiceNumber: 'INV-2024-8941', customer: 'مؤسسة النور للتجارة', amount: 245000, status: 'completed', time: '10:32 ص', paymentMethod: 'Mada' },
  { id: '2', invoiceNumber: 'INV-2024-8940', customer: 'شركة الراشد المحدودة', amount: 89000, status: 'completed', time: '10:15 ص', paymentMethod: 'Apple Pay' },
  { id: '3', invoiceNumber: 'INV-2024-8939', customer: 'مطعم البستان', amount: 156000, status: 'completed', time: '09:58 ص', paymentMethod: 'Cash' },
  { id: '4', invoiceNumber: 'INV-2024-8938', customer: 'مؤسسة الفهد', amount: 423000, status: 'completed', time: '09:30 ص', paymentMethod: 'Credit Card' },
  { id: '5', invoiceNumber: 'INV-2024-8937', customer: 'محل العطاء', amount: 34200, status: 'cancelled', time: '08:45 ص', paymentMethod: 'Mada' },
  { id: '6', invoiceNumber: 'INV-2024-8936', customer: 'شركة التميز', amount: 678000, status: 'pending', time: '08:12 ص', paymentMethod: 'Credit Card' },
  { id: '7', invoiceNumber: 'INV-2024-8935', customer: 'مخبز الأصيل', amount: 51200, status: 'completed', time: '07:55 ص', paymentMethod: 'Cash' },
]

const demoWeeklyRevenue: WeeklyRevenue[] = [
  { day: 'السبت', amount: 320000 },
  { day: 'الأحد', amount: 480000 },
  { day: 'الإثنين', amount: 560000 },
  { day: 'الثلاثاء', amount: 410000 },
  { day: 'الأربعاء', amount: 720000 },
  { day: 'الخميس', amount: 890000 },
  { day: 'الجمعة', amount: 650000 },
]

const quickActions = [
  { label: 'فاتورة جديدة', icon: FileText, color: 'text-main-purple', bg: 'bg-main-purple/10', href: '/invoices' },
  { label: 'جلسة POS', icon: ShoppingCart, color: 'text-success', bg: 'bg-success/10', href: '/pos' },
  { label: 'إضافة منتج', icon: Package, color: 'text-warning', bg: 'bg-warning/10', href: '/inventory' },
  { label: 'حركة مخزنية', icon: ArrowLeftRight, color: 'text-blue-500', bg: 'bg-blue-50', href: '/inventory' },
]

const paymentIcons: Record<string, React.ReactNode> = {
  'Mada': <CreditCard className="w-4 h-4" />,
  'Apple Pay': <Smartphone className="w-4 h-4" />,
  'Cash': <Wallet className="w-4 h-4" />,
  'Credit Card': <CreditCard className="w-4 h-4" />,
}

function StatCard({ label, value, icon: Icon, color, bg, subtitle }: {
  label: string
  value: string
  icon: React.ElementType
  color: string
  bg: string
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-border-soft p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{label}</span>
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-main">{value}</p>
      {subtitle && <p className="text-xs text-text-light mt-1.5">{subtitle}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: 'success' | 'warning' | 'error' | 'info'; label: string }> = {
    completed: { variant: 'success', label: 'مكتملة' },
    pending: { variant: 'warning', label: 'قيد الانتظار' },
    cancelled: { variant: 'error', label: 'ملغية' },
  }
  const v = variants[status]
  if (!v) return null
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      v.variant === 'success' ? 'bg-success/10 text-success' :
      v.variant === 'warning' ? 'bg-warning/10 text-warning' :
      'bg-error/10 text-error'
    }`}>
      {v.label}
    </span>
  )
}

function MiniBarChart({ data }: { data: WeeklyRevenue[] }) {
  const max = Math.max(...data.map(d => d.amount))
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-text-light">{d.day.slice(0, 2)}</span>
          <div
            className="w-full bg-main-purple/20 rounded-t-sm transition-all hover:bg-main-purple/40"
            style={{ height: `${(d.amount / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [transactions, setTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting] = useState(() => {
    const h = new Date().getHours()
    if (h < 12) return 'صباح الخير'
    if (h < 17) return 'مساء الخير'
    return 'مساء الخير'
  })

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats').then(setStats).catch(() => setStats(demoStats)),
      api.get('/dashboard/recent-transactions').then(setTransactions).catch(() => setTransactions(demoTransactions)),
    ]).finally(() => setLoading(false))
  }, [])

  const displayStats = stats || demoStats

  const weekTotal = useMemo(
    () => demoWeeklyRevenue.reduce((s, d) => s + d.amount, 0),
    []
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-border-soft border-t-main-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-main">{greeting}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-main-purple text-white rounded-lg text-sm font-medium hover:bg-main-purple/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> فاتورة جديدة
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="إجمالي الإيرادات"
          value={`${(displayStats.totalRevenue / 100).toLocaleString('ar-SA')} SAR`}
          icon={DollarSign}
          color="text-success"
          bg="bg-success/10"
          subtitle="منذ بداية الشهر"
        />
        <StatCard
          label="ضريبة القيمة المضافة"
          value={`${(displayStats.totalVat / 100).toLocaleString('ar-SA')} SAR`}
          icon={TrendingUp}
          color="text-warning"
          bg="bg-warning/10"
          subtitle="15%"
        />
        <StatCard
          label="الفواتير"
          value={displayStats.invoiceCount.toLocaleString('ar-SA')}
          icon={FileText}
          color="text-main-purple"
          bg="bg-main-purple/10"
          subtitle={`${displayStats.todayTransactions} Today`}
        />
        <StatCard
          label="جلسات POS النشطة"
          value={displayStats.activeSessions.toString()}
          icon={ShoppingCart}
          color="text-blue-500"
          bg="bg-blue-50"
          subtitle={`${displayStats.activeBranches} Today`}
        />
      </div>

      {/* Second Row: ZATCA + Low Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="بانتظار ZATCA"
          value={displayStats.pendingZatca.toString()}
          icon={Receipt}
          color="text-error"
          bg="bg-error/10"
          subtitle="تحتاج توقيع رقمي"
        />
        <StatCard
          label="منتجات منخفضة"
          value={displayStats.lowStockItems.toString()}
          icon={AlertTriangle}
          color="text-warning"
          bg="bg-warning/10"
          subtitle="أقل من الحد الأدنى"
        />
      </div>

      {/* Charts + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text-main">الإيرادات الأسبوعية</h3>
                <p className="text-xs text-text-light mt-0.5">
                  إجمالي الأسبوع: {(weekTotal / 100).toLocaleString('ar-SA')} SAR
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-text-light" />
            </div>
            <MiniBarChart data={demoWeeklyRevenue} />
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-text-main mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border-soft hover:border-main-purple/30 hover:bg-main-purple/5 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-text-secondary text-center">{action.label}</span>
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardBody className="p-0">
          <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-main">آخر المعاملات</h3>
              <p className="text-xs text-text-light mt-0.5">آخر 7 معاملات اليوم</p>
            </div>
            <a href="/invoices" className="text-sm text-main-purple hover:underline">عرض الكل</a>
          </div>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-text-light">لا توجد معاملات اليوم</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-main border-b border-border-soft">
                    <th className="text-right p-4 font-medium text-text-secondary">رقم الفاتورة</th>
                    <th className="text-right p-4 font-medium text-text-secondary">العميل</th>
                    <th className="text-right p-4 font-medium text-text-secondary">المبلغ</th>
                    <th className="text-right p-4 font-medium text-text-secondary">طريقة الدفع</th>
                    <th className="text-right p-4 font-medium text-text-secondary">الحالة</th>
                    <th className="text-right p-4 font-medium text-text-secondary">الوقت</th>
                    <th className="p-4 font-medium text-text-secondary">أخرى</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border-soft hover:bg-bg-main/50">
                      <td className="p-4 font-medium">{t.invoiceNumber}</td>
                      <td className="p-4 text-text-secondary">{t.customer}</td>
                      <td className="p-4 font-medium">{(t.amount / 100).toLocaleString('ar-SA')} SAR</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          {paymentIcons[t.paymentMethod]}
                          <span>{t.paymentMethod === 'Apple Pay' ? 'أبل باي' : t.paymentMethod === 'Mada' ? 'مدى' : t.paymentMethod === 'Cash' ? 'نقدي' : 'بطاقة ائتمانية'}</span>
                        </div>
                      </td>
                      <td className="p-4"><StatusBadge status={t.status} /></td>
                      <td className="p-4 text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-bg-main text-text-secondary hover:text-main-purple transition-colors cursor-pointer" title="طباعة">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-bg-main text-text-secondary hover:text-main-purple transition-colors cursor-pointer" title="تصدير">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
