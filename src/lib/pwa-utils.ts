// PWA Utilities for DUBAYMALL

// Register service worker
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)

        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              showUpdateNotification()
            }
          })
        })
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

// Show update notification
function showUpdateNotification(): void {
  if (confirm('Yangi versiya mavjud. Yangilashni xohlaysizmi?')) {
    window.location.reload()
  }
}

// Check if app is installed
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

// Check if device is iOS
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

// Check if device is Android
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission
  }

  return Notification.permission
}

// Show notification
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const defaultOptions: any = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    ...options,
  }

  new Notification(title, defaultOptions)
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null
  if (!('PushManager' in window)) return null

  try {
    const registration = await navigator.serviceWorker.ready
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription()
    
    if (!subscription) {
      // Subscribe to push notifications
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey ? urlBase64ToUint8Array(vapidKey) : undefined,
      } as any)
    }

    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    return null
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      return true
    }
    
    return false
  } catch (error) {
    console.error('Push unsubscription failed:', error)
    return false
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

// Check network status
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

// Listen to network status changes
export function onNetworkChange(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

// Cache important data for offline use
export async function cacheForOffline(urls: string[]): Promise<void> {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    registration.active?.postMessage({
      type: 'CACHE_URLS',
      urls,
    })
  } catch (error) {
    console.error('Caching failed:', error)
  }
}

// Background sync for offline actions
export async function registerBackgroundSync(tag: string): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  if (!('sync' in ServiceWorkerRegistration.prototype)) return

  try {
    const registration = await navigator.serviceWorker.ready
    await (registration as any).sync.register(tag)
  } catch (error) {
    console.error('Background sync registration failed:', error)
  }
}

// Share API
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    // Fallback to copy to clipboard
    if (data.url) {
      await navigator.clipboard.writeText(data.url)
      return true
    }
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    console.error('Share failed:', error)
    return false
  }
}

// Check if share is supported
export function canShare(): boolean {
  return 'share' in navigator
}

// Get device info
export function getDeviceInfo(): {
  type: 'mobile' | 'tablet' | 'desktop'
  os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown'
  browser: string
} {
  if (typeof window === 'undefined') {
    return { type: 'desktop', os: 'unknown', browser: 'unknown' }
  }

  const ua = navigator.userAgent

  // Device type
  let type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  if (/Mobile|Android|iPhone/i.test(ua)) {
    type = 'mobile'
  } else if (/iPad|Tablet/i.test(ua)) {
    type = 'tablet'
  }

  // OS
  let os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown' = 'unknown'
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'ios'
  } else if (/Android/.test(ua)) {
    os = 'android'
  } else if (/Windows/.test(ua)) {
    os = 'windows'
  } else if (/Mac/.test(ua)) {
    os = 'mac'
  } else if (/Linux/.test(ua)) {
    os = 'linux'
  }

  // Browser
  let browser = 'unknown'
  if (/Chrome/.test(ua)) browser = 'chrome'
  else if (/Safari/.test(ua)) browser = 'safari'
  else if (/Firefox/.test(ua)) browser = 'firefox'
  else if (/Edge/.test(ua)) browser = 'edge'

  return { type, os, browser }
}

// Vibrate device
export function vibrate(pattern: number | number[]): void {
  if (!('vibrate' in navigator)) return
  navigator.vibrate(pattern)
}

// Wake lock (keep screen on)
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if (!('wakeLock' in navigator)) return null

  try {
    const wakeLock = await (navigator as any).wakeLock.request('screen')
    return wakeLock
  } catch (error) {
    console.error('Wake lock failed:', error)
    return null
  }
}

// Battery status
export async function getBatteryStatus(): Promise<any> {
  if (!('getBattery' in navigator)) return null

  try {
    const battery = await (navigator as any).getBattery()
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    }
  } catch (error) {
    console.error('Battery status failed:', error)
    return null
  }
}
