'use client'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-5">الإعدادات</h1>
      <div className="bg-white rounded-xl border border-border-soft p-5 space-y-6">
        <div>
          <h2 className="font-bold text-sm mb-3">الملف الشخصي</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">الاسم</label>
              <input type="text" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">البريد الإلكتروني</label>
              <input type="email" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" dir="ltr" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-sm mb-3">الفرع</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">اسم الفرع</label>
              <input type="text" className="w-full px-4 py-2.5 text-sm bg-bg-main border border-border-soft rounded-lg outline-none focus:border-main-purple" />
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 text-sm font-bold bg-main-purple text-white rounded-lg hover:bg-light-purple transition-colors cursor-pointer">
          حفظ التغييرات
        </button>
      </div>
    </div>
  )
}
