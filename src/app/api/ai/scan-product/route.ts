import { NextRequest, NextResponse } from 'next/server'
import { aiScanner } from '@/lib/ai-scanner'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data required' },
        { status: 400 }
      )
    }

    const result = await aiScanner.scanProduct(imageData)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Scan product error:', error)
    return NextResponse.json(
      { error: error.message || 'Scan failed' },
      { status: 500 }
    )
  }
}
