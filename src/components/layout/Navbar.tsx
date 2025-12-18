'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, ShoppingCart, User, Search, Menu, X, Heart, Bell } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    { name: 'Bosh sahifa', href: '/' },
    { name: 'Mahsulotlar', href: '/products' },
    { name: 'Kategoriyalar', href: '/categories' },
    { name: 'Aksiyalar', href: '/deals' },
    { name: 'Blogerlar', href: '/bloggers' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
              DUBAYMALL
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulot, brend yoki kategoriya qidiring..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <Heart className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>
                <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium">{user?.full_name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50 rounded-lg">
                        Profilim
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 hover:bg-gray-50 rounded-lg">
                        Buyurtmalarim
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 hover:bg-gray-50 rounded-lg">
                        Sozlamalar
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-primary-600">
                          Admin Panel
                        </Link>
                      )}
                      {user?.role === 'seller' && (
                        <Link href="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-primary-600">
                          Sotuvchi Panel
                        </Link>
                      )}
                      {user?.role === 'blogger' && (
                        <Link href="/blogger/dashboard" className="block px-4 py-2 hover:bg-gray-50 rounded-lg text-primary-600">
                          Bloger Panel
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-red-600"
                      >
                        Chiqish
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                </Link>
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1 py-3 border-t">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                pathname === item.href
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* Search - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>

            {/* Navigation Links - Mobile */}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition font-medium ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 border-t space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-center text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition font-medium"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
