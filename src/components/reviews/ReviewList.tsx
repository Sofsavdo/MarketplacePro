'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, MessageSquare, Send } from 'lucide-react'

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  images?: string[]
  verified: boolean
  helpful: number
  sellerResponse?: {
    response: string
    respondedAt: string
    sellerName: string
  }
  createdAt: string
}

interface ReviewListProps {
  productId: string
  userRole?: string
  userId?: string
  sellerId?: string
}

export default function ReviewList({ productId, userRole, userId, sellerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.totalReviews || 0)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSellerResponse = async (reviewId: string) => {
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
        fetchReviews()
        alert('Javob yuborildi!')
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

  if (loading) {
    return <div className="text-center py-8">Yuklanmoqda...</div>
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews} ta sharh
            </div>
          </div>
          
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 w-8">{rating} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">Hali sharhlar yo'q</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.customerName}
                    </span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Tasdiqlangan xaridor
                      </span>
                    )}
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                </span>
              </div>

              {/* Review Content */}
              {review.comment && (
                <p className="text-gray-700 mb-4">{review.comment}</p>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Review"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition">
                <ThumbsUp className="w-4 h-4" />
                Foydali ({review.helpful})
              </button>

              {/* Seller Response */}
              {review.sellerResponse && (
                <div className="mt-4 ml-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Sotuvchi javobi
                    </span>
                    <span className="text-xs text-blue-600">
                      {new Date(review.sellerResponse.respondedAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.sellerResponse.response}</p>
                </div>
              )}

              {/* Seller Response Form */}
              {userRole === 'seller' && !review.sellerResponse && (
                <div className="mt-4 ml-8">
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
                      onClick={() => handleSellerResponse(review.id)}
                      disabled={!responseText[review.id]?.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
