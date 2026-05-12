import { useState } from 'react'

interface LoginScreenProps {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('بيانات الدخول غير صحيحة')
      const data = await res.json()
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLogin()
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-border-soft p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-main-purple">Prime POS</h1>
          <p className="text-sm text-text-secondary mt-1">تسجيل الدخول</p>
        </div>
        {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" required dir="ltr" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" required dir="ltr" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold bg-main-purple text-white hover:bg-light-purple transition-colors disabled:opacity-40 cursor-pointer">
            {loading ? 'جاري...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
