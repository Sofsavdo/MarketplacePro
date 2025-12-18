import { supabase } from './supabase-client'

export interface Notification {
  id: string
  user_id: string
  type: 'order' | 'product' | 'payment' | 'system' | 'message'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

export interface CreateNotificationData {
  user_id: string
  type: Notification['type']
  title: string
  message: string
  link?: string
}

// Create notification
export async function createNotification(data: CreateNotificationData): Promise<{ notification: Notification | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const mockNotification: Notification = {
        id: Date.now().toString(),
        ...data,
        read: false,
        created_at: new Date().toISOString(),
      }

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      notifications.unshift(mockNotification)
      localStorage.setItem('notifications', JSON.stringify(notifications))

      return { notification: mockNotification, error: null }
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        ...data,
        read: false,
      })
      .select()
      .single()

    if (error) {
      return { notification: null, error: error.message }
    }

    return { notification: notification as Notification, error: null }
  } catch (error: any) {
    return { notification: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get user notifications
export async function getUserNotifications(userId: string, limit: number = 50): Promise<{ notifications: Notification[]; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const userNotifications = notifications
        .filter((n: Notification) => n.user_id === userId)
        .slice(0, limit)

      return { notifications: userNotifications, error: null }
    }

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { notifications: [], error: error.message }
    }

    return { notifications: notifications as Notification[], error: null }
  } catch (error: any) {
    return { notifications: [], error: error.message || 'Xatolik yuz berdi' }
  }
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const index = notifications.findIndex((n: Notification) => n.id === notificationId)
      
      if (index !== -1) {
        notifications[index].read = true
        localStorage.setItem('notifications', JSON.stringify(notifications))
      }

      return { error: null }
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Mark all notifications as read
export async function markAllAsRead(userId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const updated = notifications.map((n: Notification) => 
        n.user_id === userId ? { ...n, read: true } : n
      )
      localStorage.setItem('notifications', JSON.stringify(updated))

      return { error: null }
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Delete notification
export async function deleteNotification(notificationId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const filtered = notifications.filter((n: Notification) => n.id !== notificationId)
      localStorage.setItem('notifications', JSON.stringify(filtered))

      return { error: null }
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get unread count
export async function getUnreadCount(userId: string): Promise<{ count: number; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const count = notifications.filter((n: Notification) => 
        n.user_id === userId && !n.read
      ).length

      return { count, error: null }
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      return { count: 0, error: error.message }
    }

    return { count: count || 0, error: null }
  } catch (error: any) {
    return { count: 0, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Helper functions for common notifications
export async function notifyOrderCreated(userId: string, orderId: string): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'order',
    title: 'Buyurtma qabul qilindi',
    message: `Buyurtmangiz #${orderId} muvaffaqiyatli qabul qilindi`,
    link: `/orders/${orderId}`,
  })
  return { error }
}

export async function notifyOrderShipped(userId: string, orderId: string): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'order',
    title: 'Buyurtma jo\'natildi',
    message: `Buyurtmangiz #${orderId} jo'natildi va tez orada yetkaziladi`,
    link: `/orders/${orderId}`,
  })
  return { error }
}

export async function notifyOrderDelivered(userId: string, orderId: string): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'order',
    title: 'Buyurtma yetkazildi',
    message: `Buyurtmangiz #${orderId} muvaffaqiyatli yetkazildi`,
    link: `/orders/${orderId}`,
  })
  return { error }
}

export async function notifyPaymentSuccess(userId: string, orderId: string, amount: number): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'payment',
    title: 'To\'lov muvaffaqiyatli',
    message: `${amount.toLocaleString()} so'm to'lov qabul qilindi`,
    link: `/orders/${orderId}`,
  })
  return { error }
}

export async function notifyProductLowStock(userId: string, productId: string, productName: string, stock: number): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'product',
    title: 'Mahsulot tugamoqda',
    message: `${productName} mahsulotidan faqat ${stock} dona qoldi`,
    link: `/seller/products/${productId}`,
  })
  return { error }
}

export async function notifyNewMessage(userId: string, senderName: string): Promise<{ error: string | null }> {
  const { error } = await createNotification({
    user_id: userId,
    type: 'message',
    title: 'Yangi xabar',
    message: `${senderName} sizga xabar yubordi`,
    link: '/messages',
  })
  return { error }
}
