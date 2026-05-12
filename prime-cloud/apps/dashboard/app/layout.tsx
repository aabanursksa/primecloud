import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prime Cloud',
  description: 'SaaS Accounting & POS Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bg-main text-text-main font-sans antialiased">{children}</body>
    </html>
  )
}
