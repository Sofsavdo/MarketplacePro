const crypto = require('crypto');
const axios = require('axios');

class PaymentService {
  constructor() {
    this.clickConfig = {
      merchantId: process.env.CLICK_MERCHANT_ID,
      serviceId: process.env.CLICK_SERVICE_ID,
      secretKey: process.env.CLICK_SECRET_KEY,
      apiUrl: process.env.CLICK_API_URL || 'https://api.click.uz/v2/merchant'
    };
  }

  // Click payment integration
  async createClickPayment(orderData) {
    try {
      const { orderId, amount, phone, description } = orderData;
      
      const paymentData = {
        merchant_id: this.clickConfig.merchantId,
        service_id: this.clickConfig.serviceId,
        amount: amount,
        transaction_param: orderId,
        phone_number: phone,
        description: description || 'AFFILIMART buyurtma',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      };

      // Generate signature
      const signature = this.generateClickSignature(paymentData);
      paymentData.sign_string = signature;

      const response = await axios.post(`${this.clickConfig.apiUrl}/payment/create`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Auth': this.clickConfig.secretKey
        }
      });

      if (response.data.error_code === '0') {
        return {
          success: true,
          paymentUrl: response.data.pay_url,
          paymentId: response.data.payment_id,
          merchantId: response.data.merchant_id
        };
      } else {
        throw new Error(`Click payment error: ${response.data.error_note}`);
      }
    } catch (error) {
      console.error('Click payment error:', error);
      throw new Error('To\'lov yaratishda xatolik');
    }
  }

  // Generate Click signature
  generateClickSignature(data) {
    const { merchant_id, service_id, amount, transaction_param, phone_number } = data;
    const string = `${merchant_id}${service_id}${amount}${transaction_param}${phone_number}`;
    return crypto.createHash('sha256').update(string + this.clickConfig.secretKey).digest('hex');
  }

  // Verify Click payment
  async verifyClickPayment(paymentData) {
    try {
      const { merchant_id, service_id, amount, transaction_param, phone_number, sign_time, sign_string } = paymentData;
      
      // Verify signature
      const expectedSignature = this.generateClickSignature({
        merchant_id,
        service_id,
        amount,
        transaction_param,
        phone_number
      });

      if (sign_string !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      // Verify payment with Click API
      const response = await axios.post(`${this.clickConfig.apiUrl}/payment/status`, {
        merchant_id,
        service_id,
        payment_id: transaction_param
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Auth': this.clickConfig.secretKey
        }
      });

      if (response.data.error_code === '0') {
        return {
          success: true,
          status: response.data.status,
          paymentId: response.data.payment_id,
          amount: response.data.amount
        };
      } else {
        throw new Error(`Click verification error: ${response.data.error_note}`);
      }
    } catch (error) {
      console.error('Click verification error:', error);
      throw new Error('To\'lov tasdiqlashda xatolik');
    }
  }

  // UzCard/Humo payment (simulated for now)
  async createCardPayment(orderData) {
    try {
      const { orderId, amount, cardNumber, cardExpiry, cardCVC, description } = orderData;
      
      // Validate card number (UzCard starts with 8600, Humo with 9860)
      if (!this.validateCardNumber(cardNumber)) {
        throw new Error('Noto\'g\'ri karta raqami');
      }

      // Simulate payment processing
      const paymentId = this.generatePaymentId();
      
      // In real implementation, this would integrate with UzCard/Humo API
      const paymentResult = await this.processCardPayment({
        cardNumber,
        cardExpiry,
        cardCVC,
        amount,
        orderId,
        description
      });

      return {
        success: true,
        paymentId,
        transactionId: paymentResult.transactionId,
        status: 'completed',
        amount: amount
      };
    } catch (error) {
      console.error('Card payment error:', error);
      throw new Error('Karta to\'lovida xatolik');
    }
  }

  // Validate card number
  validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    // UzCard validation (8600)
    if (cleanNumber.startsWith('8600') && cleanNumber.length === 16) {
      return true;
    }
    
    // Humo validation (9860)
    if (cleanNumber.startsWith('9860') && cleanNumber.length === 16) {
      return true;
    }
    
    return false;
  }

  // Generate payment ID
  generatePaymentId() {
    return 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Simulate card payment processing
  async processCardPayment(paymentData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (in real implementation, this would call UzCard/Humo API)
    return {
      transactionId: 'TXN_' + Date.now(),
      status: 'success',
      message: 'To\'lov muvaffaqiyatli amalga oshirildi'
    };
  }

  // Get payment methods
  getPaymentMethods() {
    return [
      {
        id: 'click',
        name: 'Click',
        description: 'Click orqali to\'lov',
        icon: 'click-icon',
        enabled: true
      },
      {
        id: 'uzcard',
        name: 'UzCard',
        description: 'UzCard orqali to\'lov',
        icon: 'uzcard-icon',
        enabled: true
      },
      {
        id: 'humo',
        name: 'Humo',
        description: 'Humo orqali to\'lov',
        icon: 'humo-icon',
        enabled: true
      }
    ];
  }

  // Process payment based on method
  async processPayment(method, orderData) {
    switch (method) {
      case 'click':
        return await this.createClickPayment(orderData);
      case 'uzcard':
      case 'humo':
        return await this.createCardPayment(orderData);
      default:
        throw new Error('Noto\'g\'ri to\'lov usuli');
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount, reason) {
    try {
      // In real implementation, this would call the respective payment provider's refund API
      const refundId = 'REF_' + Date.now();
      
      return {
        success: true,
        refundId,
        amount,
        status: 'completed',
        reason
      };
    } catch (error) {
      console.error('Refund error:', error);
      throw new Error('Pul qaytarishda xatolik');
    }
  }
}

module.exports = PaymentService; 