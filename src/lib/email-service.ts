import { supabase } from './supabase-client'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  variables: string[]
}

// Email templates
export const emailTemplates = {
  welcome: {
    id: 'welcome',
    name: 'Xush kelibsiz',
    subject: 'DUBAYMALL platformasiga xush kelibsiz!',
    variables: ['userName', 'userEmail'],
    html: (userName: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xush kelibsiz, ${userName}!</h1>
          </div>
          <div class="content">
            <p>Hurmatli ${userName},</p>
            <p>DUBAYMALL platformasiga ro'yxatdan o'tganingiz uchun tashakkur!</p>
            <p>Endi siz minglab mahsulotlarni ko'rishingiz, xarid qilishingiz va o'z biznesingizni boshlashingiz mumkin.</p>
            <a href="https://dubaymall.uz" class="button">Platformaga kirish</a>
            <p>Agar savollaringiz bo'lsa, biz bilan bog'laning:</p>
            <ul>
              <li>Email: support@dubaymall.uz</li>
              <li>Telefon: +998 90 123 45 67</li>
            </ul>
          </div>
          <div class="footer">
            <p>&copy; 2024 DUBAYMALL. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  orderConfirmation: {
    id: 'order-confirmation',
    name: 'Buyurtma tasdiqlandi',
    subject: 'Buyurtmangiz qabul qilindi',
    variables: ['userName', 'orderId', 'orderTotal', 'orderItems'],
    html: (userName: string, orderId: string, orderTotal: number, orderItems: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .total { font-size: 24px; font-weight: bold; color: #10b981; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Buyurtma qabul qilindi</h1>
          </div>
          <div class="content">
            <p>Hurmatli ${userName},</p>
            <p>Buyurtmangiz muvaffaqiyatli qabul qilindi va tez orada qayta ishlanadi.</p>
            <div class="order-info">
              <p><strong>Buyurtma raqami:</strong> ${orderId}</p>
              <p><strong>Mahsulotlar:</strong></p>
              ${orderItems}
              <p class="total">Jami: ${orderTotal.toLocaleString()} so'm</p>
            </div>
            <a href="https://dubaymall.uz/orders/${orderId}" class="button">Buyurtmani ko'rish</a>
            <p>Buyurtmangiz holati haqida sizga xabar beramiz.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  orderShipped: {
    id: 'order-shipped',
    name: 'Buyurtma jo\'natildi',
    subject: 'Buyurtmangiz yo\'lda',
    variables: ['userName', 'orderId', 'trackingNumber'],
    html: (userName: string, orderId: string, trackingNumber: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 2px; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Buyurtmangiz yo'lda!</h1>
          </div>
          <div class="content">
            <p>Hurmatli ${userName},</p>
            <p>Buyurtmangiz jo'natildi va tez orada sizga yetkaziladi.</p>
            <div class="tracking">
              <p><strong>Buyurtma raqami:</strong> ${orderId}</p>
              <p><strong>Kuzatuv raqami:</strong></p>
              <p class="tracking-number">${trackingNumber}</p>
            </div>
            <a href="https://dubaymall.uz/track/${trackingNumber}" class="button">Buyurtmani kuzatish</a>
            <p>Buyurtmangiz 2-3 ish kuni ichida yetkaziladi.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  passwordReset: {
    id: 'password-reset',
    name: 'Parolni tiklash',
    subject: 'Parolni tiklash',
    variables: ['userName', 'resetLink'],
    html: (userName: string, resetLink: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Parolni tiklash</h1>
          </div>
          <div class="content">
            <p>Hurmatli ${userName},</p>
            <p>Parolni tiklash so'rovi qabul qilindi.</p>
            <p>Yangi parol o'rnatish uchun quyidagi tugmani bosing:</p>
            <a href="${resetLink}" class="button">Parolni tiklash</a>
            <div class="warning">
              <p><strong>Diqqat:</strong> Bu havola 1 soat davomida amal qiladi.</p>
              <p>Agar siz bu so'rovni yubormasangiz, bu xabarni e'tiborsiz qoldiring.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  emailVerification: {
    id: 'email-verification',
    name: 'Email tasdiqlash',
    subject: 'Email manzilingizni tasdiqlang',
    variables: ['userName', 'verificationLink'],
    html: (userName: string, verificationLink: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Email tasdiqlash</h1>
          </div>
          <div class="content">
            <p>Hurmatli ${userName},</p>
            <p>DUBAYMALL platformasiga ro'yxatdan o'tganingiz uchun tashakkur!</p>
            <p>Email manzilingizni tasdiqlash uchun quyidagi tugmani bosing:</p>
            <a href="${verificationLink}" class="button">Email ni tasdiqlash</a>
            <p>Bu havola 24 soat davomida amal qiladi.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
}

// Send email function
export async function sendEmail(data: EmailData): Promise<{ error: string | null }> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode - just log
      console.log('Email sent (mock mode):', data)
      return { error: null }
    }

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll use Supabase Edge Functions or a third-party service
    
    // Example with Supabase Edge Function:
    // const { error } = await supabase.functions.invoke('send-email', {
    //   body: data
    // })

    console.log('Email would be sent:', data)
    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Email yuborishda xatolik' }
  }
}

// Send welcome email
export async function sendWelcomeEmail(userName: string, userEmail: string): Promise<{ error: string | null }> {
  const html = emailTemplates.welcome.html(userName)
  return sendEmail({
    to: userEmail,
    subject: emailTemplates.welcome.subject,
    html,
  })
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(
  userName: string,
  userEmail: string,
  orderId: string,
  orderTotal: number,
  orderItems: string
): Promise<{ error: string | null }> {
  const html = emailTemplates.orderConfirmation.html(userName, orderId, orderTotal, orderItems)
  return sendEmail({
    to: userEmail,
    subject: emailTemplates.orderConfirmation.subject,
    html,
  })
}

// Send order shipped email
export async function sendOrderShippedEmail(
  userName: string,
  userEmail: string,
  orderId: string,
  trackingNumber: string
): Promise<{ error: string | null }> {
  const html = emailTemplates.orderShipped.html(userName, orderId, trackingNumber)
  return sendEmail({
    to: userEmail,
    subject: emailTemplates.orderShipped.subject,
    html,
  })
}

// Send password reset email
export async function sendPasswordResetEmail(
  userName: string,
  userEmail: string,
  resetLink: string
): Promise<{ error: string | null }> {
  const html = emailTemplates.passwordReset.html(userName, resetLink)
  return sendEmail({
    to: userEmail,
    subject: emailTemplates.passwordReset.subject,
    html,
  })
}

// Send email verification
export async function sendEmailVerification(
  userName: string,
  userEmail: string,
  verificationLink: string
): Promise<{ error: string | null }> {
  const html = emailTemplates.emailVerification.html(userName, verificationLink)
  return sendEmail({
    to: userEmail,
    subject: emailTemplates.emailVerification.subject,
    html,
  })
}
