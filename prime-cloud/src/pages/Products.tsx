import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { products, categories } from '@/data/mockData'
import { Search, Plus, Upload, Download, Edit2, MoreHorizontal } from 'lucide-react'

export default function Products() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const currency = language === 'ar' ? 'ر.س' : 'SAR'

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameAr.includes(searchTerm)
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">{t('Products', 'المنتجات')}</h1>
          <p className="text-text-secondary mt-1 text-sm">{t('Manage your menu and products', 'إدارة قائمة الطعام والمنتجات')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            {t('Import', 'استيراد')}
          </button>
          <button className="px-3 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" />
            {t('Export', 'تصدير')}
          </button>
          <button className="px-4 py-2 bg-main-purple hover:bg-light-purple text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            {t('Add Product', 'إضافة منتج')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-soft shadow-sm">
        <div className="p-4 border-b border-border-soft">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search products...', 'بحث عن المنتجات...')}
                className="w-full pl-10 pr-4 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors cursor-pointer"
            >
              <option value="all">{t('All Categories', 'جميع التصنيفات')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-text-secondary text-xs uppercase">
                <th className="text-left px-4 py-3 font-medium">{t('Product', 'المنتج')}</th>
                <th className="text-left px-4 py-3 font-medium">{t('Category', 'التصنيف')}</th>
                <th className="text-right px-4 py-3 font-medium">{t('Price', 'السعر')}</th>
                <th className="text-right px-4 py-3 font-medium">{t('Stock', 'المخزون')}</th>
                <th className="text-center px-4 py-3 font-medium">{t('Status', 'الحالة')}</th>
                <th className="text-right px-4 py-3 font-medium">{t('Actions', 'الإجراءات')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border-soft/50 hover:bg-bg-main/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-main-purple/10 flex items-center justify-center text-lg">
                        {product.nameEn === 'Beef Burger' ? '🍔' :
                         product.nameEn === 'Grilled Chicken' ? '🍗' :
                         product.nameEn === 'Arabic Shawarma' ? '🌯' :
                         product.nameEn === 'French Fries' ? '🍟' :
                         product.nameEn === 'Soft Drink' ? '🥤' :
                         product.nameEn === 'Orange Juice' ? '🧃' :
                         product.nameEn === 'Chicken Meal' ? '🍱' : '🍽'}
                      </div>
                      <div>
                        <div className="font-medium text-text-main">{t(product.nameEn, product.nameAr)}</div>
                        <div className="text-xs text-text-light">SKU-{String(product.id).padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">{product.price.toFixed(2)} {currency}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${product.stock < 30 ? 'text-error' : 'text-text-main'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t(product.status === 'active' ? 'Active' : 'Inactive', product.status === 'active' ? 'نشط' : 'غير نشط')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-text-secondary hover:text-main-purple transition-colors cursor-pointer" title={t('Edit', 'تعديل')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-text-secondary hover:text-text-main transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-soft text-xs text-text-light">
          {t('Showing', 'عرض')} {filteredProducts.length} {t('of', 'من')} {products.length} {t('products', 'منتجات')}
        </div>
      </div>
    </div>
  )
}
