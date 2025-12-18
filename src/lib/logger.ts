import { supabase } from './supabase-client'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogEntry {
  id?: string
  level: LogLevel
  message: string
  context?: string
  metadata?: Record<string, any>
  user_id?: string
  timestamp: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? `[${context}]` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${contextStr} ${message}`
  }

  private async saveToDatabase(entry: LogEntry): Promise<void> {
    if (!supabase) return

    try {
      await supabase.from('logs').insert(entry)
    } catch (error) {
      console.error('Failed to save log to database:', error)
    }
  }

  info(message: string, context?: string, metadata?: Record<string, any>): void {
    const formatted = this.formatMessage('info', message, context)
    console.log(formatted)

    if (!this.isDevelopment) {
      this.saveToDatabase({
        level: 'info',
        message,
        context,
        metadata,
        timestamp: new Date().toISOString(),
      })
    }
  }

  warn(message: string, context?: string, metadata?: Record<string, any>): void {
    const formatted = this.formatMessage('warn', message, context)
    console.warn(formatted)

    if (!this.isDevelopment) {
      this.saveToDatabase({
        level: 'warn',
        message,
        context,
        metadata,
        timestamp: new Date().toISOString(),
      })
    }
  }

  error(message: string, error?: Error, context?: string, metadata?: Record<string, any>): void {
    const formatted = this.formatMessage('error', message, context)
    console.error(formatted, error)

    const errorMetadata = {
      ...metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    }

    if (!this.isDevelopment) {
      this.saveToDatabase({
        level: 'error',
        message,
        context,
        metadata: errorMetadata,
        timestamp: new Date().toISOString(),
      })
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    if (!this.isDevelopment) return

    const formatted = this.formatMessage('debug', message, context)
    console.debug(formatted, metadata)
  }
}

export const logger = new Logger()

// Error boundary helper
export function handleError(error: Error, context?: string): void {
  logger.error('Unhandled error', error, context)
}

// API error handler
export function handleApiError(error: any, endpoint: string): { error: string } {
  const message = error?.message || 'An error occurred'
  logger.error(`API Error: ${endpoint}`, error, 'API')
  
  return {
    error: process.env.NODE_ENV === 'development' ? message : 'An error occurred. Please try again.',
  }
}

// Async error wrapper
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.error('Async operation failed', error as Error, context)
      throw error
    }
  }) as T
}
