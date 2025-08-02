const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'AFFILIMART ga xush kelibsiz!';
    const template = await this.loadEmailTemplate('welcome', {
      name: user.first_name,
      email: user.email
    });

    return await this.sendEmail(user.email, subject, template);
  }

  // Send order confirmation
  async sendOrderConfirmation(order, user) {
    const subject = `Buyurtma tasdiqlandi - #${order.id}`;
    const template = await this.loadEmailTemplate('order-confirmation', {
      orderId: order.id,
      userName: user.first_name,
      totalAmount: order.total,
      orderDate: new Date(order.created_at).toLocaleDateString('uz-UZ'),
      items: order.items
    });

    return await this.sendEmail(user.email, subject, template);
  }

  // Send payment confirmation
  async sendPaymentConfirmation(payment, user) {
    const subject = 'To\'lov tasdiqlandi';
    const template = await this.loadEmailTemplate('payment-confirmation', {
      userName: user.first_name,
      amount: payment.amount,
      paymentMethod: payment.method,
      transactionId: payment.transactionId,
      date: new Date().toLocaleDateString('uz-UZ')
    });

    return await this.sendEmail(user.email, subject, template);
  }

  // Send password reset
  async sendPasswordReset(user, resetToken) {
    const subject = 'Parolni tiklash';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const template = await this.loadEmailTemplate('password-reset', {
      userName: user.first_name,
      resetUrl: resetUrl,
      expiryTime: '1 soat'
    });

    return await this.sendEmail(user.email, subject, template);
  }

  // Send affiliate earnings notification
  async sendAffiliateEarnings(blogger, earnings) {
    const subject = 'Yangi daromad!';
    const template = await this.loadEmailTemplate('affiliate-earnings', {
      bloggerName: blogger.first_name,
      amount: earnings.amount,
      commission: earnings.commission,
      orderId: earnings.orderId,
      date: new Date().toLocaleDateString('uz-UZ')
    });

    return await this.sendEmail(blogger.email, subject, template);
  }

  // Send merchant notification
  async sendMerchantNotification(merchant, notification) {
    const subject = notification.subject || 'Yangi bildirishnoma';
    const template = await this.loadEmailTemplate('merchant-notification', {
      merchantName: merchant.business_name,
      message: notification.message,
      date: new Date().toLocaleDateString('uz-UZ')
    });

    return await this.sendEmail(merchant.email, subject, template);
  }

  // Send smart rewards notification
  async sendSmartRewardsNotification(user, reward) {
    const subject = 'Yangi mukofot!';
    const template = await this.loadEmailTemplate('smart-rewards', {
      userName: user.first_name,
      rewardType: reward.type,
      points: reward.points,
      description: reward.description
    });

    return await this.sendEmail(user.email, subject, template);
  }

  // Send newsletter
  async sendNewsletter(subscribers, newsletter) {
    const subject = newsletter.subject;
    const template = await this.loadEmailTemplate('newsletter', {
      content: newsletter.content,
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe`
    });

    const results = [];
    for (const subscriber of subscribers) {
      try {
        const result = await this.sendEmail(subscriber.email, subject, template);
        results.push({ email: subscriber.email, success: true, result });
      } catch (error) {
        results.push({ email: subscriber.email, success: false, error: error.message });
      }
    }

    return results;
  }

  // Load email template
  async loadEmailTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
      let template = await fs.readFile(templatePath, 'utf8');
      
      // Replace placeholders with data
      Object.keys(data).forEach(key => {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), data[key]);
      });

      return template;
    } catch (error) {
      console.error(`Email template error: ${error.message}`);
      // Return a simple fallback template
      return this.getFallbackTemplate(templateName, data);
    }
  }

  // Get fallback template
  getFallbackTemplate(templateName, data) {
    const templates = {
      welcome: `
        <h2>Xush kelibsiz!</h2>
        <p>Hurmatli {{name}},</p>
        <p>AFFILIMART ga xush kelibsiz! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.</p>
        <p>Batafsil ma'lumot uchun: {{email}}</p>
      `,
      'order-confirmation': `
        <h2>Buyurtma tasdiqlandi</h2>
        <p>Buyurtma raqami: #{{orderId}}</p>
        <p>Jami summa: {{totalAmount}} UZS</p>
        <p>Sana: {{orderDate}}</p>
      `,
      'payment-confirmation': `
        <h2>To'lov tasdiqlandi</h2>
        <p>Summa: {{amount}} UZS</p>
        <p>To'lov usuli: {{paymentMethod}}</p>
        <p>Transaksiya ID: {{transactionId}}</p>
      `,
      'password-reset': `
        <h2>Parolni tiklash</h2>
        <p>Parolni tiklash uchun quyidagi havolani bosing:</p>
        <a href="{{resetUrl}}">Parolni tiklash</a>
        <p>Havola {{expiryTime}} muddatida amal qiladi.</p>
      `,
      'affiliate-earnings': `
        <h2>Yangi daromad!</h2>
        <p>Summa: {{amount}} UZS</p>
        <p>Komissiya: {{commission}} UZS</p>
        <p>Buyurtma ID: {{orderId}}</p>
      `,
      'merchant-notification': `
        <h2>Yangi bildirishnoma</h2>
        <p>{{message}}</p>
      `,
      'smart-rewards': `
        <h2>Yangi mukofot!</h2>
        <p>Mukofot turi: {{rewardType}}</p>
        <p>Ballar: {{points}}</p>
        <p>{{description}}</p>
      `,
      newsletter: `
        <h2>Yangiliklar</h2>
        <div>{{content}}</div>
        <p><a href="{{unsubscribeUrl}}">Obunani bekor qilish</a></p>
      `
    };

    let template = templates[templateName] || '<p>Email xabari</p>';
    
    // Replace placeholders
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), data[key]);
    });

    return template;
  }

  // Send email
  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"AFFILIMART" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html,
        text: text || this.htmlToText(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${result.messageId}`);
      
      return {
        success: true,
        messageId: result.messageId,
        to: to
      };
    } catch (error) {
      console.error(`Email sending error to ${to}:`, error);
      throw new Error(`Email yuborishda xatolik: ${error.message}`);
    }
  }

  // Convert HTML to text
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email serverga ulanish muvaffaqiyatli' };
    } catch (error) {
      return { success: false, message: `Email server xatosi: ${error.message}` };
    }
  }
}

module.exports = EmailService; 
module.exports = new EmailService(); 