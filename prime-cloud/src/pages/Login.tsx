import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LogIn, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { t, language, setLanguage, dir } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-main via-bg-main to-main-purple/5 p-4" dir={dir}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-border-soft p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-main-purple flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">PC</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">{t('Sign in to your account', 'تسجيل الدخول')}</h1>
            <p className="text-text-secondary mt-1">
              {t('Welcome back to Prime Cloud', 'مرحباً بك في برايم كلاود')}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                {t('Email', 'البريد الإلكتروني')}
              </label>
              <input
                type="email"
                defaultValue="admin@primecloud.sa"
                className="w-full px-4 py-2.5 border border-border-soft rounded-lg text-sm text-text-main bg-white outline-none focus:border-main-purple focus:ring-1 focus:ring-main-purple/20 transition-all"
                placeholder={t('Enter your email', 'أدخل بريدك الإلكتروني')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                {t('Password', 'كلمة المرور')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="123456"
                  className="w-full px-4 py-2.5 pr-10 border border-border-soft rounded-lg text-sm text-text-main bg-white outline-none focus:border-main-purple focus:ring-1 focus:ring-main-purple/20 transition-all"
                  placeholder={t('Enter your password', 'أدخل كلمة المرور')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border-soft text-main-purple focus:ring-main-purple" />
                <span className="text-text-secondary">{t('Remember me', 'تذكرني')}</span>
              </label>
              <a href="#" className="text-main-purple hover:text-light-purple transition-colors">
                {t('Forgot password?', 'نسيت كلمة المرور؟')}
              </a>
            </div>

            <button className="w-full py-2.5 bg-main-purple hover:bg-light-purple text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <LogIn className="w-4 h-4" />
              {t('Sign In', 'تسجيل الدخول')}
            </button>

            <button className="w-full py-2.5 border border-main-purple text-main-purple hover:bg-main-purple/5 font-medium rounded-lg transition-colors cursor-pointer">
              {t('Demo Login', 'دخول تجريبي')}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border-soft text-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-sm text-text-secondary hover:text-main-purple transition-colors cursor-pointer"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
