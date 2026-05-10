import { DollarSign, ShoppingCart, TrendingUp, Wallet, AlertTriangle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import StatCard from '@/components/shared/StatCard'
import { statsData, dailySales, branchPerformance, topProducts, orders, quickActions } from '@/data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { t, language } = useLanguage()
  const currency = language === 'ar' ? 'ر.س' : 'SAR'

  const salesData = dailySales.map((d) => ({
    name: d.day,
    [t('Sales', 'المبيعات')]: d.sales,
  }))

  const formatCurrency = (value: number) =>
    `${value.toLocaleString()} ${currency}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">{t('Dashboard', 'لوحة التحكم')}</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {t('Welcome back! Here is your business overview for today.', 'مرحباً بعودتك! نظرة عامة على أعمالك اليوم.')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={DollarSign}
          titleEn="Today Sales"
          titleAr="مبيعات اليوم"
          value={formatCurrency(statsData.todaySales)}
          comparison={`+${((statsData.todaySales - statsData.yesterdaySales) / statsData.yesterdaySales * 100).toFixed(0)}%`}
          color="bg-success"
          trend="up"
        />
        <StatCard
          icon={ShoppingCart}
          titleEn="Today Orders"
          titleAr="طلبات اليوم"
          value={statsData.todayOrders.toString()}
          comparison={`+${((statsData.todayOrders - statsData.yesterdayOrders) / statsData.yesterdayOrders * 100).toFixed(0)}%`}
          color="bg-info"
          trend="up"
        />
        <StatCard
          icon={TrendingUp}
          titleEn="Today Net Profit"
          titleAr="صافي الربح اليوم"
          value={formatCurrency(statsData.todayNetProfit)}
          comparison={`+${((statsData.todayNetProfit - statsData.yesterdayNetProfit) / statsData.yesterdayNetProfit * 100).toFixed(0)}%`}
          color="bg-main-purple"
          trend="up"
        />
        <StatCard
          icon={Wallet}
          titleEn="Today Expenses"
          titleAr="مصروفات اليوم"
          value={formatCurrency(statsData.todayExpenses)}
          comparison={`+${((statsData.todayExpenses - statsData.yesterdayExpenses) / statsData.yesterdayExpenses * 100).toFixed(0)}%`}
          color="bg-warning"
          trend="down"
        />
        <StatCard
          icon={AlertTriangle}
          titleEn="Low Stock Alerts"
          titleAr="تنبيهات المخزون"
          value={statsData.lowStockAlerts.toString()}
          comparison={`-${statsData.yesterdayLowStockAlerts - statsData.lowStockAlerts}`}
          color="bg-error"
          trend={statsData.lowStockAlerts < statsData.yesterdayLowStockAlerts ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-main">{t('Sales Overview', 'نظرة عامة على المبيعات')}</h2>
            <div className="flex gap-1">
              {[t('Daily', 'يومي'), t('Weekly', 'أسبوعي'), t('Monthly', 'شهري'), t('Yearly', 'سنوي')].map((tab) => (
                <button
                  key={tab}
                  className="px-3 py-1 text-xs rounded-lg font-medium transition-colors bg-main-purple text-white cursor-pointer"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={t('Sales', 'المبيعات')}
                  stroke="#6D4DE6"
                  strokeWidth={2}
                  dot={{ fill: '#6D4DE6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4">{t('Branch Performance', 'أداء الفروع')}</h2>
            <div className="space-y-4">
              {branchPerformance.map((b) => (
                <div key={b.nameEn}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-main font-medium">
                      {t(b.nameEn, b.nameAr)}
                    </span>
                    <span className="text-text-secondary">{formatCurrency(b.sales)}</span>
                  </div>
                  <div className="w-full bg-bg-main rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-main-purple transition-all"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4">{t('Top Selling Products', 'أفضل المنتجات مبيعاً')}</h2>
            <div className="space-y-3">
              {topProducts.slice(0, 4).map((p) => (
                <div key={p.nameEn} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-main-purple/10 flex items-center justify-center">
                    <span className="text-sm">{p.nameEn === 'Beef Burger' ? '🍔' : '🍽'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-main truncate">
                      {t(p.nameEn, p.nameAr)}
                    </div>
                    <div className="text-xs text-text-light">{p.sales} {t('sold', 'مباع')}</div>
                  </div>
                  <div className="text-sm font-semibold text-text-main">{formatCurrency(p.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-main">{t('Latest Orders', 'أحدث الطلبات')}</h2>
            <button className="text-sm text-main-purple hover:text-light-purple font-medium transition-colors flex items-center gap-1 cursor-pointer">
              {t('View All', 'عرض الكل')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft text-text-secondary text-xs uppercase">
                  <th className="text-left pb-3 font-medium">{t('Order', 'الطلب')}</th>
                  <th className="text-left pb-3 font-medium">{t('Customer', 'العميل')}</th>
                  <th className="text-left pb-3 font-medium">{t('Time', 'الوقت')}</th>
                  <th className="text-right pb-3 font-medium">{t('Total', 'المجموع')}</th>
                  <th className="text-right pb-3 font-medium">{t('Status', 'الحالة')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border-soft/50">
                    <td className="py-3 font-medium text-text-main">{order.id}</td>
                    <td className="py-3 text-text-secondary">{order.customer}</td>
                    <td className="py-3 text-text-secondary">{order.time}</td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(order.total)}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'preparing' ? 'bg-warning/10 text-warning' :
                          order.status === 'ready' ? 'bg-success/10 text-success' :
                          order.status === 'delivered' ? 'bg-success/10 text-success' :
                          'bg-error/10 text-error'
                        }`}
                      >
                        {t(
                          order.status.charAt(0).toUpperCase() + order.status.slice(1),
                          order.status === 'new' ? 'جديد' :
                          order.status === 'preparing' ? 'قيد التحضير' :
                          order.status === 'ready' ? 'جاهز' :
                          order.status === 'delivered' ? 'تم التوصيل' : 'ملغي',
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-4">{t('Quick Actions', 'إجراءات سريعة')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border-soft hover:border-main-purple hover:bg-main-purple/5 transition-all cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">
                      {action.en === 'New Order' ? '📝' :
                       action.en === 'Open POS' ? '🖥' :
                       action.en === 'Delivery Order' ? '🚚' :
                       action.en === 'New Product' ? '📦' :
                       action.en === 'View Inventory' ? '📊' : '📈'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-text-main text-center leading-tight">
                    {t(action.en, action.ar)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <h2 className="text-lg font-bold text-text-main mb-3">{t('E-Invoicing & ZATCA', 'الفوترة الإلكترونية و ZATCA')}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <span className="text-sm text-text-main">{t('E-Invoicing', 'الفوترة الإلكترونية')}</span>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                  {t('Connected', 'متصل')}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-info/5 border border-info/20">
                <span className="text-sm text-text-main">{t('ZATCA Audit', 'تدقيق ZATCA')}</span>
                <span className="text-xs font-medium text-info bg-info/10 px-2 py-0.5 rounded-full">
                  {t('Synced', 'متزامن')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
