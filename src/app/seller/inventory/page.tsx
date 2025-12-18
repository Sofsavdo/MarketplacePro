'use client'

import { useState, useEffect } from 'react'
import { Package, AlertTriangle, TrendingDown, TrendingUp, RefreshCw, Download, Plus } from 'lucide-react'

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  unitCost: number
  totalValue: number
  lastRestocked: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export default function SellerInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    // Mock data
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 15 Pro Max 256GB',
        sku: 'IPH15PM256',
        currentStock: 45,
        minStock: 10,
        maxStock: 100,
        reorderPoint: 20,
        unitCost: 14000000,
        totalValue: 630000000,
        lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_stock',
      },
      {
        id: '2',
        productId: '2',
        productName: 'Samsung Galaxy S24 Ultra',
        sku: 'SAMS24U512',
        currentStock: 8,
        minStock: 10,
        maxStock: 80,
        reorderPoint: 15,
        unitCost: 12000000,
        totalValue: 96000000,
        lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'low_stock',
      },
      {
        id: '3',
        productId: '3',
        productName: 'MacBook Pro 14" M3',
        sku: 'MBP14M3',
        currentStock: 0,
        minStock: 5,
        maxStock: 30,
        reorderPoint: 8,
        unitCost: 25000000,
        totalValue: 0,
        lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'out_of_stock',
      },
    ]
    
    setInventory(mockInventory)
    setLoading(false)
  }

  const filteredInventory = inventory.filter(item => 
    filter === 'all' || item.status === filter
  )

  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length
  const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Mavjud'
      case 'low_stock': return 'Kam qoldi'
      case 'out_of_stock': return 'Tugagan'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ombor Boshqaruvi</h1>
        <p className="text-gray-600">Mahsulotlar zaxirasini kuzatib boring</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Jami mahsulotlar</p>
          <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ombor qiymati</p>
          <p className="text-3xl font-bold text-gray-900">
            {(totalValue / 1000000000).toFixed(1)}B
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Kam qolgan</p>
          <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tugagan</p>
          <p className="text-3xl font-bold text-gray-900">{outOfStockItems}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Barchasi' : 
                 f === 'in_stock' ? 'Mavjud' :
                 f === 'low_stock' ? 'Kam qolgan' : 'Tugagan'}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Yangilash</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mahsulot</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Zaxira</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min/Max</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Narx</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jami qiymat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Oxirgi to'ldirish: {new Date(item.lastRestocked).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-600">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{item.currentStock}</span>
                      {item.currentStock <= item.reorderPoint && (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {item.minStock} / {item.maxStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {(item.unitCost / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {(item.totalValue / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center space-x-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                      <Plus className="w-4 h-4" />
                      <span>To'ldirish</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
