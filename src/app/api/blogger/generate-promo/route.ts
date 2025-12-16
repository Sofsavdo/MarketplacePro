import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    if (user.role !== 'blogger') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate unique promo code
    const promoCode = `BLOG${user.id.toUpperCase()}${Date.now().toString().slice(-4)}`
    
    // Generate referral link
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${promoCode.toLowerCase()}`

    return NextResponse.json({
      promoCode,
      referralLink,
      commission: 20, // 20%
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
