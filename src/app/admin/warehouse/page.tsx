'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react'

interface WarehouseItem {
  id: string
  product_id: string
  product_name: string
  seller_name: string
  quantity: number
  status: 'pending' | 'received' | 'inspected' | 'approved' | 'rejected' | 'shipped'
  tracking_number?: string
  received_at?: string
  inspected_at?: string
  notes?: string
  created_at: string
}

export default function WarehousePage() {
  const [items, setItems] = useState<WarehouseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchWarehouseItems()
  }, [])

  const fetchWarehouseItems = async () => {
    try {
      // Mock data
      const mockItems: WarehouseItem[] = [
        {
          id: '1',
          product_id: '1',
          product_name: 'iPhone 15 Pro Max 256GB',
          seller_name: 'TechStore UZ',
          quantity: 5,
          status: 'pending',
          tracking_number: 'WH2024001',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          product_id: '2',
          product_name: 'Samsung Galaxy S24 Ultra',
          seller_name: 'TechStore UZ',
          quantity: 3,
          status: 'received',
          tracking_number: 'WH2024002',
          received_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]
      setItems(mockItems)
    } catch (error) {
      console.error('Error fetching warehouse items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (itemId: string, newStatus: string, notes?: string) => {
    try {
      const now = new Date().toISOString()
      setItems(items.map(item => {
        if (item.id === itemId) {
          const updates: any = { status: newStatus as any }
          if (newStatus === 'received') updates.received_at = now
          if (newStatus === 'inspected') updates.inspected_at = now
          if (notes) updates.notes = notes
          return { ...item, ...updates }
        }
        return item
      }))
      alert(`Status o'zgartirildi: ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Kutilmoqda' },
      received: { color: 'bg-blue-100 text-blue-800', text: 'Qabul qilindi' },
      inspected: { color: 'bg-purple-100 text-purple-800', text: 'Tekshirildi' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Tasdiqlandi' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rad etildi' },
      shipped: { color: 'bg-gray-100 text-gray-800', text: 'Yuborildi' },
    }
    return config[status as keyof typeof config] || config.pending
  }

  const stats = {
    pending: items.filter(i => i.status === 'pending').length,
    received: items.filter(i => i.status === 'received').length,
    inspected: items.filter(i => i.status === 'inspected').length,
    approved: items.filter(i => i.status === 'approved').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ombor Boshqaruvi</h1>
        <p className="text-gray-600 mt-1">Mahsulotlarni qabul qilish va tekshirish</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Kutilmoqda</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Qabul qilindi</div>
              <div className="text-2xl font-bold text-blue-600">{stats.received}</div>
            </div>
            <Package className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Tekshirildi</div>
              <div className="text-2xl font-bold text-purple-600">{stats.inspected}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Tasdiqlandi</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <Truck className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish (mahsulot, sotuvchi, tracking)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Barcha statuslar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="received">Qabul qilindi</option>
              <option value="inspected">Tekshirildi</option>
              <option value="approved">Tasdiqlandi</option>
              <option value="rejected">Rad etildi</option>
              <option value="shipped">Yuborildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product_name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status).color}`}>
                    {getStatusBadge(item.status).text}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Sotuvchi:</span> {item.seller_name}
                  </div>
                  <div>
                    <span className="font-medium">Miqdor:</span> {item.quantity} dona
                  </div>
                  <div>
                    <span className="font-medium">Tracking:</span> {item.tracking_number}
                  </div>
                </div>
                {item.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Izoh:</span> {item.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              {item.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(item.id, 'received')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Qabul qilish
                </button>
              )}
              
              {item.status === 'received' && (
                <>
                  <button
                    onClick={() => handleStatusChange(item.id, 'inspected')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                  >
                    Tekshirildi
                  </button>
                </>
              )}
              
              {item.status === 'inspected' && (
                <>
                  <button
                    onClick={() => handleStatusChange(item.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rad etish sababi:')
                      if (reason) handleStatusChange(item.id, 'rejected', reason)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Rad etish
                  </button>
                </>
              )}

              {item.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange(item.id, 'shipped')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                >
                  <Truck className="w-4 h-4 inline mr-1" />
                  Yuborildi
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Mahsulotlar topilmadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
