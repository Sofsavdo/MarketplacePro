import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userSession = request.cookies.get('user_session')
    
    if (!userSession) {
      return NextResponse.json(
        { error: 'Autentifikatsiya talab qilinadi' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userSession.value)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Xatolik yuz berdi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userSession = request.cookies.get('user_session')
    
    if (!userSession) {
      return NextResponse.json(
        { error: 'Autentifikatsiya talab qilinadi' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userSession.value)
    const updates = await request.json()

    // Update user data (in production, update in database)
    const updatedUser = {
      ...user,
      full_name: updates.full_name || user.full_name,
      phone: updates.phone || user.phone,
      address: updates.address || user.address,
    }

    // Update session cookie
    const response = NextResponse.json({
      success: true,
      user: updatedUser,
    })

    response.cookies.set('user_session', JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Yangilash xatosi' },
      { status: 500 }
    )
  }
}
