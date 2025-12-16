import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = request.cookies.get('user_session')
  
  if (!session) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(session.value)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
