'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('user', JSON.stringify(res.user))
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-border-soft p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-main-purple">Prime Cloud</h1>
          <p className="text-sm text-text-secondary mt-1">تسجيل الدخول إلى لوحة التحكم</p>
        </div>
        {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors"
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple transition-colors"
              required
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold bg-main-purple text-white hover:bg-light-purple transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
