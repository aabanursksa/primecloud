import { type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  titleEn: string
  titleAr: string
  value: string
  comparison: string
  color: string
  trend?: 'up' | 'down'
}

export default function StatCard({
  icon: Icon,
  titleEn,
  titleAr,
  value,
  comparison,
  color,
  trend = 'up',
}: StatCardProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-xl p-5 border border-border-soft shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error',
          )}
        >
          {trend === 'up' ? '↑' : '↓'} {comparison}
        </span>
      </div>
      <h3 className="text-sm text-text-secondary mb-1">{t(titleEn, titleAr)}</h3>
      <p className="text-2xl font-bold text-text-main mb-1">{value}</p>
      <p className="text-xs text-text-light">
        {t('vs yesterday', 'مقارنةً بالأمس')}
      </p>
    </div>
  )
}
