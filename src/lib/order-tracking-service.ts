import { supabase } from './supabase-client'

export interface OrderStatus {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  label: string
  description: string
  icon: string
  color: string
}

export interface OrderTrackingEvent {
  id: string
  order_id: string
  status: string
  title: string
  description: string
  location?: string
  timestamp: string
  created_by?: string
}

export interface OrderTracking {
  order_id: string
  current_status: string
  events: OrderTrackingEvent[]
  estimated_delivery?: string
  tracking_number?: string
}

// Order status definitions
export const ORDER_STATUSES: Record<string, OrderStatus> = {
  pending: {
    status: 'pending',
    label: 'Kutilmoqda',
    description: 'Buyurtma qabul qilinmoqda',
    icon: 'Clock',
    color: 'yellow',
  },
  confirmed: {
    status: 'confirmed',
    label: 'Tasdiqlandi',
    description: 'Buyurtma tasdiqlandi',
    icon: 'CheckCircle',
    color: 'blue',
  },
  processing: {
    status: 'processing',
    label: 'Tayyorlanmoqda',
    description: 'Buyurtma tayyorlanmoqda',
    icon: 'Package',
    color: 'purple',
  },
  shipped: {
    status: 'shipped',
    label: 'Jo\'natildi',
    description: 'Buyurtma yo\'lda',
    icon: 'Truck',
    color: 'indigo',
  },
  delivered: {
    status: 'delivered',
    label: 'Yetkazildi',
    description: 'Buyurtma yetkazildi',
    icon: 'CheckCircle2',
    color: 'green',
  },
  cancelled: {
    status: 'cancelled',
    label: 'Bekor qilindi',
    description: 'Buyurtma bekor qilindi',
    icon: 'XCircle',
    color: 'red',
  },
}

// Get order tracking
export async function getOrderTracking(orderId: string): Promise<{
  tracking: OrderTracking | null
  error: string | null
}> {
  try {
    if (!supabase) {
      // Mock mode
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = orders.find((o: any) => o.id === orderId)

      if (!order) {
        return { tracking: null, error: 'Buyurtma topilmadi' }
      }

      // Get tracking events
      const events = JSON.parse(localStorage.getItem(`tracking_${orderId}`) || '[]')

      const tracking: OrderTracking = {
        order_id: orderId,
        current_status: order.status,
        events,
        tracking_number: order.tracking_number,
        estimated_delivery: order.estimated_delivery,
      }

      return { tracking, error: null }
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return { tracking: null, error: 'Buyurtma topilmadi' }
    }

    // Get tracking events
    const { data: events, error: eventsError } = await supabase
      .from('order_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: true })

    if (eventsError) {
      return { tracking: null, error: eventsError.message }
    }

    const tracking: OrderTracking = {
      order_id: orderId,
      current_status: order.status,
      events: events as OrderTrackingEvent[],
      tracking_number: order.tracking_number,
      estimated_delivery: order.estimated_delivery,
    }

    return { tracking, error: null }
  } catch (error: any) {
    return { tracking: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Add tracking event
export async function addTrackingEvent(data: {
  order_id: string
  status: string
  title: string
  description: string
  location?: string
  created_by?: string
}): Promise<{ event: OrderTrackingEvent | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const event: OrderTrackingEvent = {
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString(),
      }

      const events = JSON.parse(localStorage.getItem(`tracking_${data.order_id}`) || '[]')
      events.push(event)
      localStorage.setItem(`tracking_${data.order_id}`, JSON.stringify(events))

      // Update order status
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const orderIndex = orders.findIndex((o: any) => o.id === data.order_id)
      if (orderIndex !== -1) {
        orders[orderIndex].status = data.status
        orders[orderIndex].updated_at = new Date().toISOString()
        localStorage.setItem('orders', JSON.stringify(orders))
      }

      return { event, error: null }
    }

    const { data: event, error } = await supabase
      .from('order_tracking_events')
      .insert({
        ...data,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { event: null, error: error.message }
    }

    // Update order status
    await supabase
      .from('orders')
      .update({
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.order_id)

    return { event: event as OrderTrackingEvent, error: null }
  } catch (error: any) {
    return { event: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Update order status with tracking
export async function updateOrderStatus(
  orderId: string,
  status: string,
  description?: string,
  location?: string
): Promise<{ error: string | null }> {
  try {
    const statusInfo = ORDER_STATUSES[status]
    if (!statusInfo) {
      return { error: 'Noto\'g\'ri status' }
    }

    const { error } = await addTrackingEvent({
      order_id: orderId,
      status,
      title: statusInfo.label,
      description: description || statusInfo.description,
      location,
    })

    return { error }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get tracking timeline
export function getTrackingTimeline(events: OrderTrackingEvent[]): {
  completed: OrderTrackingEvent[]
  current: OrderTrackingEvent | null
  upcoming: string[]
} {
  const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const completedStatuses = events.map((e) => e.status)
  const currentStatus = completedStatuses[completedStatuses.length - 1]
  const currentIndex = allStatuses.indexOf(currentStatus)

  const upcoming = allStatuses.slice(currentIndex + 1)

  return {
    completed: events,
    current: events[events.length - 1] || null,
    upcoming,
  }
}

// Estimate delivery date
export function estimateDeliveryDate(
  orderDate: Date,
  deliveryMethod: 'standard' | 'express' | 'pickup'
): Date {
  const estimate = new Date(orderDate)

  switch (deliveryMethod) {
    case 'express':
      estimate.setDate(estimate.getDate() + 1) // 1 day
      break
    case 'standard':
      estimate.setDate(estimate.getDate() + 3) // 3 days
      break
    case 'pickup':
      estimate.setDate(estimate.getDate() + 1) // 1 day
      break
  }

  return estimate
}

// Format tracking event for display
export function formatTrackingEvent(event: OrderTrackingEvent): {
  date: string
  time: string
  title: string
  description: string
  location?: string
} {
  const timestamp = new Date(event.timestamp)

  return {
    date: timestamp.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    time: timestamp.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    title: event.title,
    description: event.description,
    location: event.location,
  }
}

// Check if order can be cancelled
export function canCancelOrder(status: string): boolean {
  return ['pending', 'confirmed'].includes(status)
}

// Check if order can be returned
export function canReturnOrder(status: string, deliveredDate?: Date): boolean {
  if (status !== 'delivered') return false
  if (!deliveredDate) return false

  const daysSinceDelivery = Math.floor(
    (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysSinceDelivery <= 14 // 14 days return policy
}

// Get order progress percentage
export function getOrderProgress(status: string): number {
  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const index = statusOrder.indexOf(status)

  if (index === -1) return 0
  return ((index + 1) / statusOrder.length) * 100
}

// Create default tracking events for new order
export async function createDefaultTrackingEvents(
  orderId: string
): Promise<{ error: string | null }> {
  try {
    // Add initial event
    await addTrackingEvent({
      order_id: orderId,
      status: 'pending',
      title: 'Buyurtma qabul qilindi',
      description: 'Buyurtmangiz muvaffaqiyatli qabul qilindi va ko\'rib chiqilmoqda',
    })

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}
