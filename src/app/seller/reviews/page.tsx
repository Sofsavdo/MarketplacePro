'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, Send, Search } from 'lucide-react'

interface Review {
  id: string
  productId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  verified: boolean
  sellerResponse?: {
    response: string
    respondedAt: string
  }
  createdAt: string
}

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({})

  // Mock data
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 15 Pro Max 256GB',
        customerName: 'Alisher Karimov',
        rating: 5,
        comment: 'Ajoyib mahsulot! Tez yetkazib berishdi, hamma narsa zo\'r!',
        verified: true,
        createdAt: '2024-12-15T10:00:00Z',
      },
      {
        id: '2',
        productId: '2',
        productName: 'Samsung Galaxy S24 Ultra',
        customerName: 'Dilshod Rahimov',
        rating: 4,
        comment: 'Yaxshi telefon, lekin narxi biroz qimmat.',
        verified: true,
        sellerResponse: {
          response: 'Rahmat! Biz har doim sifatli mahsulotlar taqdim etamiz.',
          respondedAt: '2024-12-15T12:00:00Z',
        },
        createdAt: '2024-12-14T15:30:00Z',
      },
      {
        id: '3',
        productId: '1',
        productName: 'iPhone 15 Pro Max 256GB',
        customerName: 'Nodira Azimova',
        rating: 3,
        comment: 'Mahsulot yaxshi, lekin qadoqlash yomonroq edi.',
        verified: true,
        createdAt: '2024-12-13T09:15:00Z',
      },
    ]
    setReviews(mockReviews)
  }, [])

  const handleResponse = async (reviewId: string) => {
    const response = responseText[reviewId]
    if (!response || !response.trim()) return

    try {
      const res = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })

      if (res.ok) {
        setResponseText({ ...responseText, [reviewId]: '' })
        alert('Javob yuborildi!')
        // Refresh reviews
      } else {
        const data = await res.json()
        alert(data.error || 'Xatolik yuz berdi')
      }
    } catch (error) {
      alert('Javob yuborishda xatolik')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'responded' && review.sellerResponse) ||
      (filter === 'pending' && !review.sellerResponse)
    
    const matchesSearch =
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => !r.sellerResponse).length,
    responded: reviews.filter(r => r.sellerResponse).length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sharhlar</h1>
        <p className="text-gray-600 mt-1">Mijozlar sharhlari va javoblar</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Jami sharhlar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Javob kutmoqda</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Javob berilgan</div>
          <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">O'rtacha reyting</div>
          <div className="text-2xl font-bold text-primary-600">{stats.avgRating} ⭐</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Javob kutmoqda
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                filter === 'responded'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Javob berilgan
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border">
            {/* Product Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {review.productName}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>{review.customerName}</span>
                  {review.verified && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Tasdiqlangan
                    </span>
                  )}
                  <span>{new Date(review.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Seller Response */}
            {review.sellerResponse ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Sizning javobingiz</span>
                  <span className="text-xs text-blue-600">
                    {new Date(review.sellerResponse.respondedAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <p className="text-gray-700">{review.sellerResponse.response}</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={responseText[review.id] || ''}
                  onChange={(e) =>
                    setResponseText({
                      ...responseText,
                      [review.id]: e.target.value,
                    })
                  }
                  placeholder="Javob yozish..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleResponse(review.id)}
                  disabled={!responseText[review.id]?.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Yuborish
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">Sharhlar topilmadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
