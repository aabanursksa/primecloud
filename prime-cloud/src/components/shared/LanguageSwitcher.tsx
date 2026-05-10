import { useLanguage } from '@/contexts/LanguageContext'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-soft bg-white text-sm font-medium text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors cursor-pointer"
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'en' ? 'AR' : 'EN'}</span>
    </button>
  )
}
