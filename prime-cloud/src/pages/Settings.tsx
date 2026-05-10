import { useLanguage } from '@/contexts/LanguageContext'
import { branches } from '@/data/mockData'
import { Building2, ShieldCheck, Monitor } from 'lucide-react'

export default function Settings() {
  const { t } = useLanguage()

  const SectionCard = ({ titleEn, titleAr, children }: { titleEn: string; titleAr: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border-soft">
        <h2 className="text-lg font-bold text-text-main">{t(titleEn, titleAr)}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )

  const FormField = ({ labelEn, labelAr, defaultValue }: { labelEn: string; labelAr: string; defaultValue?: string }) => (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1">{t(labelEn, labelAr)}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full px-3 py-2 text-sm border border-border-soft rounded-lg bg-white outline-none focus:border-main-purple transition-colors"
      />
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-main">{t('Settings', 'الإعدادات')}</h1>
        <p className="text-text-secondary mt-1 text-sm">{t('Manage your business settings and preferences', 'إدارة إعدادات الشركة والتفضيلات')}</p>
      </div>

      <SectionCard titleEn="Company Information" titleAr="معلومات الشركة">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField labelEn="Company Name" labelAr="اسم الشركة" defaultValue="Prime Cloud Restaurant" />
          <FormField labelEn="Commercial Register" labelAr="السجل التجاري" defaultValue="1234567890" />
          <FormField labelEn="VAT Number" labelAr="الرقم الضريبي" defaultValue="310123456700003" />
          <FormField labelEn="Phone" labelAr="رقم الهاتف" defaultValue="+966 55 000 0000" />
          <div className="md:col-span-2">
            <FormField labelEn="Address" labelAr="العنوان" defaultValue="King Fahd Road, Jeddah, Saudi Arabia" />
          </div>
        </div>
      </SectionCard>

      <SectionCard titleEn="Logo" titleAr="الشعار">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-main-purple flex items-center justify-center">
            <span className="text-2xl font-bold text-white">PC</span>
          </div>
          <div>
            <button className="px-4 py-2 text-sm bg-main-purple hover:bg-light-purple text-white rounded-lg transition-colors cursor-pointer">
              {t('Upload Logo', 'رفع شعار')}
            </button>
            <p className="text-xs text-text-light mt-1">
              {t('Recommended size: 200x200px', 'الحجم الموصى به: 200x200 بكسل')}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard titleEn="Branches" titleAr="الفروع">
        <div className="space-y-3">
          {branches.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-main">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-main-purple" />
                <div>
                  <div className="text-sm font-medium text-text-main">{t(b.en, b.ar)}</div>
                  <div className="text-xs text-text-light">{t('Branch', 'فرع')} #{b.id}</div>
                </div>
              </div>
              <button className="text-sm text-main-purple hover:text-light-purple transition-colors cursor-pointer">
                {t('Edit', 'تعديل')}
              </button>
            </div>
          ))}
          <button className="w-full py-2 text-sm border border-dashed border-border-soft rounded-lg text-text-secondary hover:border-main-purple hover:text-main-purple transition-colors cursor-pointer">
            + {t('Add Branch', 'إضافة فرع')}
          </button>
        </div>
      </SectionCard>

      <SectionCard titleEn="Taxes & Currency" titleAr="الضرائب والعملة">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">VAT Rate</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="15"
                className="w-full px-3 py-2 pr-8 text-sm border border-border-soft rounded-lg bg-white outline-none focus:border-main-purple transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">{t('Currency', 'العملة')}</label>
            <select className="w-full px-3 py-2 text-sm border border-border-soft rounded-lg bg-white outline-none focus:border-main-purple transition-colors cursor-pointer">
              <option value="SAR">SAR - {t('Saudi Riyal', 'ريال سعودي')}</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard titleEn="Language & Region" titleAr="اللغة والمنطقة">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">{t('Default Language', 'اللغة الافتراضية')}</label>
            <select className="w-full px-3 py-2 text-sm border border-border-soft rounded-lg bg-white outline-none focus:border-main-purple transition-colors cursor-pointer">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">{t('Timezone', 'المنطقة الزمنية')}</label>
            <select className="w-full px-3 py-2 text-sm border border-border-soft rounded-lg bg-white outline-none focus:border-main-purple transition-colors cursor-pointer">
              <option value="Riyadh">Asia/Riyadh (UTC+3)</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard titleEn="ZATCA Settings" titleAr="إعدادات ZATCA">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div>
                <div className="text-sm font-medium text-text-main">{t('E-Invoicing Status', 'حالة الفوترة الإلكترونية')}</div>
                <div className="text-xs text-text-light">{t('Connected and ready', 'متصل وجاهز')}</div>
              </div>
            </div>
            <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">Active</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField labelEn="Tax Registration Number" labelAr="الرقم الضريبي" defaultValue="310123456700003" />
            <FormField labelEn="CSID Serial" labelAr="رقم CSID" defaultValue="CSID-2026-001" />
          </div>
        </div>
      </SectionCard>

      <SectionCard titleEn="POS Devices" titleAr="أجهزة POS">
        <div className="space-y-3">
          {[
            { name: 'POS #1 - Main Counter', branch: 'Al Olaya Branch', status: 'online' },
            { name: 'POS #2 - Drive Thru', branch: 'Al Olaya Branch', status: 'online' },
            { name: 'POS #3 - Main Counter', branch: 'Al Rawabi Branch', status: 'offline' },
          ].map((device, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-main">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-main-purple" />
                <div>
                  <div className="text-sm font-medium text-text-main">{device.name}</div>
                  <div className="text-xs text-text-light">{t(device.branch, device.branch)}</div>
                </div>
              </div>
              <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + (device.status === 'online' ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>
                {t(device.status === 'online' ? 'Online' : 'Offline', device.status === 'online' ? 'متصل' : 'غير متصل')}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
