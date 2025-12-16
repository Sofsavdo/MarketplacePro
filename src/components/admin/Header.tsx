'use client'

import { Bell, Search, User, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b h-16 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right">
              <div className="text-sm font-semibold">Admin User</div>
              <div className="text-xs text-gray-500">admin@dubaymall.uz</div>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          <Link
            href="/login"
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
