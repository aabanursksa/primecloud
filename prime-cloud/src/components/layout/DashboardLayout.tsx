import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardLayout() {
  const { dir } = useLanguage()

  return (
    <div className="flex h-screen overflow-hidden" dir={dir}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-bg-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
