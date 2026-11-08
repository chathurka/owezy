import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/core/auth/verify-jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('owezy_access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyJwt(token);

  if (!payload || payload.role !== 'admin') {
    // Access token expired or invalid — redirect to login with session-expired reason.
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('reason', 'session-expired');
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('owezy_access_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(dashboard)/:path*'],
};
