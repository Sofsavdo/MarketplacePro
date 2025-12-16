import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session')
  const { pathname } = request.nextUrl

  // Public routes - hamma kirishi mumkin
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/product',
    '/cart',
    '/checkout',
    '/order-success',
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // API routes - alohida tekshirish
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Public route - o'tkazish
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - session kerak
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const user = JSON.parse(session.value)

    // Admin routes - faqat admin
    if (pathname.startsWith('/admin')) {
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Seller routes - faqat seller
    if (pathname.startsWith('/seller')) {
      if (user.role !== 'seller') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Blogger routes - faqat blogger
    if (pathname.startsWith('/blogger')) {
      if (user.role !== 'blogger') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid session - login'ga yo'naltirish
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('user_session')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
