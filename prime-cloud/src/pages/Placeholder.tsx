import { useLanguage } from '@/contexts/LanguageContext'
import { Construction } from 'lucide-react'

export default function Placeholder({ titleEn, titleAr }: { titleEn: string; titleAr: string }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Construction className="w-16 h-16 text-text-light mb-4" />
      <h1 className="text-2xl font-bold text-text-main mb-2">{t(titleEn, titleAr)}</h1>
      <p className="text-text-secondary">
        {t('This page is under construction', 'هذه الصفحة قيد الإنشاء')}
      </p>
    </div>
  )
}
