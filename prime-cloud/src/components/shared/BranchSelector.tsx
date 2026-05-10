import { useLanguage } from '@/contexts/LanguageContext'

const branches = [
  { id: 1, en: 'Al Olaya Branch', ar: 'فرع العليا' },
  { id: 2, en: 'Al Rawabi Branch', ar: 'فرع الروابي' },
  { id: 3, en: 'Al Nakheel Branch', ar: 'فرع النخيل' },
  { id: 4, en: 'Al Salam Branch', ar: 'فرع السلام' },
]

export default function BranchSelector() {
  const { t, dir } = useLanguage()

  return (
    <select
      className="text-sm bg-bg-main border border-border-soft rounded-lg px-3 py-2 text-text-main outline-none focus:border-main-purple transition-colors cursor-pointer"
      dir={dir}
    >
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {t(b.en, b.ar)}
        </option>
      ))}
    </select>
  )
}
