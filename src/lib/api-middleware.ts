import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { getCurrentUser } from './auth-service'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Create success response
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

// Create error response
export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<{ user: any; error: NextResponse | null }> {
  try {
    const { user, error } = await getCurrentUser()

    if (error || !user) {
      return {
        user: null,
        error: errorResponse('Unauthorized', 401),
      }
    }

    return { user, error: null }
  } catch (error) {
    logger.error('Auth middleware error', error as Error, 'Middleware')
    return {
      user: null,
      error: errorResponse('Authentication failed', 401),
    }
  }
}

// Role-based authorization
export function requireRole(user: any, allowedRoles: string[]): NextResponse | null {
  if (!allowedRoles.includes(user.role)) {
    return errorResponse('Forbidden', 403)
  }
  return null
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return null
  }

  if (record.count >= maxRequests) {
    return errorResponse('Too many requests', 429)
  }

  record.count++
  return null
}

// Request validation
export async function validateRequest<T>(
  request: NextRequest,
  schema: (data: any) => { valid: boolean; errors?: string[] }
): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const body = await request.json()
    const validation = schema(body)

    if (!validation.valid) {
      return {
        data: null,
        error: errorResponse(validation.errors?.join(', ') || 'Validation failed', 400),
      }
    }

    return { data: body as T, error: null }
  } catch (error) {
    logger.error('Request validation error', error as Error, 'Middleware')
    return {
      data: null,
      error: errorResponse('Invalid request body', 400),
    }
  }
}

// API handler wrapper
export function apiHandler<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (request: NextRequest): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      // Handle OPTIONS for CORS
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { headers: corsHeaders })
      }

      // Log request
      logger.info(`${request.method} ${request.url}`, 'API')

      // Execute handler
      const response = await handler(request)

      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (error) {
      logger.error('API handler error', error as Error, 'API')
      return errorResponse('Internal server error', 500)
    }
  }
}

// Protected API handler (requires authentication)
export function protectedApiHandler<T = any>(
  handler: (request: NextRequest, user: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return apiHandler(async (request: NextRequest): Promise<NextResponse<ApiResponse<T>>> => {
    const { user, error } = await requireAuth(request)
    if (error) return error as NextResponse<ApiResponse<T>>

    return handler(request, user)
  })
}

// Admin-only API handler
export function adminApiHandler<T = any>(
  handler: (request: NextRequest, user: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return protectedApiHandler(async (request: NextRequest, user: any): Promise<NextResponse<ApiResponse<T>>> => {
    const roleError = requireRole(user, ['admin'])
    if (roleError) return roleError as NextResponse<ApiResponse<T>>

    return handler(request, user)
  })
}

// Seller-only API handler
export function sellerApiHandler<T = any>(
  handler: (request: NextRequest, user: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return protectedApiHandler(async (request: NextRequest, user: any): Promise<NextResponse<ApiResponse<T>>> => {
    const roleError = requireRole(user, ['admin', 'seller'])
    if (roleError) return roleError as NextResponse<ApiResponse<T>>

    return handler(request, user)
  })
}
