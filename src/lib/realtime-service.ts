import { supabase } from './supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type RealtimeCallback = (payload: any) => void

// Subscribe to table changes
export function subscribeToTable(
  table: string,
  callback: RealtimeCallback,
  filter?: { column: string; value: any }
): RealtimeChannel | null {
  if (!supabase) {
    console.log('Realtime not available in mock mode')
    return null
  }

  let channel = supabase.channel(`${table}-changes`)

  if (filter) {
    channel = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter: `${filter.column}=eq.${filter.value}`,
      },
      callback
    )
  } else {
    channel = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
      },
      callback
    )
  }

  channel.subscribe()
  return channel
}

// Subscribe to user notifications
export function subscribeToNotifications(userId: string, callback: RealtimeCallback): RealtimeChannel | null {
  return subscribeToTable('notifications', callback, { column: 'user_id', value: userId })
}

// Subscribe to order updates
export function subscribeToOrders(customerId: string, callback: RealtimeCallback): RealtimeChannel | null {
  return subscribeToTable('orders', callback, { column: 'customer_id', value: customerId })
}

// Subscribe to product updates
export function subscribeToProducts(callback: RealtimeCallback): RealtimeChannel | null {
  return subscribeToTable('products', callback)
}

// Subscribe to messages
export function subscribeToMessages(userId: string, callback: RealtimeCallback): RealtimeChannel | null {
  return subscribeToTable('messages', callback, { column: 'recipient_id', value: userId })
}

// Unsubscribe from channel
export async function unsubscribe(channel: RealtimeChannel | null): Promise<void> {
  if (channel) {
    await supabase?.removeChannel(channel)
  }
}

// Presence - track online users
export function joinPresence(channelName: string, userId: string, metadata?: any): RealtimeChannel | null {
  if (!supabase) {
    return null
  }

  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId,
      },
    },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      console.log('Online users:', state)
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
      console.log('User joined:', key, newPresences)
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
      console.log('User left:', key, leftPresences)
    })
    .subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          ...metadata,
        })
      }
    })

  return channel
}

// Broadcast - send messages to channel
export function broadcast(channel: RealtimeChannel, event: string, payload: any): void {
  channel.send({
    type: 'broadcast',
    event,
    payload,
  })
}

// Listen to broadcasts
export function listenToBroadcast(
  channelName: string,
  event: string,
  callback: (payload: any) => void
): RealtimeChannel | null {
  if (!supabase) {
    return null
  }

  const channel = supabase.channel(channelName)
  
  channel
    .on('broadcast', { event }, ({ payload }: any) => {
      callback(payload)
    })
    .subscribe()

  return channel
}

// Real-time chat
export interface ChatMessage {
  id: string
  sender_id: string
  sender_name: string
  message: string
  timestamp: string
}

export function subscribeToChatRoom(
  roomId: string,
  onMessage: (message: ChatMessage) => void,
  onUserJoin?: (userId: string) => void,
  onUserLeave?: (userId: string) => void
): RealtimeChannel | null {
  if (!supabase) {
    return null
  }

  const channel = supabase.channel(`chat-${roomId}`)

  channel
    .on('broadcast', { event: 'message' }, ({ payload }: any) => {
      onMessage(payload as ChatMessage)
    })
    .on('presence', { event: 'join' }, ({ key }: any) => {
      if (onUserJoin) onUserJoin(key)
    })
    .on('presence', { event: 'leave' }, ({ key }: any) => {
      if (onUserLeave) onUserLeave(key)
    })
    .subscribe()

  return channel
}

export function sendChatMessage(channel: RealtimeChannel, message: ChatMessage): void {
  broadcast(channel, 'message', message)
}

// Real-time statistics updates
export function subscribeToStatistics(callback: RealtimeCallback): RealtimeChannel | null {
  if (!supabase) {
    return null
  }

  const channel = supabase.channel('statistics-updates')

  // Listen to multiple tables
  channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, callback)
    .subscribe()

  return channel
}

// Typing indicator
export function sendTypingIndicator(channel: RealtimeChannel, userId: string, isTyping: boolean): void {
  broadcast(channel, 'typing', { userId, isTyping })
}

export function listenToTypingIndicator(
  channel: RealtimeChannel,
  callback: (userId: string, isTyping: boolean) => void
): void {
  channel.on('broadcast', { event: 'typing' }, ({ payload }: any) => {
    callback(payload.userId, payload.isTyping)
  })
}
