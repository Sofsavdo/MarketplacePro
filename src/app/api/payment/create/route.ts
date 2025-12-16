import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { orderId, amount, method, returnUrl } = body

    if (!orderId || !amount || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await paymentService.processPayment(method, {
      orderId,
      amount,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/order-success`,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    )
  }
}
