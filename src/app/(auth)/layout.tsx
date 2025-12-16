import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <ShoppingBag className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
            DUBAYMALL
          </span>
        </Link>
        {children}
      </div>
    </div>
  )
}
