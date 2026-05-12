import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Minus, ShoppingCart, X, StickyNote, Banknote, Loader2, Check, Wifi, WifiOff } from 'lucide-react'
import PaymentModal from '../components/PaymentModal'
import { saveTransaction } from '../db/local-db'
import { getOnlineStatus } from '../sync/sync-engine'

interface Product {
  id: string
  name: string
  nameAr: string
  price: number
  categoryName?: string
  categoryNameAr?: string
}

interface CartItem {
  productId: string
  nameEn: string
  nameAr: string
  price: number
  quantity: number
}

const API_BASE = 'http://localhost:4000/api/v1'

export default function PosScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const isOnline = getOnlineStatus()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_BASE}/products?limit=500`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res: any) => {
        const data = Array.isArray(res) ? res : res.data || []
        setProducts(data)
        const cats = new Set<string>()
        data.forEach((p: any) => {
          if (p.categoryName) cats.add(p.categoryName)
          if (p.categoryNameAr) cats.add(p.categoryNameAr)
        })
        setCategories(['الكل', ...Array.from(cats)])
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Open POS session
    fetch(`${API_BASE}/pos/sessions/active`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((session: any) => {
        if (session?.id) setSessionId(session.id)
      })
      .catch(() => {})
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vat = Math.round(subtotal * 0.15)
  const total = subtotal + vat

  const completeSale = useCallback(async (received: number) => {
    if (cart.length === 0 || !sessionId) return
    setSubmitting(true)
    try {
      const payload = {
        sessionId,
        branchId: 'default',
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.nameAr,
          productNameAr: item.nameAr,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        subtotal,
        discountTotal: 0,
        taxTotal: vat,
        total,
        paymentMethod: 'cash',
        note: note || undefined,
      }

      // Save locally first (offline-first)
      await saveTransaction({
        id: crypto.randomUUID(),
        tenantId: 'local',
        branchId: 'default',
        payload,
      })

      setSuccessMsg('تمت عملية البيع بنجاح!')
      setCart([])
      setNote('')
      setShowPayment(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally {
      setSubmitting(false)
    }
  }, [cart, subtotal, vat, total, note, sessionId])

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameAr.includes(searchQuery)
    const matchesCategory = activeCategory === 'الكل' || p.categoryName === activeCategory || p.categoryNameAr === activeCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) return prev.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { productId: product.id, nameEn: product.name, nameAr: product.nameAr, price: product.price, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0))
  }

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((item) => item.productId !== productId))

  const clearCart = () => { setCart([]); setNote('') }

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-main-purple" /></div>
  }

  return (
    <>
      {/* Online status bar */}
      <div className={`h-8 flex items-center justify-center text-xs text-white font-medium ${isOnline ? 'bg-success' : 'bg-error'}`}>
        {isOnline ? <><Wifi className="w-3 h-3 ml-1" /> متصل</> : <><WifiOff className="w-3 h-3 ml-1" /> غير متصل - العمل بدون إنترنت</>}
      </div>

      {successMsg && (
        <div className="fixed top-12 right-4 z-50 bg-success text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="flex gap-4 h-[calc(100vh-8rem)] p-4">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border-soft">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث بالاسم..." className="w-full pr-10 pl-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" />
            </div>
          </div>

          <div className="flex gap-2 p-4 border-b border-border-soft overflow-x-auto">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${activeCategory === cat ? 'bg-main-purple text-white' : 'bg-bg-main text-text-secondary hover:bg-border-soft'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-light text-sm">لا توجد منتجات</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <button key={product.id} onClick={() => addToCart(product)}
                    className="bg-bg-main rounded-xl p-4 border border-border-soft hover:border-main-purple hover:shadow-md transition-all text-right cursor-pointer">
                    <div className="w-full aspect-square bg-border-soft rounded-lg mb-3 flex items-center justify-center text-text-light text-xs">صورة</div>
                    <p className="text-sm font-medium line-clamp-1">{product.nameAr}</p>
                    <p className="text-sm font-bold text-main-purple mt-1">{(product.price / 100).toFixed(2)} SAR</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-96 flex flex-col bg-white rounded-xl border border-border-soft shadow-sm">
          <div className="p-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> السلة
              {cart.length > 0 && <span className="bg-main-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
            </h2>
            {cart.length > 0 && <button onClick={clearCart} className="text-xs text-error hover:text-error/80 cursor-pointer">مسح</button>}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-light text-sm gap-2">
                <ShoppingCart className="w-10 h-10 opacity-30" />
                <p>السلة فارغة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.nameAr}</p>
                    <p className="text-xs text-text-light mt-0.5">{(item.price / 100).toFixed(2)} SAR × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 mr-3">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-7 h-7 rounded-full bg-border-soft hover:bg-border-soft/70 flex items-center justify-center cursor-pointer"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-7 h-7 rounded-full bg-border-soft hover:bg-border-soft/70 flex items-center justify-center cursor-pointer"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border-soft space-y-3">
            {showNoteInput && (
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-text-light" />
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="أضف ملاحظة..." className="flex-1 px-3 py-1.5 text-xs bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" />
                {note && <button onClick={() => { setNote(''); setShowNoteInput(false) }} className="text-text-light hover:text-error cursor-pointer"><X className="w-4 h-4" /></button>}
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">المجموع</span>
              <span className="font-medium">{(subtotal / 100).toFixed(2)} SAR</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">ضريبة (15%)</span>
              <span className="font-medium">{(vat / 100).toFixed(2)} SAR</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span>{(total / 100).toFixed(2)} SAR</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowNoteInput(true)} className="flex-1 px-3 py-2.5 text-xs font-medium border border-border-soft rounded-lg hover:bg-bg-main flex items-center justify-center gap-1.5 cursor-pointer"><StickyNote className="w-4 h-4" /> ملاحظة</button>
            </div>

            <button onClick={() => setShowPayment(true)} disabled={cart.length === 0}
              className="w-full py-3 rounded-xl text-sm font-bold bg-main-purple text-white hover:bg-light-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
              <Banknote className="w-5 h-5" /> متابعة إلى الدفع
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal total={total} onComplete={completeSale} onClose={() => setShowPayment(false)} submitting={submitting} />
      )}
    </>
  )
}
