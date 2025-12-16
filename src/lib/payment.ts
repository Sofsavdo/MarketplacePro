import crypto from 'crypto'

const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID || ''
const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID || ''
const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || ''

export interface PaymentRequest {
  orderId: string
  amount: number
  returnUrl: string
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  error?: string
}

export class PaymentService {
  // Click Payment
  async createClickPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { orderId, amount, returnUrl } = request

      // Generate Click payment URL
      const paymentUrl = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_MERCHANT_ID}&amount=${amount}&transaction_param=${orderId}&return_url=${encodeURIComponent(returnUrl)}`

      return {
        success: true,
        paymentUrl,
        transactionId: `CLICK_${Date.now()}`,
      }
    } catch (error) {
      console.error('Click payment error:', error)
      return {
        success: false,
        error: 'Payment creation failed',
      }
    }
  }

  async verifyClickPayment(params: any): Promise<boolean> {
    try {
      const {
        click_trans_id,
        service_id,
        click_paydoc_id,
        merchant_trans_id,
        amount,
        action,
        sign_time,
        sign_string,
      } = params

      // Verify signature
      const signString = `${click_trans_id}${service_id}${CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`
      const hash = crypto.createHash('md5').update(signString).digest('hex')

      return hash === sign_string
    } catch (error) {
      console.error('Click verification error:', error)
      return false
    }
  }

  // Payme Payment
  async createPaymePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { orderId, amount, returnUrl } = request

      // Generate Payme payment URL
      const paymentUrl = `https://checkout.paycom.uz/${btoa(`m=${CLICK_MERCHANT_ID};ac.order_id=${orderId};a=${amount * 100}`)}`

      return {
        success: true,
        paymentUrl,
        transactionId: `PAYME_${Date.now()}`,
      }
    } catch (error) {
      console.error('Payme payment error:', error)
      return {
        success: false,
        error: 'Payment creation failed',
      }
    }
  }

  // Uzum Bank Payment
  async createUzumPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { orderId, amount, returnUrl } = request

      // Mock Uzum payment URL
      const paymentUrl = `https://uzum.uz/payment?order=${orderId}&amount=${amount}&return=${encodeURIComponent(returnUrl)}`

      return {
        success: true,
        paymentUrl,
        transactionId: `UZUM_${Date.now()}`,
      }
    } catch (error) {
      console.error('Uzum payment error:', error)
      return {
        success: false,
        error: 'Payment creation failed',
      }
    }
  }

  async processPayment(
    method: 'click' | 'payme' | 'uzum' | 'cash',
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    switch (method) {
      case 'click':
        return this.createClickPayment(request)
      case 'payme':
        return this.createPaymePayment(request)
      case 'uzum':
        return this.createUzumPayment(request)
      case 'cash':
        return {
          success: true,
          transactionId: `CASH_${Date.now()}`,
        }
      default:
        return {
          success: false,
          error: 'Invalid payment method',
        }
    }
  }

  async handlePaymentCallback(method: string, params: any): Promise<{
    success: boolean
    orderId?: string
    amount?: number
    error?: string
  }> {
    try {
      switch (method) {
        case 'click':
          const isValid = await this.verifyClickPayment(params)
          if (!isValid) {
            return { success: false, error: 'Invalid signature' }
          }
          return {
            success: true,
            orderId: params.merchant_trans_id,
            amount: parseFloat(params.amount),
          }

        case 'payme':
          // Implement Payme callback verification
          return {
            success: true,
            orderId: params.account?.order_id,
            amount: params.amount / 100,
          }

        default:
          return { success: false, error: 'Unknown payment method' }
      }
    } catch (error) {
      console.error('Payment callback error:', error)
      return { success: false, error: 'Callback processing failed' }
    }
  }
}

export const paymentService = new PaymentService()
