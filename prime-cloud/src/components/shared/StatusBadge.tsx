import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusMap: Record<string, { en: string; ar: string; color: string }> = {
  new: { en: 'New', ar: 'جديد', color: 'bg-blue-100 text-blue-700' },
  preparing: { en: 'Preparing', ar: 'قيد التحضير', color: 'bg-warning/10 text-warning' },
  ready: { en: 'Ready', ar: 'جاهز', color: 'bg-success/10 text-success' },
  delivered: { en: 'Delivered', ar: 'تم التوصيل', color: 'bg-success/10 text-success' },
  cancelled: { en: 'Cancelled', ar: 'ملغي', color: 'bg-error/10 text-error' },
  active: { en: 'Active', ar: 'نشط', color: 'bg-success/10 text-success' },
  inactive: { en: 'Inactive', ar: 'غير نشط', color: 'bg-gray-100 text-gray-500' },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useLanguage()
  const config = statusMap[status] || { en: status, ar: status, color: 'bg-gray-100 text-gray-600' }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.color, className)}>
      {t(config.en, config.ar)}
    </span>
  )
}
