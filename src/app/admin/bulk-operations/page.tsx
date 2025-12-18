'use client'

import { useState } from 'react'
import { CheckSquare, Square, Trash2, Edit, Eye, EyeOff, Download, Upload, Tag } from 'lucide-react'

interface Product {
  id: number
  title: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive' | 'pending'
  selected: boolean
}

export default function BulkOperationsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, title: 'iPhone 15 Pro Max', price: 15500000, stock: 12, category: 'Elektronika', status: 'active', selected: false },
    { id: 2, title: 'Samsung Galaxy S24', price: 13200000, stock: 8, category: 'Elektronika', status: 'active', selected: false },
    { id: 3, title: 'MacBook Pro 14"', price: 28000000, stock: 3, category: 'Elektronika', status: 'pending', selected: false },
    { id: 4, title: 'Sony WH-1000XM5', price: 4500000, stock: 0, category: 'Elektronika', status: 'inactive', selected: false },
    { id: 5, title: 'Nike Air Max 270', price: 1800000, stock: 25, category: 'Kiyim', status: 'active', selected: false },
  ])

  const [bulkAction, setBulkAction] = useState('')
  const [bulkValue, setBulkValue] = useState('')

  const selectedCount = products.filter(p => p.selected).length
  const allSelected = products.length > 0 && products.every(p => p.selected)

  const toggleSelectAll = () => {
    setProducts(products.map(p => ({ ...p, selected: !allSelected })))
  }

  const toggleSelect = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, selected: !p.selected } : p))
  }

  const applyBulkAction = () => {
    const selectedProducts = products.filter(p => p.selected)
    
    if (selectedProducts.length === 0) {
      alert('Mahsulot tanlanmagan!')
      return
    }

    switch (bulkAction) {
      case 'delete':
        if (confirm(`${selectedCount} ta mahsulotni o'chirmoqchimisiz?`)) {
          setProducts(products.filter(p => !p.selected))
          alert('Mahsulotlar o\'chirildi!')
        }
        break
      
      case 'activate':
        setProducts(products.map(p => p.selected ? { ...p, status: 'active' } : p))
        alert('Mahsulotlar faollashtirildi!')
        break
      
      case 'deactivate':
        setProducts(products.map(p => p.selected ? { ...p, status: 'inactive' } : p))
        alert('Mahsulotlar o\'chirildi!')
        break
      
      case 'price':
        if (!bulkValue) {
          alert('Narx kiriting!')
          return
        }
        const priceChange = parseFloat(bulkValue)
        setProducts(products.map(p => p.selected ? { ...p, price: Math.max(0, p.price + priceChange) } : p))
        alert('Narxlar yangilandi!')
        setBulkValue('')
        break
      
      case 'stock':
        if (!bulkValue) {
          alert('Zaxira miqdorini kiriting!')
          return
        }
        const stockChange = parseInt(bulkValue)
        setProducts(products.map(p => p.selected ? { ...p, stock: Math.max(0, p.stock + stockChange) } : p))
        alert('Zaxira yangilandi!')
        setBulkValue('')
        break
      
      case 'category':
        if (!bulkValue) {
          alert('Kategoriya kiriting!')
          return
        }
        setProducts(products.map(p => p.selected ? { ...p, category: bulkValue } : p))
        alert('Kategoriya yangilandi!')
        setBulkValue('')
        break
      
      default:
        alert('Amal tanlang!')
    }

    setBulkAction('')
  }

  const exportSelected = () => {
    const selectedProducts = products.filter(p => p.selected)
    if (selectedProducts.length === 0) {
      alert('Mahsulot tanlanmagan!')
      return
    }

    const csv = [
      ['ID', 'Nomi', 'Narx', 'Zaxira', 'Kategoriya', 'Holat'],
      ...selectedProducts.map(p => [p.id, p.title, p.price, p.stock, p.category, p.status])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mahsulotlar.csv'
    a.click()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ommaviy Amallar</h1>
        <p className="text-gray-600">Bir nechta mahsulotni bir vaqtda boshqaring</p>
      </div>

      {/* Bulk Actions Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <span className="text-sm font-medium text-gray-700">
              {selectedCount} ta tanlandi
            </span>
            
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Amal tanlang</option>
              <option value="activate">Faollashtirish</option>
              <option value="deactivate">O'chirish</option>
              <option value="delete">O'chirish (butunlay)</option>
              <option value="price">Narxni o'zgartirish</option>
              <option value="stock">Zaxirani o'zgartirish</option>
              <option value="category">Kategoriyani o'zgartirish</option>
            </select>

            {(bulkAction === 'price' || bulkAction === 'stock' || bulkAction === 'category') && (
              <input
                type={bulkAction === 'category' ? 'text' : 'number'}
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder={
                  bulkAction === 'price' ? 'Narx o\'zgarishi (+/-)' :
                  bulkAction === 'stock' ? 'Zaxira o\'zgarishi (+/-)' :
                  'Yangi kategoriya'
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}

            <button
              onClick={applyBulkAction}
              disabled={selectedCount === 0 || !bulkAction}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Qo'llash
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={exportSelected}
              disabled={selectedCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button onClick={toggleSelectAll} className="text-gray-600 hover:text-gray-900">
                    {allSelected ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mahsulot</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Narx</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Zaxira</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategoriya</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.selected ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(product.id)} className="text-gray-600 hover:text-gray-900">
                      {product.selected ? (
                        <CheckSquare className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">#{product.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{product.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{product.price.toLocaleString('uz-UZ')} so'm</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'active' ? 'Faol' :
                       product.status === 'pending' ? 'Kutilmoqda' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Jami mahsulotlar</p>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Faol</p>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Kutilmoqda</p>
          <p className="text-3xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Nofaol</p>
          <p className="text-3xl font-bold text-gray-600">
            {products.filter(p => p.status === 'inactive').length}
          </p>
        </div>
      </div>
    </div>
  )
}
