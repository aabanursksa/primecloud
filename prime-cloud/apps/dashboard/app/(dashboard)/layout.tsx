'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, FileText, Calculator, Package, Settings, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/pos', label: 'نقاط البيع', icon: ShoppingCart },
  { href: '/invoices', label: 'الفواتير', icon: FileText },
  { href: '/accounting', label: 'المحاسبة', icon: Calculator },
  { href: '/inventory', label: 'المخزون', icon: Package },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
      return
    }
    if (userData) setUser(JSON.parse(userData))
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-border-soft transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-5 border-b border-border-soft flex items-center justify-between">
          <span className="text-lg font-bold text-main-purple">Prime Cloud</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-main-purple/10 text-main-purple font-medium' : 'text-text-secondary hover:bg-bg-main'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-main-purple/20 flex items-center justify-center text-main-purple font-bold text-sm">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-text-light truncate">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border-soft px-5 py-3 flex items-center justify-between lg:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs text-text-light">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  )
}
