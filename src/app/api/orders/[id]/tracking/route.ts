import { NextRequest, NextResponse } from 'next/server'

// Mock tracking data
const trackingData: { [key: string]: any } = {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Mock tracking history
    const tracking = trackingData[id] || {
      orderId: id,
      currentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      history: [
        {
          status: 'pending',
          title: 'Buyurtma qabul qilindi',
          description: 'Buyurtmangiz tizimga kiritildi',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          completed: true,
        },
        {
          status: 'confirmed',
          title: 'Sotuvchi tasdiqladi',
          description: 'Mahsulot omborga tayyorlanmoqda',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          completed: true,
        },
        {
          status: 'warehouse',
          title: 'Omborga keldi',
          description: 'Mahsulot omborga yetib keldi va tekshirilmoqda',
          timestamp: null,
          completed: false,
        },
        {
          status: 'shipped',
          title: 'Yuborildi',
          description: 'Mahsulot kuryer orqali yuborildi',
          timestamp: null,
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Yetkazildi',
          description: 'Mahsulot manzilga yetkazildi',
          timestamp: null,
          completed: false,
        },
      ],
      courier: {
        name: 'Yandex Delivery',
        phone: '+998901234567',
        trackingNumber: 'YD2024001234',
      },
    }

    return NextResponse.json({ tracking })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = request.cookies.get('user_session')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    
    // Only admin and seller can update tracking
    if (user.role !== 'admin' && user.role !== 'seller') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status, note } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status majburiy' },
        { status: 400 }
      )
    }

    // Update tracking data
    if (!trackingData[id]) {
      trackingData[id] = {
        orderId: id,
        currentStatus: status,
        history: [],
      }
    }

    const newEvent = {
      status,
      title: getStatusTitle(status),
      description: note || getStatusDescription(status),
      timestamp: new Date().toISOString(),
      completed: true,
      updatedBy: user.full_name,
    }

    trackingData[id].history.push(newEvent)
    trackingData[id].currentStatus = status

    // Notification will be sent via webhook in production
    console.log(`Order ${id} status updated to ${status}`)

    return NextResponse.json({ tracking: trackingData[id] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getStatusTitle(status: string): string {
  const titles: { [key: string]: string } = {
    pending: 'Buyurtma qabul qilindi',
    confirmed: 'Sotuvchi tasdiqladi',
    warehouse: 'Omborga keldi',
    shipped: 'Yuborildi',
    delivered: 'Yetkazildi',
    cancelled: 'Bekor qilindi',
  }
  return titles[status] || status
}

function getStatusDescription(status: string): string {
  const descriptions: { [key: string]: string } = {
    pending: 'Buyurtmangiz tizimga kiritildi',
    confirmed: 'Mahsulot omborga tayyorlanmoqda',
    warehouse: 'Mahsulot omborga yetib keldi',
    shipped: 'Mahsulot kuryer orqali yuborildi',
    delivered: 'Mahsulot manzilga yetkazildi',
    cancelled: 'Buyurtma bekor qilindi',
  }
  return descriptions[status] || ''
}
