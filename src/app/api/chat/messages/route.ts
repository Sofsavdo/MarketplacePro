import { NextRequest, NextResponse } from 'next/server'

// Mock chat messages
const messages: any[] = []

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')
    const productId = searchParams.get('productId')

    // Filter messages based on user role and context
    let filteredMessages = messages.filter(msg => {
      if (orderId) return msg.orderId === orderId
      if (productId) return msg.productId === productId
      
      // Admin sees all messages
      if (user.role === 'admin') return true
      
      // Seller sees messages related to their products
      if (user.role === 'seller') {
        return msg.sellerId === user.id || msg.recipientId === user.id
      }
      
      // Customer sees their own messages
      if (user.role === 'customer') {
        return msg.senderId === user.id || msg.recipientId === user.id
      }
      
      return false
    })

    return NextResponse.json({ messages: filteredMessages })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    const body = await request.json()
    const { recipientId, message, orderId, productId } = body

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: 'Recipient and message required' },
        { status: 400 }
      )
    }

    // Check for forbidden content (phone numbers, external links)
    const forbiddenPatterns = [
      /\+?\d{3}[-.\s]?\d{2}[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}/g, // Phone numbers
      /\d{9,}/g, // Long numbers
      /@\w+/g, // Social media handles
      /telegram\.me/gi,
      /t\.me/gi,
      /whatsapp/gi,
      /wa\.me/gi,
    ]

    const hasForbiddenContent = forbiddenPatterns.some(pattern => 
      pattern.test(message)
    )

    if (hasForbiddenContent) {
      return NextResponse.json(
        { 
          error: 'Xabar qoidalarga mos emas. Telefon raqam, ijtimoiy tarmoq havolalari yoki tashqi aloqa ma\'lumotlarini yuborish taqiqlanadi.',
          blocked: true 
        },
        { status: 400 }
      )
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.full_name,
      senderRole: user.role,
      recipientId,
      message,
      orderId,
      productId,
      timestamp: new Date().toISOString(),
      read: false,
      flagged: hasForbiddenContent,
    }

    messages.push(newMessage)

    // Log flagged messages for admin review
    if (hasForbiddenContent) {
      console.log(`Flagged message from ${user.full_name}: ${message}`)
    }

    return NextResponse.json({ message: newMessage })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
