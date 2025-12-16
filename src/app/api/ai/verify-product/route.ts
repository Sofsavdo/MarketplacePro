import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, description, category, price, images } = body

    if (!title || !description || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await aiService.verifyProduct({
      title,
      description,
      category,
      price,
      images: images || [],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Product verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
