import { NextRequest, NextResponse } from 'next/server'

// Mock reviews storage (shared with main reviews route)
const reviews: any[] = []

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    
    // Only sellers can respond to reviews
    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Faqat sotuvchilar javob yozishi mumkin' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { response } = body

    if (!response || response.trim().length === 0) {
      return NextResponse.json(
        { error: 'Javob matni majburiy' },
        { status: 400 }
      )
    }

    const review = reviews.find(r => r.id === id)

    if (!review) {
      return NextResponse.json(
        { error: 'Sharh topilmadi' },
        { status: 404 }
      )
    }

    // Check if seller owns this product
    if (review.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Siz faqat o\'z mahsulotlaringizga javob yozishingiz mumkin' },
        { status: 403 }
      )
    }

    review.sellerResponse = {
      response,
      respondedAt: new Date().toISOString(),
      sellerName: user.full_name,
    }
    review.updatedAt = new Date().toISOString()

    return NextResponse.json({ review })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    
    if (user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Faqat sotuvchilar javobni o\'chirishi mumkin' },
        { status: 403 }
      )
    }

    const review = reviews.find(r => r.id === id)

    if (!review) {
      return NextResponse.json(
        { error: 'Sharh topilmadi' },
        { status: 404 }
      )
    }

    if (review.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Siz faqat o\'z javobingizni o\'chirishingiz mumkin' },
        { status: 403 }
      )
    }

    review.sellerResponse = null
    review.updatedAt = new Date().toISOString()

    return NextResponse.json({ review })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
