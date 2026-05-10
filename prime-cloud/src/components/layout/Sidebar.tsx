import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ShoppingCart, ClipboardList, Package,
  Tags, Gift, Puzzle, Store, Grid3X3, Warehouse, ArrowLeftRight,
  Trash2, TrendingUp, ShoppingBag, Users, Calculator, BookOpen,
  Wallet, FileText, ShieldCheck, BarChart3, DollarSign, UsersRound,
  History, Settings as SettingsIcon, CreditCard, Monitor, ChevronLeft,
  ChevronRight, ChefHat,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, labelEn: 'Dashboard', labelAr: 'لوحة التحكم', path: '/' },
  { icon: ShoppingCart, labelEn: 'POS', labelAr: 'نقاط البيع', path: '/pos' },
  { icon: ChefHat, labelEn: 'Kitchen Display', labelAr: 'شاشة المطبخ', path: '/kitchen' },
  { icon: ClipboardList, labelEn: 'Orders', labelAr: 'الطلبات', path: '/orders' },
  { icon: Package, labelEn: 'Products', labelAr: 'المنتجات', path: '/products' },
  { icon: Tags, labelEn: 'Categories', labelAr: 'التصنيفات', path: '/categories' },
  { icon: Gift, labelEn: 'Offers & Packages', labelAr: 'العروض والباقات', path: '/offers' },
  { icon: Puzzle, labelEn: 'Add-ons & Options', labelAr: 'الإضافات والخيارات', path: '/addons' },
  { icon: Store, labelEn: 'Branches', labelAr: 'الفروع', path: '/branches' },
  { icon: Grid3X3, labelEn: 'Tables', labelAr: 'الطاولات', path: '/tables' },
  { icon: Warehouse, labelEn: 'Inventory', labelAr: 'المخزون', path: '/inventory' },
  { icon: ArrowLeftRight, labelEn: 'Inventory Transfers', labelAr: 'تحويلات المخزون', path: '/inventory-transfers' },
  { icon: Trash2, labelEn: 'Waste & Damaged', labelAr: 'الهدر والتالف', path: '/waste' },
  { icon: TrendingUp, labelEn: 'Stock Movement', labelAr: 'حركة المخزون', path: '/stock-movement' },
  { icon: ShoppingBag, labelEn: 'Purchases', labelAr: 'المشتريات', path: '/purchases' },
  { icon: Users, labelEn: 'Suppliers', labelAr: 'الموردين', path: '/suppliers' },
  { icon: FileText, labelEn: 'Sales & Invoices', labelAr: 'المبيعات والفواتير', path: '/sales' },
  { icon: UsersRound, labelEn: 'Customers', labelAr: 'العملاء', path: '/customers' },
  { icon: Calculator, labelEn: 'Accounting', labelAr: 'المحاسبة', path: '/accounting' },
  { icon: BookOpen, labelEn: 'Journal Entries', labelAr: 'القيود اليومية', path: '/journal' },
  { icon: Wallet, labelEn: 'Expenses', labelAr: 'المصروفات', path: '/expenses' },
  { icon: FileText, labelEn: 'E-Invoicing', labelAr: 'الفوترة الإلكترونية', path: '/einvoicing' },
  { icon: ShieldCheck, labelEn: 'ZATCA Audit', labelAr: 'تدقيق ZATCA', path: '/zatca' },
  { icon: BarChart3, labelEn: 'Reports', labelAr: 'التقارير', path: '/reports' },
  { icon: DollarSign, labelEn: 'Product Costing', labelAr: 'تكلفة المنتجات', path: '/costing' },
  { icon: UsersRound, labelEn: 'Employees & Permissions', labelAr: 'الموظفين والصلاحيات', path: '/employees' },
  { icon: History, labelEn: 'Activity Log', labelAr: 'سجل النشاط', path: '/activity' },
  { icon: SettingsIcon, labelEn: 'Settings', labelAr: 'الإعدادات', path: '/settings' },
  { icon: CreditCard, labelEn: 'Subscription & Billing', labelAr: 'الاشتراك والفوترة', path: '/subscription' },
  { icon: Monitor, labelEn: 'POS Devices', labelAr: 'أجهزة POS', path: '/pos-devices' },
]

export default function Sidebar() {
  const { t, dir } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'h-screen bg-dark-purple text-white flex flex-col transition-all duration-300 overflow-hidden',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-main-purple flex items-center justify-center shrink-0">
          <span className="text-sm font-bold">PC</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight" dir="ltr">Prime Cloud</div>
            <div className="text-[10px] text-white/60 leading-tight" dir="ltr">{t('Platform', 'منصة')}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors text-sm',
                isActive
                  ? 'bg-main-purple/20 text-main-purple font-medium'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{t(item.labelEn, item.labelAr)}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-white/10 text-white/50 hover:text-white cursor-pointer shrink-0"
      >
        {dir === 'ltr' ? (
          collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
        ) : (
          collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </aside>
  )
}
