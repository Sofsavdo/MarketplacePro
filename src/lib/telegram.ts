const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export interface TelegramMessage {
  chat_id: number
  text: string
  parse_mode?: 'HTML' | 'Markdown'
  reply_markup?: any
}

export interface PromoMaterial {
  productId: string
  productTitle: string
  productImage: string
  price: number
  promoCode: string
  referralLink: string
  commission: number
}

export class TelegramBot {
  private token: string

  constructor(token?: string) {
    this.token = token || TELEGRAM_BOT_TOKEN
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    try {
      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          ...options,
        }),
      })
      return await response.json()
    } catch (error) {
      console.error('Telegram sendMessage error:', error)
      throw error
    }
  }

  async sendPhoto(chatId: number, photo: string, caption?: string, options?: any) {
    try {
      const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo,
          caption,
          parse_mode: 'HTML',
          ...options,
        }),
      })
      return await response.json()
    } catch (error) {
      console.error('Telegram sendPhoto error:', error)
      throw error
    }
  }

  async sendPromoMaterial(chatId: number, material: PromoMaterial) {
    const caption = this.generatePromoText(material)
    
    await this.sendPhoto(chatId, material.productImage, caption, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 Xarid qilish', url: material.referralLink },
          ],
          [
            { text: '📊 Statistika', callback_data: `stats_${material.productId}` },
          ],
        ],
      },
    })
  }

  generatePromoText(material: PromoMaterial): string {
    return `
🔥 <b>${material.productTitle}</b>

💰 Narx: <b>${material.price.toLocaleString()} so'm</b>

🎁 Sizning promo kodingiz: <code>${material.promoCode}</code>

💵 Sizning komissiyangiz: <b>${material.commission.toLocaleString()} so'm</b>

📱 Xarid qilish uchun quyidagi havolani bosing yoki promo kodni ulashing!

🔗 Havola: ${material.referralLink}

#DUBAYMALL #Chegirma #OnlineShopping
    `.trim()
  }

  async sendWelcomeMessage(chatId: number, userName: string, role: 'blogger' | 'seller') {
    const messages = {
      blogger: `
👋 Assalomu alaykum, <b>${userName}</b>!

🎉 DUBAYMALL bloger platformasiga xush kelibsiz!

Siz endi premium mahsulotlarni reklama qilib yuqori daromad olishingiz mumkin.

📊 <b>Sizning imkoniyatlaringiz:</b>
• Shaxsiy promo kod
• Referal ssilkalar
• Real-time statistika
• Avtomatik to'lovlar (14 kun)
• Yuqori komissiya

🚀 <b>Boshlash uchun:</b>
/products - Mahsulotlar katalogi
/promo - Promo materiallar
/stats - Statistika
/earnings - Daromadlar

💡 Har bir sotuvdan yuqori komissiya oling!
      `.trim(),
      seller: `
👋 Assalomu alaykum, <b>${userName}</b>!

🎉 DUBAYMALL sotuvchi platformasiga xush kelibsiz!

Siz endi o'z mahsulotlaringizni millionlab mijozlarga sotishingiz mumkin.

📊 <b>Sizning imkoniyatlaringiz:</b>
• Markaziy ombor
• Professional logistika
• Blogerlar orqali marketing
• Real-time statistika
• Avtomatik to'lovlar

🚀 <b>Boshlash uchun:</b>
/addproduct - Mahsulot qo'shish
/orders - Buyurtmalar
/stats - Statistika
/finance - Moliya

💡 Platformamiz orqali sotuvlaringizni oshiring!
      `.trim(),
    }

    await this.sendMessage(chatId, messages[role])
  }

  async sendOrderNotification(chatId: number, order: any) {
    const text = `
🎉 <b>Yangi buyurtma!</b>

📦 Buyurtma: <code>${order.orderNumber}</code>
💰 Summa: <b>${order.total.toLocaleString()} so'm</b>
👤 Mijoz: ${order.customerName}
📍 Manzil: ${order.address}

⏰ Vaqt: ${new Date(order.createdAt).toLocaleString('uz-UZ')}

🚚 Mahsulotni omborga olib keling!
    `.trim()

    await this.sendMessage(chatId, text)
  }

  async sendEarningNotification(chatId: number, earning: any) {
    const text = `
💰 <b>Yangi daromad!</b>

📦 Buyurtma: <code>${earning.orderNumber}</code>
💵 Summa: <b>${earning.amount.toLocaleString()} so'm</b>
📱 Mahsulot: ${earning.productTitle}

⏰ To'lov sanasi: ${new Date(earning.availableAt).toLocaleDateString('uz-UZ')}

✅ Daromad 14 kun ichida to'lanadi!
    `.trim()

    await this.sendMessage(chatId, text)
  }

  async setWebhook(url: string) {
    try {
      const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      return await response.json()
    } catch (error) {
      console.error('Telegram setWebhook error:', error)
      throw error
    }
  }
}

export const telegramBot = new TelegramBot()
