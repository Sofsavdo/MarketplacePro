'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye, Sparkles } from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [filter])

  const fetchProducts = async () => {
    try {
      const url = filter === 'all' ? '/api/products' : `/api/products?status=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('Mahsulot tasdiqlandi!')
        fetchProducts()
      }
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Rad etish sababi:')
    if (!reason) return

    try {
      const response = await fetch(`/api/products/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (response.ok) {
        alert('Mahsulot rad etildi')
        fetchProducts()
      }
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  const handleAIVerify = async (id: string) => {
    try {
      const response = await fetch('/api/ai/verify-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`AI tekshiruvi: ${data.verified ? 'Tasdiqlandi' : 'Muammo topildi'}\n${data.message || ''}`)
        fetchProducts()
      } else {
        alert('AI tekshiruvida xatolik')
      }
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mahsulotlar boshqaruvi</h1>
        <p className="text-gray-600 mt-1">Mahsulotlarni tasdiqlash va boshqarish</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            {f === 'all' && 'Barchasi'}
            {f === 'pending' && 'Kutilmoqda'}
            {f === 'approved' && 'Tasdiqlangan'}
            {f === 'rejected' && 'Rad etilgan'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Yuklanmoqda...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600">Mahsulot topilmadi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex gap-6">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-600">Kategoriya: {product.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'approved' ? 'bg-green-100 text-green-700' :
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status === 'approved' && 'Tasdiqlangan'}
                      {product.status === 'pending' && 'Kutilmoqda'}
                      {product.status === 'rejected' && 'Rad etilgan'}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Narx</div>
                      <div className="font-bold text-gray-900">{product.price?.toLocaleString()} so'm</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Omborda</div>
                      <div className="font-bold text-gray-900">{product.stock} ta</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Yakuniy narx</div>
                      <div className="font-bold text-primary-600">
                        {(product.price * 1.4).toLocaleString()} so'm
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Sana</div>
                      <div className="font-bold text-gray-900">
                        {new Date(product.created_at).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                  </div>

                  {product.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Tasdiqlash
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        <XCircle className="w-5 h-5" />
                        Rad etish
                      </button>
                      <button
                        onClick={() => handleAIVerify(product.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                      >
                        <Sparkles className="w-5 h-5" />
                        AI Tekshirish
                      </button>
                      <a
                        href={`/product/${product.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                      >
                        <Eye className="w-5 h-5" />
                        Ko'rish
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
