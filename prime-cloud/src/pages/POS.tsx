import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { products, categories } from '@/data/mockData'
import { Search, Plus, Minus, ShoppingCart, X, Percent, StickyNote, CreditCard } from 'lucide-react'

interface CartItem {
  productId: number
  nameEn: string
  nameAr: string
  price: number
  quantity: number
}

export default function POS() {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')
  const currency = language === 'ar' ? 'ر.س' : 'SAR'

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery)
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          price: product.price,
          quantity: 1,
        },
      ]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vat = subtotal * 0.15
  const total = subtotal + vat

  const clearCart = () => {
    setCart([])
    setNote('')
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border-soft">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search by name or barcode...', 'بحث بالاسم أو الباركود...')}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg text-text-main placeholder:text-text-light outline-none focus:border-main-purple transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 p-4 border-b border-border-soft overflow-x-auto">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'All'
                ? 'bg-main-purple text-white'
                : 'bg-bg-main text-text-secondary hover:bg-main-purple/10'
            }`}
          >
            {t('All', 'الكل')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-main-purple text-white'
                  : 'bg-bg-main text-text-secondary hover:bg-main-purple/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border border-border-soft rounded-xl p-4 hover:border-main-purple hover:shadow-md transition-all text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-main-purple/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-main-purple/10 transition-colors">
                  <span className="text-2xl">
                    {product.nameEn === 'Beef Burger' ? '🍔' :
                     product.nameEn === 'Grilled Chicken' ? '🍗' :
                     product.nameEn === 'Arabic Shawarma' ? '🌯' :
                     product.nameEn === 'French Fries' ? '🍟' :
                     product.nameEn === 'Soft Drink' ? '🥤' :
                     product.nameEn === 'Orange Juice' ? '🧃' :
                     product.nameEn === 'Chicken Meal' ? '🍱' :
                     '🍽'}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-text-main mb-1">
                  {t(product.nameEn, product.nameAr)}
                </h3>
                <p className="text-sm font-bold text-main-purple">{product.price.toFixed(2)} {currency}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-80 flex flex-col bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border-soft bg-dark-purple text-white">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-bold">{t('Cart', 'السلة')}</h2>
            <span className="text-sm text-white/70 ml-auto">({cart.length})</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-light text-sm">
              <ShoppingCart className="w-12 h-12 mb-2 text-border-soft" />
              <p>{t('Cart is empty', 'السلة فارغة')}</p>
              <p className="text-xs">{t('Select products to start', 'اختر المنتجات للبدء')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 p-2 rounded-lg bg-bg-main">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-main truncate">
                    {t(item.nameEn, item.nameAr)}
                  </div>
                  <div className="text-xs text-text-light">
                    {(item.price * item.quantity).toFixed(2)} {currency}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-error/10 hover:border-error/30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3 text-text-secondary" />
                  </button>
                  <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-success/10 hover:border-success/30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-text-secondary" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1 hover:text-error transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border-soft p-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('Subtotal', 'المجموع الفرعي')}</span>
              <span className="font-medium">{subtotal.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">VAT 15%</span>
              <span className="font-medium">{vat.toFixed(2)} {currency}</span>
            </div>
            {note && (
              <div className="flex justify-between text-xs text-text-light">
                <span>{t('Note:', 'ملاحظة:')}</span>
                <span>{note}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-main-purple pt-2 border-t border-border-soft">
              <span>{t('Total', 'الإجمالي')}</span>
              <span>{total.toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="flex-1 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <StickyNote className="w-4 h-4" />
              {t('Note', 'ملاحظة')}
            </button>
            <button
              className="flex-1 py-2 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-warning hover:text-warning transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Percent className="w-4 h-4" />
              {t('Discount', 'خصم')}
            </button>
            <button
              onClick={clearCart}
              className="py-2 px-3 text-sm border border-border-soft rounded-lg text-text-secondary hover:border-error hover:text-error transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {showNoteInput && (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('Add note to order...', 'أضف ملاحظة للطلب...')}
              className="w-full px-3 py-2 text-sm border border-border-soft rounded-lg outline-none focus:border-main-purple"
            />
          )}

          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-gray-100 text-text-secondary rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm cursor-pointer">
              {t('Hold', 'تعليق')}
            </button>
            <button
              className="flex-[2] py-3 bg-main-purple text-white rounded-lg font-bold hover:bg-light-purple transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              {t('Pay', 'دفع')} {total.toFixed(2)} {currency}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
