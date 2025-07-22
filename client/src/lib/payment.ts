import { apiRequest } from './queryClient';

export interface PaymentRequest {
  method: 'click' | 'payme';
  amount: number;
  orderId: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

export const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    if (request.method === 'click') {
      return await processClickPayment(request);
    } else if (request.method === 'payme') {
      return await processPaymePayment(request);
    } else {
      throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
};

const processClickPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // Step 1: Prepare payment with Click API
    const prepareResponse = await apiRequest('POST', '/api/payment/click/prepare', {
      amount: request.amount,
      orderId: request.orderId,
    });

    const prepareResult = await prepareResponse.json();
    
    if (prepareResult.error !== 0) {
      return {
        success: false,
        error: prepareResult.error_note || 'Click payment preparation failed',
      };
    }

    // For real implementation, redirect to Click payment page
    // This is a simplified version for demonstration
    const clickTransId = prepareResult.click_trans_id;
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, Click will call webhook to complete payment
    return {
      success: true,
      transactionId: clickTransId,
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Click payment failed',
    };
  }
};

const processPaymePayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // Step 1: Create transaction with Payme API
    const createResponse = await apiRequest('POST', '/api/payment/payme/create', {
      amount: request.amount * 100, // Payme uses cents
      orderId: request.orderId,
    });

    const createResult = await createResponse.json();
    
    if (createResult.error) {
      return {
        success: false,
        error: createResult.error.message || 'Payme payment creation failed',
      };
    }

    // For real implementation, redirect to Payme payment page
    // This is a simplified version for demonstration
    const transactionId = createResult.result.transaction;
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, Payme will call webhook to complete payment
    return {
      success: true,
      transactionId: transactionId,
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Payme payment failed',
    };
  }
};

// Utility functions for payment validation
export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000; // Max 10M UZS
};

export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
};

// Payment status tracking
export const getPaymentStatus = async (transactionId: string, method: 'click' | 'payme'): Promise<string> => {
  try {
    const response = await apiRequest('GET', `/api/payment/${method}/status/${transactionId}`, {});
    const result = await response.json();
    return result.status || 'unknown';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return 'error';
  }
};

// Webhook signature verification (for production use)
export const verifyWebhookSignature = (payload: string, signature: string, secret: string): boolean => {
  // Implementation would depend on the payment provider's signature algorithm
  // This is a placeholder for the actual verification logic
  return true;
};

// Error handling for payment responses
export const handlePaymentError = (error: any): string => {
  if (error.code) {
    switch (error.code) {
      case -32400:
        return 'Invalid payment request';
      case -32504:
        return 'Insufficient funds';
      case -32600:
        return 'Transaction cancelled';
      default:
        return error.message || 'Payment processing error';
    }
  }
  
  return error.message || 'Unknown payment error';
};
