import { Search, Bell, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import BranchSelector from '@/components/shared/BranchSelector'

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="h-16 bg-white border-b border-border-soft flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder={t('Search orders, products, customers...', 'بحث عن الطلبات، المنتجات، العملاء...')}
            className="w-full pl-10 pr-4 py-2 text-sm bg-bg-main border border-border-soft rounded-lg text-text-main placeholder:text-text-light outline-none focus:border-main-purple transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <BranchSelector />
        <button className="p-2 text-text-secondary hover:text-main-purple transition-colors rounded-lg hover:bg-bg-main cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </button>
        <LanguageSwitcher />
        <button className="relative p-2 text-text-secondary hover:text-main-purple transition-colors rounded-lg hover:bg-bg-main cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border-soft">
          <div className="w-8 h-8 rounded-full bg-main-purple flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="text-sm">
            <div className="font-medium text-text-main">{t('Admin', 'المدير')}</div>
            <div className="text-xs text-text-light">admin@primecloud.sa</div>
          </div>
        </div>
      </div>
    </header>
  )
}
