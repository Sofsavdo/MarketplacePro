'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  BarChart3,
  Settings,
  PlusCircle,
  ShoppingBag
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
  { icon: Package, label: 'Mahsulotlar', href: '/seller/products' },
  { icon: PlusCircle, label: 'Mahsulot qo\'shish', href: '/seller/products/add' },
  { icon: ShoppingCart, label: 'Buyurtmalar', href: '/seller/orders' },
  { icon: DollarSign, label: 'Moliya', href: '/seller/finance' },
  { icon: BarChart3, label: 'Statistika', href: '/seller/analytics' },
  { icon: Settings, label: 'Sozlamalar', href: '/seller/settings' },
]

export default function SellerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <Link href="/seller/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg">DUBAYMALL</div>
            <div className="text-xs text-gray-500">Sotuvchi Panel</div>
          </div>
        </Link>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
