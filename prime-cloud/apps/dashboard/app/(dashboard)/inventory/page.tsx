'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface InventoryItem {
  id: string
  productId: string
  quantity: number
  product?: { name: string; nameAr: string; price: number }
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/inventory').then((res) => {
      setItems(Array.isArray(res) ? res : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">المخزون</h1>
      <div className="bg-white rounded-xl border border-border-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-main border-b border-border-soft">
              <th className="text-right p-4 font-medium text-text-secondary">المنتج</th>
              <th className="text-right p-4 font-medium text-text-secondary">الكمية</th>
              <th className="text-right p-4 font-medium text-text-secondary">السعر</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border-soft hover:bg-bg-main/50">
                <td className="p-4">{item.product?.nameAr || item.productId.slice(0, 8)}</td>
                <td className="p-4">
                  <span className={`font-medium ${item.quantity <= 0 ? 'text-error' : 'text-text-main'}`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="p-4 text-text-secondary">
                  {item.product ? `${(item.product.price / 100).toFixed(2)} SAR` : '—'}
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-text-light">لا توجد عناصر في المخزون</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
