'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Settings,
  Warehouse,
  BarChart3,
  ShoppingBag,
  Image,
  Tag,
  Folder,
  Brain,
  Eye,
  FileText
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Mahsulotlar', href: '/admin/products' },
  { icon: Folder, label: 'Kategoriyalar', href: '/admin/categories' },
  { icon: ShoppingCart, label: 'Buyurtmalar', href: '/admin/orders' },
  { icon: Users, label: 'Foydalanuvchilar', href: '/admin/users' },
  { icon: DollarSign, label: 'Moliya (ERP)', href: '/admin/finance' },
  { icon: FileText, label: 'Hisobotlar', href: '/admin/reports' },
  { icon: BarChart3, label: 'Ommaviy Amallar', href: '/admin/bulk-operations' },
  { icon: TrendingUp, label: 'Ticketlar', href: '/admin/tickets' },
  { icon: TrendingUp, label: 'Marketing', href: '/admin/marketing' },
  { icon: TrendingUp, label: 'Faoliyat Jurnali', href: '/admin/activity-logs' },
  { icon: Image, label: 'Bannerlar', href: '/admin/banners' },
  { icon: Tag, label: 'Promo Kodlar', href: '/admin/promos' },
  { icon: Brain, label: 'AI Sozlamalari', href: '/admin/ai-settings' },
  { icon: Warehouse, label: 'Ombor', href: '/admin/warehouse' },
  { icon: Eye, label: 'Monitoring', href: '/admin/monitoring' },
  { icon: Settings, label: 'Sozlamalar', href: '/admin/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg">DUBAYMALL</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
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
