import { NextRequest, NextResponse } from 'next/server'
import { telegramBot } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different update types
    if (body.message) {
      const message = body.message
      const chatId = message.chat.id
      const text = message.text
      const userName = message.from.first_name

      // Handle commands
      if (text?.startsWith('/')) {
        await handleCommand(chatId, text, userName)
      }
    }

    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const chatId = callbackQuery.message.chat.id
      const data = callbackQuery.data

      await handleCallback(chatId, data)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleCommand(chatId: number, command: string, userName: string) {
  switch (command) {
    case '/start':
      await telegramBot.sendMessage(
        chatId,
        `👋 Assalomu alaykum, <b>${userName}</b>!\n\n` +
        `🎉 DUBAYMALL botiga xush kelibsiz!\n\n` +
        `📱 Ushbu bot orqali siz:\n` +
        `• Mahsulotlar haqida ma'lumot olishingiz\n` +
        `• Promo materiallar olishingiz\n` +
        `• Statistikangizni ko'rishingiz mumkin\n\n` +
        `🚀 Boshlash uchun /help buyrug'ini yuboring`
      )
      break

    case '/help':
      await telegramBot.sendMessage(
        chatId,
        `📚 <b>Yordam</b>\n\n` +
        `<b>Blogerlar uchun:</b>\n` +
        `/products - Mahsulotlar katalogi\n` +
        `/promo - Promo materiallar olish\n` +
        `/stats - Statistika\n` +
        `/earnings - Daromadlar\n\n` +
        `<b>Sotuvchilar uchun:</b>\n` +
        `/orders - Buyurtmalar\n` +
        `/stats - Statistika\n` +
        `/finance - Moliya\n\n` +
        `❓ Savollar bo'lsa: @dubaymall_support`
      )
      break

    case '/products':
      await telegramBot.sendMessage(
        chatId,
        `📦 <b>Mahsulotlar katalogi</b>\n\n` +
        `Mahsulotlarni ko'rish uchun veb-saytga o'ting:\n` +
        `🔗 https://dubaymall.uz/blogger/products\n\n` +
        `Yoki quyidagi tugmani bosing:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🛍️ Mahsulotlar', url: 'https://dubaymall.uz/blogger/products' }],
            ],
          },
        }
      )
      break

    case '/stats':
      // Mock statistics
      await telegramBot.sendMessage(
        chatId,
        `📊 <b>Sizning statistikangiz</b>\n\n` +
        `💰 Jami daromad: <b>8,450,000 so'm</b>\n` +
        `👆 Kliklar: <b>2,345</b>\n` +
        `🛒 Sotuvlar: <b>112</b>\n` +
        `📈 Konversiya: <b>4.8%</b>\n\n` +
        `⏰ Kutilmoqda: <b>2,150,000 so'm</b> (14 kun)\n\n` +
        `📱 Batafsil: https://dubaymall.uz/blogger/analytics`
      )
      break

    case '/earnings':
      await telegramBot.sendMessage(
        chatId,
        `💰 <b>Daromadlar</b>\n\n` +
        `✅ To'langan: <b>6,300,000 so'm</b>\n` +
        `⏰ Kutilmoqda: <b>2,150,000 so'm</b>\n` +
        `💵 Mavjud: <b>0 so'm</b>\n\n` +
        `📅 Keyingi to'lov: 29 Dekabr 2024\n\n` +
        `📱 Batafsil: https://dubaymall.uz/blogger/earnings`
      )
      break

    default:
      await telegramBot.sendMessage(
        chatId,
        `❓ Noma'lum buyruq. /help ni yuboring`
      )
  }
}

async function handleCallback(chatId: number, data: string) {
  if (data.startsWith('stats_')) {
    const productId = data.replace('stats_', '')
    
    await telegramBot.sendMessage(
      chatId,
      `📊 <b>Mahsulot statistikasi</b>\n\n` +
      `📦 Mahsulot ID: ${productId}\n` +
      `👆 Kliklar: <b>456</b>\n` +
      `🛒 Sotuvlar: <b>23</b>\n` +
      `💰 Daromad: <b>3,565,000 so'm</b>\n` +
      `📈 Konversiya: <b>5.0%</b>\n\n` +
      `📱 Batafsil: https://dubaymall.uz/blogger/analytics`
    )
  }
}
