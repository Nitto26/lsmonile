import { NextResponse } from 'next/server';

const ADMIN_PIN = process.env.ADMIN_PIN || '8888';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin || pin.toString().trim() !== ADMIN_PIN.toString().trim()) {
      return NextResponse.json({ success: false, error: 'Invalid Admin Passcode' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
    
    // Set a session cookie for admin
    response.cookies.set('ls_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuthenticated = cookieHeader.includes('ls_admin_session=authenticated');
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('ls_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
