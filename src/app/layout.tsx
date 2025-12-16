import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'DUBAYMALL - Premium E-commerce Platform',
  description: 'Premium mahsulotlar, bloger marketing va tez yetkazib berish',
  keywords: ['e-commerce', 'online shopping', 'uzbekistan', 'premium products'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
