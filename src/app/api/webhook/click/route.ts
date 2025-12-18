import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const params = await request.json()
    
    const result = await paymentService.handlePaymentCallback('click', params)

    if (!result.success) {
      return NextResponse.json({
        error: -1,
        error_note: result.error || 'Payment verification failed',
      })
    }

    // Order status will be updated via database trigger in production
    console.log(`Payment completed for order: ${result.orderId}`)

    return NextResponse.json({
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
      merchant_prepare_id: Date.now(),
      error: 0,
      error_note: 'Success',
    })
  } catch (error) {
    console.error('Click webhook error:', error)
    return NextResponse.json({
      error: -1,
      error_note: 'Internal server error',
    })
  }
}
