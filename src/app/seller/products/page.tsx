'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
    }
    
    const labels = {
      approved: 'Tasdiqlangan',
      pending: 'Kutilmoqda',
      rejected: 'Rad etilgan',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mahsulotlar</h1>
          <p className="text-gray-600 mt-1">Barcha mahsulotlaringiz</p>
        </div>
        <Link
          href="/seller/products/add"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          <PlusCircle className="w-5 h-5" />
          Mahsulot qo'shish
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mahsulot yo'q</h3>
          <p className="text-gray-600 mb-6">
            Hozircha mahsulot qo'shmagansiz. Birinchi mahsulotingizni qo'shing!
          </p>
          <Link
            href="/seller/products/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            Mahsulot qo'shish
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mahsulot</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategoriya</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Narx</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Omborda</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {product.price?.toLocaleString()} so'm
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} ta
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Ko'rish"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Tahrirlash"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="O'chirish"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
