interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired records every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key)
      }
    }
  }

  check(identifier: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const record = this.store.get(identifier)

    if (!record || now > record.resetTime) {
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + config.windowMs,
      }
      this.store.set(identifier, newRecord)
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newRecord.resetTime,
      }
    }

    if (record.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      }
    }

    record.count++
    
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
    }
  }

  reset(identifier: string): void {
    this.store.delete(identifier)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

export const rateLimiter = new RateLimiter()

// Predefined rate limit configs
export const rateLimitConfigs = {
  // General API requests
  api: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
  
  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 300000, // 5 minutes
  },
  
  // File uploads
  upload: {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  },
  
  // Search queries
  search: {
    maxRequests: 30,
    windowMs: 60000, // 1 minute
  },
  
  // Email sending
  email: {
    maxRequests: 3,
    windowMs: 3600000, // 1 hour
  },
  
  // Payment processing
  payment: {
    maxRequests: 5,
    windowMs: 300000, // 5 minutes
  },
}

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  
  // Combine with user agent for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}-${userAgent}`
}
