import { useLanguage } from '@/contexts/LanguageContext'
import { dailySales, branchPerformance, topProducts, statsData } from '@/data/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Filter } from 'lucide-react'

export default function Reports() {
  const { t, language } = useLanguage()
  const currency = language === 'ar' ? 'ر.س' : 'SAR'
  const fmt = (v: number) => v.toLocaleString() + ' ' + currency

  const salesData = dailySales.map((d) => ({
    name: d.day,
    sales: d.sales,
  }))

  const profitMargin = ((statsData.todayNetProfit / statsData.todaySales) * 100).toFixed(1)

  const pieData = branchPerformance.map((b) => ({
    name: t(b.nameEn, b.nameAr),
    value: b.sales,
  }))

  const COLORS = ['#6D4DE6', '#8B5CF6', '#6366F1', '#A78BFA']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">{t('Reports', 'التقارير')}</h1>
          <p className="text-text-secondary mt-1 text-sm">{t('Business performance and analytics', 'أداء الأعمال والتحليلات')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors flex items-center gap-1.5 cursor-pointer">
            <Filter className="w-4 h-4" />
            {t('Filters', 'تصفية')}
          </button>
          <button className="px-3 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" />
            {t('Export', 'تصدير')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="text-sm text-text-secondary mb-1">{t('Total Sales', 'إجمالي المبيعات')}</div>
          <div className="text-2xl font-bold text-text-main">{fmt(statsData.todaySales)}</div>
          <div className="text-xs text-success mt-1">&uarr; 12.5%</div>
        </div>
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="text-sm text-text-secondary mb-1">{t('Total Expenses', 'إجمالي المصروفات')}</div>
          <div className="text-2xl font-bold text-text-main">{fmt(statsData.todayExpenses)}</div>
          <div className="text-xs text-warning mt-1">&uarr; 8.3%</div>
        </div>
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="text-sm text-text-secondary mb-1">{t('Net Profit', 'صافي الربح')}</div>
          <div className="text-2xl font-bold text-success">{fmt(statsData.todayNetProfit)}</div>
          <div className="text-xs text-success mt-1">&uarr; 15.2%</div>
        </div>
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <div className="text-sm text-text-secondary mb-1">{t('Profit Margin', 'هامش الربح')}</div>
          <div className="text-2xl font-bold text-main-purple">{profitMargin}%</div>
          <div className="text-xs text-success mt-1">&uarr; 2.1%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">{t('Sales Chart', 'رسم بياني للمبيعات')}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF2" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#6D4DE6" radius={[4, 4, 0, 0]} name={t('Sales', 'المبيعات')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">{t('Branch Performance', 'أداء الفروع')}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">{t('Top Products', 'أفضل المنتجات')}</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.nameEn} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-main-purple/10 flex items-center justify-center text-xs font-bold text-main-purple">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-text-main">{t(p.nameEn, p.nameAr)}</span>
                    <span className="text-text-secondary">{fmt(p.revenue)}</span>
                  </div>
                  <div className="w-full bg-bg-main rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-main-purple"
                      style={{ width: ((p.revenue / topProducts[0].revenue) * 100) + '%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">{t('Expenses Breakdown', 'تفصيل المصروفات')}</h2>
          <div className="space-y-4">
            {[
              { catEn: 'Food Supplies', catAr: 'المواد الغذائية', amount: 1800, percent: 45 },
              { catEn: 'Salaries', catAr: 'الرواتب', amount: 2500, percent: 62 },
              { catEn: 'Utilities', catAr: 'المرافق', amount: 800, percent: 20 },
              { catEn: 'Marketing', catAr: 'التسويق', amount: 500, percent: 12 },
            ].map((item) => (
              <div key={item.catEn}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-main">{t(item.catEn, item.catAr)}</span>
                  <span className="text-text-secondary">{fmt(item.amount)}</span>
                </div>
                <div className="w-full bg-bg-main rounded-full h-2">
                  <div className="h-2 rounded-full bg-warning" style={{ width: item.percent + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
