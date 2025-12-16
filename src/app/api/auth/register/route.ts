import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, full_name, phone, role } = body

    if (!email || !password || !full_name || !phone) {
      return NextResponse.json(
        { error: 'Barcha maydonlar majburiy' },
        { status: 400 }
      )
    }

    const user = await db.register({
      email,
      password,
      full_name,
      phone,
      role: role || 'customer',
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })

    response.cookies.set('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ro\'yxatdan o\'tish xatosi' },
      { status: 400 }
    )
  }
}
