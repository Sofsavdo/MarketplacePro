import { useState, useEffect } from 'react'
import { getDeviceInfo, isOnline, onNetworkChange } from '@/lib/pwa-utils'

// Hook to detect mobile device
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook to detect device info
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo())

  useEffect(() => {
    setDeviceInfo(getDeviceInfo())
  }, [])

  return deviceInfo
}

// Hook to detect online/offline status
export function useOnlineStatus() {
  const [online, setOnline] = useState(isOnline())

  useEffect(() => {
    const cleanup = onNetworkChange(setOnline)
    return cleanup
  }, [])

  return online
}

// Hook to detect PWA install status
export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
      return true
    }

    return false
  }

  return { isInstalled, canInstall, install }
}

// Hook for touch gestures
export function useTouchGestures(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void
) {
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const minSwipeDistance = 50

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      touchEndY = e.changedTouches[0].screenY
      handleGesture()
    }

    const handleGesture = () => {
      const diffX = touchEndX - touchStartX
      const diffY = touchEndY - touchStartY

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (diffX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (diffY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])
}

// Hook for screen orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  return orientation
}

// Hook for vibration
export function useVibration() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  return vibrate
}

// Hook for battery status
export function useBattery() {
  const [battery, setBattery] = useState<{
    level: number
    charging: boolean
    chargingTime: number
    dischargingTime: number
  } | null>(null)

  useEffect(() => {
    if (!('getBattery' in navigator)) return

    ;(navigator as any).getBattery().then((battery: any) => {
      const updateBattery = () => {
        setBattery({
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        })
      }

      updateBattery()

      battery.addEventListener('levelchange', updateBattery)
      battery.addEventListener('chargingchange', updateBattery)

      return () => {
        battery.removeEventListener('levelchange', updateBattery)
        battery.removeEventListener('chargingchange', updateBattery)
      }
    })
  }, [])

  return battery
}

// Hook for pull to refresh
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  useEffect(() => {
    let startY = 0
    let currentY = 0
    let pulling = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
        pulling = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling) return

      currentY = e.touches[0].clientY
      const diff = currentY - startY

      if (diff > 100) {
        // Show refresh indicator
        document.body.style.transform = `translateY(${Math.min(diff / 3, 50)}px)`
      }
    }

    const handleTouchEnd = async () => {
      if (!pulling) return

      const diff = currentY - startY

      if (diff > 100) {
        await onRefresh()
      }

      document.body.style.transform = ''
      pulling = false
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh])
}

// Hook for haptic feedback
export function useHaptic() {
  const haptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(patterns[type])
    }
  }

  return haptic
}
