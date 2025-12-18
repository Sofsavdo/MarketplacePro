import { NextRequest, NextResponse } from 'next/server'

// Mock reviews storage
const reviews: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const sellerId = searchParams.get('sellerId')

    let filteredReviews = reviews

    if (productId) {
      filteredReviews = reviews.filter(r => r.productId === productId)
    } else if (sellerId) {
      filteredReviews = reviews.filter(r => r.sellerId === sellerId)
    }

    // Calculate average rating
    const avgRating = filteredReviews.length > 0
      ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length
      : 0

    return NextResponse.json({
      reviews: filteredReviews,
      totalReviews: filteredReviews.length,
      averageRating: avgRating,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    
    // Only customers can leave reviews
    if (user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Faqat mijozlar sharh qoldirishi mumkin' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, orderId, rating, comment, images } = body

    if (!productId || !orderId || !rating) {
      return NextResponse.json(
        { error: 'Product ID, Order ID va rating majburiy' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating 1 dan 5 gacha bo\'lishi kerak' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      r => r.productId === productId && r.customerId === user.id
    )

    if (existingReview) {
      return NextResponse.json(
        { error: 'Siz bu mahsulotga allaqachon sharh qoldirgansiz' },
        { status: 400 }
      )
    }

    const newReview = {
      id: Date.now().toString(),
      productId,
      orderId,
      customerId: user.id,
      customerName: user.full_name,
      rating,
      comment: comment || '',
      images: images || [],
      sellerId: productId, // Will be fetched from product in production
      sellerResponse: null,
      helpful: 0,
      verified: true, // Verified purchase
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reviews.push(newReview)

    return NextResponse.json({ review: newReview })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
